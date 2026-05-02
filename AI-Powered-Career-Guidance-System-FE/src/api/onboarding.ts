import { http } from '../lib/http';

export interface OnboardingRequest {
  collegeName: string;
  degree: string;
  branch: string;
  currentYear: number;
  currentCgpa: number;
  careerGoal: string;
  targetCompanies: string;
  preferredRoles: string;
  targetSalary: number;
  currentSkills: string;
  skillLevels: string;
  dailyStudyHours: number;
  primaryProgrammingLanguage: string;
  programmingExpertiseLevel: string;
}

export const onboardingApi = {
  submit(payload: OnboardingRequest) {
    return http<any, OnboardingRequest>({ method: 'POST', path: '/api/onboarding', body: payload });
  },
};
