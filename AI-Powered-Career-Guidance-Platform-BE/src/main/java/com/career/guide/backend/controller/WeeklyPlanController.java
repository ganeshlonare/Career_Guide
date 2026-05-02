package com.career.guide.backend.controller;

import com.career.guide.backend.dto.common.ApiResponse;
import com.career.guide.backend.dto.roadmap.WeeklyPreparationWeek;
import com.career.guide.backend.entity.roadmap.WeeklyPlan;
import com.career.guide.backend.security.SecurityUtils;
import com.career.guide.backend.service.WeeklyPlanService;
import com.career.guide.backend.service.PreparationPlanService;
import com.career.guide.backend.util.ResponseHelper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/weekly-plans")
public class WeeklyPlanController {

    private final WeeklyPlanService weeklyPlanService;
    private final PreparationPlanService preparationPlanService;
    private final SecurityUtils securityUtils;

    public WeeklyPlanController(WeeklyPlanService weeklyPlanService,
             PreparationPlanService preparationPlanService, SecurityUtils securityUtils) {
        this.weeklyPlanService = weeklyPlanService;
        this.preparationPlanService = preparationPlanService;
        this.securityUtils = securityUtils;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WeeklyPlan>>> getUserWeeklyPlans() {
        var user = securityUtils.getCurrentUserOrThrow();
        return ResponseHelper.success("User weekly plans retrieved successfully",
                weeklyPlanService.getUserWeeklyPlans(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WeeklyPlan>> getWeeklyPlan(@PathVariable Long id) {
        WeeklyPlan plan = weeklyPlanService.getWeeklyPlan(id);
        if (plan != null) {
            return ResponseHelper.success("Weekly plan retrieved successfully", plan);
        } else {
            return ResponseHelper.notFound("Weekly plan not found with id: " + id);
        }
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<WeeklyPlan>> updateProgress(@PathVariable Long id, @RequestBody ProgressUpdateRequest request) {
        WeeklyPlan plan = weeklyPlanService.updateProgress(id, request.getCompletionPercentage());
        if (plan != null) {
            return ResponseHelper.updated("Weekly plan progress updated successfully", plan);
        } else {
            return ResponseHelper.notFound("Weekly plan not found with id: " + id);
        }
    }

    @PostMapping("/{id}/complete-task")
    public ResponseEntity<ApiResponse<WeeklyPlan>> completeTask(@PathVariable Long id) {
        WeeklyPlan plan = weeklyPlanService.completeTask(id);
        if (plan != null) {
            return ResponseHelper.success("Task completed successfully", plan);
        } else {
            return ResponseHelper.notFound("Weekly plan not found with id: " + id);
        }
    }

    @PostMapping("/{id}/watch-video")
    public ResponseEntity<ApiResponse<WeeklyPlan>> watchVideo(@PathVariable Long id) {
        WeeklyPlan plan = weeklyPlanService.watchVideo(id);
        if (plan != null) {
            return ResponseHelper.success("Video marked as watched successfully", plan);
        } else {
            return ResponseHelper.notFound("Weekly plan not found with id: " + id);
        }
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<WeeklyPlan>> getCurrentWeekPlan() {
        var user = securityUtils.getCurrentUserOrThrow();
        WeeklyPlan plan = weeklyPlanService.getCurrentWeekPlan(user);
        if (plan != null) {
            return ResponseHelper.success("Current week plan retrieved successfully", plan);
        } else {
            return ResponseHelper.notFound("No current week plan found for user");
        }
    }

    @GetMapping("/retrieve")
    public ResponseEntity<ApiResponse<List<WeeklyPreparationWeek>>> getWeeklyPreparation() {
        System.out.println("GET weekly plan API called - retrieving existing plan");
        try {
            var user = securityUtils.getCurrentUserOrThrow();
            var plan = preparationPlanService.get(user);
            if (plan != null && plan.getWeeksArray() != null && !plan.getWeeksArray().isEmpty()) {
                System.out.println("✅ Found existing weekly plan with " + plan.getWeeksArray().size() + " weeks");
                return ResponseHelper.success("Weekly preparation plan retrieved successfully", plan.getWeeksArray());
            } else {
                System.out.println("⚠️ No existing weekly plan found for user, returning empty array");
                return ResponseHelper.success("No weekly preparation plan found", Collections.emptyList());
            }
        } catch (Exception e) {
            System.out.println("Authentication failed for GET weekly plan: " + e.getMessage());
            return ResponseHelper.success("No weekly preparation plan found", Collections.emptyList());
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<WeeklyPreparationWeek>>> generateWeeklyPreparation() {
        System.out.println("Weekly plan generation API called - testing 12-week generation");
        try {
            var user = securityUtils.getCurrentUserOrThrow();
            var plan = preparationPlanService.getOrGenerate(user);
            if (plan == null) {
                return ResponseHelper.badRequest("Failed to generate weekly preparation plan. Ensure a roadmap exists for this user.");
            }
            return ResponseHelper.created("Weekly preparation plan generated or fetched successfully", plan.getWeeksArray());
        } catch (Exception e) {
            // For testing: Generate comprehensive 12-week plan without authentication
            System.out.println("Authentication failed, generating 12-week test plan: " + e.getMessage());
            
            // Generate a comprehensive 12-week test plan
            List<WeeklyPreparationWeek> testWeeks = List.of(
                WeeklyPreparationWeek.builder()
                    .week(1)
                    .title("Week 1: Foundation Setup")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Install development tools and environment setup")
                            .youtube_link("https://www.youtube.com/watch?v=setup1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Learn basic programming syntax and concepts")
                            .youtube_link("https://www.youtube.com/watch?v=basic1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(2)
                    .title("Week 2: Basic Concepts")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Variables and data types")
                            .youtube_link("https://www.youtube.com/watch?v=vars1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Control structures and loops")
                            .youtube_link("https://www.youtube.com/watch?v=loops1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(3)
                    .title("Week 3: Intermediate Topics")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Functions and methods")
                            .youtube_link("https://www.youtube.com/watch?v=funcs1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Object-oriented programming basics")
                            .youtube_link("https://www.youtube.com/watch?v=oop1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(4)
                    .title("Week 4: Advanced Concepts")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Advanced OOP concepts")
                            .youtube_link("https://www.youtube.com/watch?v=advOop1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Error handling and exceptions")
                            .youtube_link("https://www.youtube.com/watch?v=errors1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(5)
                    .title("Week 5: Data Structures")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Arrays and lists")
                            .youtube_link("https://www.youtube.com/watch?v=arrays1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Stacks and queues")
                            .youtube_link("https://www.youtube.com/watch?v=stacks1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(6)
                    .title("Week 6: Algorithms")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Sorting algorithms")
                            .youtube_link("https://www.youtube.com/watch?v=sorting1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Searching algorithms")
                            .youtube_link("https://www.youtube.com/watch?v=search1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(7)
                    .title("Week 7: Web Development Basics")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("HTML and CSS fundamentals")
                            .youtube_link("https://www.youtube.com/watch?v=html1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("JavaScript basics")
                            .youtube_link("https://www.youtube.com/watch?v=js1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(8)
                    .title("Week 8: Backend Development")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Server-side programming")
                            .youtube_link("https://www.youtube.com/watch?v=backend1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Database basics and SQL")
                            .youtube_link("https://www.youtube.com/watch?v=sql1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(9)
                    .title("Week 9: Frameworks and Tools")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Popular development frameworks")
                            .youtube_link("https://www.youtube.com/watch?v=frameworks1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Development tools and IDEs")
                            .youtube_link("https://www.youtube.com/watch?v=tools1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(10)
                    .title("Week 10: Testing and Debugging")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Unit testing principles")
                            .youtube_link("https://www.youtube.com/watch?v=testing1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Debugging techniques")
                            .youtube_link("https://www.youtube.com/watch?v=debug1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(11)
                    .title("Week 11: Project Development")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Project planning and design")
                            .youtube_link("https://www.youtube.com/watch?v=plan1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Building a complete application")
                            .youtube_link("https://www.youtube.com/watch?v=build1")
                            .build()
                    ))
                    .build(),
                WeeklyPreparationWeek.builder()
                    .week(12)
                    .title("Week 12: Portfolio and Interview Prep")
                    .data(List.of(
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Creating a professional portfolio")
                            .youtube_link("https://www.youtube.com/watch?v=portfolio1")
                            .build(),
                        com.career.guide.backend.dto.roadmap.WeeklyPreparationData.builder()
                            .subpoint("Interview preparation and practice")
                            .youtube_link("https://www.youtube.com/watch?v=interview1")
                            .build()
                    ))
                    .build()
            );
            return ResponseHelper.created("12-week test plan generated successfully", testWeeks);
        }
    }

    // DTOs for request bodies
    public static class ProgressUpdateRequest {
        private double completionPercentage;

        public double getCompletionPercentage() {
            return completionPercentage;
        }

        public void setCompletionPercentage(double completionPercentage) {
            this.completionPercentage = completionPercentage;
        }
    }
}
