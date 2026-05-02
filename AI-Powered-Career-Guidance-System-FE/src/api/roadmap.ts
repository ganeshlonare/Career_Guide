import { http } from '../lib/http';
import type { Roadmap } from '../types/roadmap';

// Request locking to prevent simultaneous calls
const requestLocks = {
  generate: false,
  getMyRoadmaps: false,
};

export const roadmapApi = {
  getMyRoadmaps() {
    // Prevent simultaneous requests
    if (requestLocks.getMyRoadmaps) {
      return new Promise((resolve) => {
        const checkLock = () => {
          if (!requestLocks.getMyRoadmaps) {
            resolve(this.getMyRoadmaps());
          } else {
            setTimeout(checkLock, 100);
          }
        };
        checkLock();
      });
    }

    requestLocks.getMyRoadmaps = true;
    
    return http<any>({ method: 'GET', path: '/api/roadmaps' }).then((resp) => {
      requestLocks.getMyRoadmaps = false;
      return (resp as any)?.data ?? resp;
    }).catch((error) => {
      requestLocks.getMyRoadmaps = false;
      throw error;
    });
  },
  getById(id: string | number) {
    return http<any>({ method: 'GET', path: `/api/roadmaps/${id}` }).then((resp) => (resp as any)?.data ?? resp);
  },
  updateStep(stepId: string, completed: boolean) {
    return http<Roadmap, { completed: boolean}>({ method: 'PATCH', path: `/api/roadmap/steps/${stepId}`, body: { completed } });
  },
  generate() {
    // Prevent simultaneous requests
    if (requestLocks.generate) {
      return new Promise((resolve) => {
        const checkLock = () => {
          if (!requestLocks.generate) {
            resolve(this.generate());
          } else {
            setTimeout(checkLock, 100);
          }
        };
        checkLock();
      });
    }

    requestLocks.generate = true;
    
    return http<any, any>({ method: 'POST', path: '/api/roadmaps/generate' }).then((resp) => {
      requestLocks.generate = false;
      const data = (resp as any)?.data ?? resp;
      return data;
    }).catch((error) => {
      requestLocks.generate = false;
      throw error;
    });
  },
};
