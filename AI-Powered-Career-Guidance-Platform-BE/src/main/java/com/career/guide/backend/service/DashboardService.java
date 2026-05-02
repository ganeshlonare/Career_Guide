package com.career.guide.backend.service;

import com.career.guide.backend.entity.User;
import com.career.guide.backend.entity.progress.UserProgress;
import com.career.guide.backend.entity.quiz.QuizResult;
import com.career.guide.backend.entity.roadmap.WeeklyPlan;
import com.career.guide.backend.repository.UserProgressRepository;
import com.career.guide.backend.repository.QuizResultRepository;
import com.career.guide.backend.repository.WeeklyPlanRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserProgressRepository userProgressRepository;
    private final QuizResultRepository quizResultRepository;
    private final WeeklyPlanRepository weeklyPlanRepository;
    private final ObjectMapper objectMapper;
    private final CacheService cacheService;

    public DashboardService(UserProgressRepository userProgressRepository,
                           QuizResultRepository quizResultRepository,
                           WeeklyPlanRepository weeklyPlanRepository,
                           ObjectMapper objectMapper,
                           CacheService cacheService) {
        this.userProgressRepository = userProgressRepository;
        this.quizResultRepository = quizResultRepository;
        this.weeklyPlanRepository = weeklyPlanRepository;
        this.objectMapper = objectMapper;
        this.cacheService = cacheService;
    }

    public Map<String, Object> getDashboardData(User user) {
        // Check cache first
        String cacheKey = cacheService.getDashboardCacheKey(user.getId());
        Map<String, Object> cachedData = (Map<String, Object>) cacheService.get(cacheKey);
        if (cachedData != null) {
            System.out.println("✅ Returning cached dashboard data for user: " + user.getId());
            return cachedData;
        }
        
        Map<String, Object> dashboardData = new HashMap<>();
        
        // User info
        dashboardData.put("userName", user.getName());
        dashboardData.put("userEmail", user.getEmail());
        dashboardData.put("profilePicture", user.getProfilePicture());
        
        // Career progress calculation
        dashboardData.put("careerProgress", calculateCareerProgress(user));
        
        // Skills data from quiz results
        dashboardData.put("skillsData", getSkillsData(user));
        
        // Learning progress from weekly plans
        dashboardData.put("learningProgressData", getLearningProgressData(user));
        
        // Activity data (last 7 days)
        dashboardData.put("activityData", getActivityData(user));
        
        // Stats
        dashboardData.put("stats", getUserStats(user));
        
        // Cache the dashboard data
        cacheService.put(cacheKey, dashboardData);
        System.out.println("✅ Cached dashboard data for user: " + user.getId());
        
        return dashboardData;
    }

    private Map<String, Object> calculateCareerProgress(User user) {
        Map<String, Object> progress = new HashMap<>();
        
        // Calculate progress based on completed activities
        List<UserProgress> allProgress = userProgressRepository.findByUserOrderByDateDesc(user);
        long completedActivities = allProgress.stream()
                .filter(p -> p.getTimeSpent() != null && p.getTimeSpent() > 0)
                .count();
        
        // Calculate progress based on quiz completion
        List<QuizResult> quizResults = quizResultRepository.findByUserOrderByCompletedAtDesc(user);
        double quizScore = quizResults.stream()
                .mapToDouble(qr -> qr.getTotalScore() != null ? qr.getTotalScore() : 0.0)
                .average()
                .orElse(0.0);
        
        // Calculate progress based on weekly plan completion
        List<WeeklyPlan> weeklyPlans = weeklyPlanRepository.findByUserOrderByWeekNumber(user);
        double weeklyPlanProgress = weeklyPlans.stream()
                .mapToDouble(wp -> wp.getCompletionPercentage() != null ? wp.getCompletionPercentage() : 0.0)
                .average()
                .orElse(0.0);
        
        // Overall progress (weighted average)
        double overallProgress = (completedActivities * 0.3 + quizScore * 0.4 + weeklyPlanProgress * 0.3);
        
        progress.put("percentage", Math.min(100, Math.round(overallProgress)));
        progress.put("completedActivities", completedActivities);
        progress.put("quizScore", Math.round(quizScore));
        progress.put("weeklyPlanProgress", Math.round(weeklyPlanProgress));
        
        return progress;
    }

    private List<Map<String, Object>> getSkillsData(User user) {
        List<QuizResult> latestQuizResult = quizResultRepository.findByUserOrderByCompletedAtDesc(user);
        
        if (latestQuizResult.isEmpty()) {
            return getDefaultSkillsData();
        }
        
        QuizResult latestResult = latestQuizResult.get(0);
        List<Map<String, Object>> skillsData = new ArrayList<>();
        
        try {
            if (latestResult.getSkillScores() != null) {
                // Parse skill scores from JSON
                Map<String, Double> skillScores = objectMapper.readValue(latestResult.getSkillScores(), Map.class);
                
                for (Map.Entry<String, Double> entry : skillScores.entrySet()) {
                    Map<String, Object> skill = new HashMap<>();
                    skill.put("name", entry.getKey());
                    skill.put("value", Math.min(100, Math.round(entry.getValue())));
                    skillsData.add(skill);
                }
            }
        } catch (Exception e) {
            // Fallback to default skills if parsing fails
            return getDefaultSkillsData();
        }
        
        return skillsData.isEmpty() ? getDefaultSkillsData() : skillsData;
    }

    private List<Map<String, Object>> getDefaultSkillsData() {
        return Arrays.asList(
            Map.of("name", "Programming", "value", 0),
            Map.of("name", "Design", "value", 0),
            Map.of("name", "Communication", "value", 0),
            Map.of("name", "Problem Solving", "value", 0)
        );
    }

    private List<Map<String, Object>> getLearningProgressData(User user) {
        List<WeeklyPlan> weeklyPlans = weeklyPlanRepository.findByUserOrderByWeekNumber(user);
        Map<String, Map<String, Integer>> categoryProgress = new HashMap<>();
        
        for (WeeklyPlan plan : weeklyPlans) {
            String category = getCategoryFromTitle(plan.getTitle());
            if (!categoryProgress.containsKey(category)) {
                categoryProgress.put(category, Map.of("completed", 0, "total", 0));
            }
            
            Map<String, Integer> current = categoryProgress.get(category);
            int completed = current.get("completed") + (plan.getCompletionPercentage() != null && plan.getCompletionPercentage() > 0 ? 1 : 0);
            int total = current.get("total") + 1;
            
            categoryProgress.put(category, Map.of("completed", completed, "total", total));
        }
        
        List<Map<String, Object>> learningProgress = new ArrayList<>();
        for (Map.Entry<String, Map<String, Integer>> entry : categoryProgress.entrySet()) {
            Map<String, Object> progress = new HashMap<>();
            progress.put("name", entry.getKey());
            progress.put("completed", entry.getValue().get("completed"));
            progress.put("total", entry.getValue().get("total"));
            learningProgress.add(progress);
        }
        
        return learningProgress.isEmpty() ? getDefaultLearningProgressData() : learningProgress;
    }

    private List<Map<String, Object>> getDefaultLearningProgressData() {
        return Arrays.asList(
            Map.of("name", "Web Dev", "completed", 0, "total", 0),
            Map.of("name", "UI/UX", "completed", 0, "total", 0),
            Map.of("name", "Data", "completed", 0, "total", 0),
            Map.of("name", "Mobile", "completed", 0, "total", 0)
        );
    }

    private String getCategoryFromTitle(String title) {
        if (title == null) return "General";
        
        if (title.toLowerCase().contains("web") || title.toLowerCase().contains("frontend") || title.toLowerCase().contains("backend")) {
            return "Web Dev";
        } else if (title.toLowerCase().contains("ui") || title.toLowerCase().contains("ux") || title.toLowerCase().contains("design")) {
            return "UI/UX";
        } else if (title.toLowerCase().contains("data") || title.toLowerCase().contains("database") || title.toLowerCase().contains("analytics")) {
            return "Data";
        } else if (title.toLowerCase().contains("mobile") || title.toLowerCase().contains("app") || title.toLowerCase().contains("android") || title.toLowerCase().contains("ios")) {
            return "Mobile";
        }
        return "General";
    }

    private List<Map<String, Object>> getActivityData(User user) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(6);
        
        List<UserProgress> progressList = userProgressRepository.findByUserAndDateBetween(user, startDate, endDate);
        
        Map<String, Double> dailyHours = new HashMap<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            dailyHours.put(date.format(DateTimeFormatter.ofPattern("EEE")), 0.0);
        }
        
        for (UserProgress progress : progressList) {
            String day = progress.getDate().format(DateTimeFormatter.ofPattern("EEE"));
            double hours = progress.getTimeSpent() != null ? progress.getTimeSpent() / 60.0 : 0.0;
            dailyHours.put(day, dailyHours.getOrDefault(day, 0.0) + hours);
        }
        
        List<Map<String, Object>> activityData = new ArrayList<>();
        for (Map.Entry<String, Double> entry : dailyHours.entrySet()) {
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("day", entry.getKey());
            dayData.put("hours", Math.round(entry.getValue() * 10.0) / 10.0);
            activityData.add(dayData);
        }
        
        return activityData;
    }

    private Map<String, Object> getUserStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        
        // Total learning time
        List<UserProgress> allProgress = userProgressRepository.findByUserOrderByDateDesc(user);
        int totalMinutes = allProgress.stream()
                .mapToInt(p -> p.getTimeSpent() != null ? p.getTimeSpent() : 0)
                .sum();
        stats.put("totalLearningHours", Math.round(totalMinutes / 60.0 * 10.0) / 10.0);
        
        // Current streak
        int currentStreak = calculateCurrentStreak(user);
        stats.put("currentStreak", currentStreak);
        
        // Total points
        int totalPoints = allProgress.stream()
                .mapToInt(p -> p.getPointsEarned() != null ? p.getPointsEarned() : 0)
                .sum();
        stats.put("totalPoints", totalPoints);
        
        // Completed quizzes
        List<QuizResult> quizResults = quizResultRepository.findByUserOrderByCompletedAtDesc(user);
        stats.put("completedQuizzes", quizResults.size());
        
        // Weekly plans completed
        List<WeeklyPlan> weeklyPlans = weeklyPlanRepository.findByUserOrderByWeekNumber(user);
        long completedPlans = weeklyPlans.stream()
                .filter(wp -> wp.getCompletionPercentage() != null && wp.getCompletionPercentage() >= 100)
                .count();
        stats.put("completedWeeklyPlans", (int) completedPlans);
        
        return stats;
    }

    private int calculateCurrentStreak(User user) {
        List<UserProgress> progressList = userProgressRepository.findByUserOrderByDateDesc(user);
        if (progressList.isEmpty()) return 0;
        
        LocalDate today = LocalDate.now();
        int streak = 0;
        
        for (UserProgress progress : progressList) {
            LocalDate progressDate = progress.getDate();
            if (progressDate.equals(today.minusDays(streak))) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }
}
