import { http } from '../lib/http';

export interface WeeklyPlanItem {
  week: number;
  title: string;
  data: { subpoint: string; youtube_link: string }[];
}

// Rate limiting cache for weekly plan API calls
const weeklyPlanCache = {
  data: null as WeeklyPlanItem[] | null,
  timestamp: 0,
};

// Request locking to prevent simultaneous calls
const requestLocks = {
  generate: false,
};

// Cache duration in milliseconds (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

export const weeklyPlanApi = {
  // Get existing weekly plans from database
  get() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (weeklyPlanCache.data && 
        (now - weeklyPlanCache.timestamp) < CACHE_DURATION) {
      return Promise.resolve(weeklyPlanCache.data);
    }

    // Prevent simultaneous requests
    if (requestLocks.generate) {
      return new Promise((resolve) => {
        const checkLock = () => {
          if (!requestLocks.generate) {
            if (weeklyPlanCache.data) {
              resolve(weeklyPlanCache.data);
            } else {
              resolve(this.get());
            }
          } else {
            setTimeout(checkLock, 100);
          }
        };
        checkLock();
      });
    }
    
    // Set lock and make request
    requestLocks.generate = true;
    
    return http<any, any>({ method: 'GET', path: '/api/weekly-plans/retrieve' }).then((resp) => {
      const data = (resp as any)?.data ?? resp;
      const result = data as WeeklyPlanItem[];
      
      // Don't cache empty arrays - this indicates no plan exists
      if (Array.isArray(result) && result.length === 0) {
        console.log("⚠️ Empty array received, not caching to allow generation");
        requestLocks.generate = false;
        return result;
      }
      
      // Cache the response only if it has data
      weeklyPlanCache.data = result;
      weeklyPlanCache.timestamp = now;
      requestLocks.generate = false;
      return result;
    }).catch((error) => {
      requestLocks.generate = false;
      throw error;
    });
  },

  // Generate new weekly plans (only if none exist)
  generate() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (weeklyPlanCache.data && 
        (now - weeklyPlanCache.timestamp) < CACHE_DURATION) {
      return Promise.resolve(weeklyPlanCache.data);
    }

    // Prevent simultaneous requests
    if (requestLocks.generate) {
      return new Promise((resolve) => {
        const checkLock = () => {
          if (!requestLocks.generate) {
            if (weeklyPlanCache.data) {
              resolve(weeklyPlanCache.data);
            } else {
              resolve(this.generate());
            }
          } else {
            setTimeout(checkLock, 100);
          }
        };
        checkLock();
      });
    }
    
    // Set lock and make request
    requestLocks.generate = true;
    
    // Backend ensures idempotency: generates once per user, returns persisted thereafter
    return http<any, any>({ method: 'POST', path: '/api/weekly-plans/generate' }).then((resp) => {
      const data = (resp as any)?.data ?? resp;
      const result = data as WeeklyPlanItem[];
      // Cache the response
      weeklyPlanCache.data = result;
      weeklyPlanCache.timestamp = now;
      requestLocks.generate = false;
      return result;
    }).catch((error) => {
      requestLocks.generate = false;
      throw error;
    });
  },

  // Clear cache manually if needed
  clearCache() {
    weeklyPlanCache.data = null;
    weeklyPlanCache.timestamp = 0;
  }
};
