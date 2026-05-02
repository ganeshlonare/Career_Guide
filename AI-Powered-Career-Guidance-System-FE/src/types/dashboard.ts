export interface DashboardData {
  userName: string;
  userEmail: string;
  profilePicture?: string;
  careerProgress: {
    percentage: number;
    completedActivities: number;
    quizScore: number;
    weeklyPlanProgress: number;
  };
  skillsData: Array<{
    name: string;
    value: number;
  }>;
  learningProgressData: Array<{
    name: string;
    completed: number;
    total: number;
  }>;
  activityData: Array<{
    day: string;
    hours: number;
  }>;
  stats: {
    totalLearningHours: number;
    currentStreak: number;
    totalPoints: number;
    completedQuizzes: number;
    completedWeeklyPlans: number;
  };
}
