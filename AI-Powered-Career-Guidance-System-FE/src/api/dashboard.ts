import { http } from '../lib/http';
import type { DashboardData } from '../types/dashboard';

export const dashboardApi = {
  getDashboardData() {
    return http<DashboardData, null>({ method: 'GET', path: '/api/dashboard/data' });
  },

  getUserStats() {
    return http<any, null>({ method: 'GET', path: '/api/dashboard/stats' });
  },

  getCareerProgress() {
    return http<any, null>({ method: 'GET', path: '/api/dashboard/progress' });
  }
};

export type { DashboardData } from '../types/dashboard';
