import { http } from '../lib/http';
import type { QuizResult, QuizResultResponse } from '../types/quiz';

// Rate limiting cache to prevent repeated API calls
const assessmentCache = {
  questions: null as any,
  questionsTimestamp: 0,
  results: null as QuizResultResponse | null,
  resultsTimestamp: 0,
  history: null as QuizResultResponse[] | null,
  historyTimestamp: 0,
};

// Request locking to prevent simultaneous calls
const requestLocks = {
  questions: false,
  results: false,
  history: false,
};

// Cache duration in milliseconds (5 minutes for questions, 2 minutes for results)
const CACHE_DURATION = {
  questions: 5 * 60 * 1000,
  results: 2 * 60 * 1000,
  history: 5 * 60 * 1000,
};

export const assessmentApi = {
  getQuestions() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (assessmentCache.questions && 
        (now - assessmentCache.questionsTimestamp) < CACHE_DURATION.questions) {
      return Promise.resolve(assessmentCache.questions);
    }

    // Prevent simultaneous requests
    if (requestLocks.questions) {
      // Wait for existing request to complete
      return new Promise((resolve) => {
        const checkLock = () => {
          if (!requestLocks.questions) {
            if (assessmentCache.questions) {
              resolve(assessmentCache.questions);
            } else {
              // If cache is still empty after lock is released, try again
              resolve(this.getQuestions());
            }
          } else {
            setTimeout(checkLock, 100);
          }
        };
        checkLock();
      });
    }

    // Set lock and make request
    requestLocks.questions = true;
    
    return http<any>({ method: 'GET', path: '/api/quiz/questions' }).then((resp) => {
      const data = resp?.data ?? resp;
      // Cache the response
      assessmentCache.questions = data;
      assessmentCache.questionsTimestamp = now;
      requestLocks.questions = false;
      return data;
    }).catch((error) => {
      requestLocks.questions = false;
      throw error;
    });
  },

  submit(payload: { answers: { questionId: string | number; selectedOption: string }[]; timeTaken: number }) {
    // Clear cache when submitting new assessment
    assessmentCache.results = null;
    assessmentCache.resultsTimestamp = 0;
    
    return http<QuizResult, any>({ method: 'POST', path: '/api/quiz/submit', body: payload });
  },

  latestResult() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (assessmentCache.results && 
        (now - assessmentCache.resultsTimestamp) < CACHE_DURATION.results) {
      return Promise.resolve(assessmentCache.results);
    }

    return http<{ message?: string; data?: QuizResultResponse } | QuizResultResponse>({ method: 'GET', path: '/api/quiz/results' })
      .then((resp) => {
        const data = (resp as any)?.data ?? resp;
        const result = data as QuizResultResponse;
        // Cache the response
        assessmentCache.results = result;
        assessmentCache.resultsTimestamp = now;
        return result;
      });
  },

  history() {
    const now = Date.now();
    
    // Return cached data if still valid
    if (assessmentCache.history && 
        (now - assessmentCache.historyTimestamp) < CACHE_DURATION.history) {
      return Promise.resolve(assessmentCache.history);
    }

    return http<{ message?: string; data?: QuizResultResponse[] } | QuizResultResponse[]>({ method: 'GET', path: '/api/quiz/history' })
      .then((resp) => {
        const data = (resp as any)?.data ?? resp;
        const result = data as QuizResultResponse[];
        // Cache the response
        assessmentCache.history = result;
        assessmentCache.historyTimestamp = now;
        return result;
      });
  },

  retake() {
    // Clear cache when retaking assessment
    assessmentCache.questions = null;
    assessmentCache.questionsTimestamp = 0;
    assessmentCache.results = null;
    assessmentCache.resultsTimestamp = 0;
    
    return http<any, any>({ method: 'POST', path: '/api/quiz/retake' }).then((resp) => (resp as any)?.data ?? resp);
  },

  // Clear all cache manually if needed
  clearCache() {
    assessmentCache.questions = null;
    assessmentCache.questionsTimestamp = 0;
    assessmentCache.results = null;
    assessmentCache.resultsTimestamp = 0;
    assessmentCache.history = null;
    assessmentCache.historyTimestamp = 0;
  }
};
