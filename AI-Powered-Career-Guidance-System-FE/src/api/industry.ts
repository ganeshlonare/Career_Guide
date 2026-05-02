import { http } from '../lib/http';

export interface IndustryInsights {
  roles?: Array<{
    name: string;
    min?: number;
    median?: number;
    max?: number;
  }>;
  skills?: string[];
  trends?: Array<{ title: string; description?: string; icon?: string }>;
  updatedAt?: string;
}

export const industryApi = {
  get(force = false) {
    return http<any>({ method: 'GET', path: '/industry-insights', query: { force } }).then((resp) => {
      const data = (resp as any)?.data ?? resp;
      return data as IndustryInsights;
    });
  },
};
