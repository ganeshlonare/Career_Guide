package com.career.guide.backend.controller;

import com.career.guide.backend.service.DashboardService;
import com.career.guide.backend.security.SecurityUtils;
import com.career.guide.backend.util.ResponseHelper;
import com.career.guide.backend.dto.common.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private SecurityUtils securityUtils;

    @GetMapping("/data")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardData() {
        try {
            var user = securityUtils.getCurrentUserOrThrow();
            Map<String, Object> dashboardData = dashboardService.getDashboardData(user);
            return ResponseHelper.success("Dashboard data retrieved successfully", dashboardData);
        } catch (Exception e) {
            return ResponseHelper.internalServerError("Failed to get dashboard data: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats() {
        try {
            var user = securityUtils.getCurrentUserOrThrow();
            Map<String, Object> dashboardData = dashboardService.getDashboardData(user);
            Map<String, Object> stats = (Map<String, Object>) dashboardData.get("stats");
            return ResponseHelper.success("User stats retrieved successfully", stats);
        } catch (Exception e) {
            return ResponseHelper.internalServerError("Failed to retrieve user stats: " + e.getMessage());
        }
    }

    @GetMapping("/progress")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCareerProgress() {
        try {
            var user = securityUtils.getCurrentUserOrThrow();
            Map<String, Object> dashboardData = dashboardService.getDashboardData(user);
            Map<String, Object> progress = (Map<String, Object>) dashboardData.get("careerProgress");
            return ResponseHelper.success("Career progress retrieved successfully", progress);
        } catch (Exception e) {
            return ResponseHelper.internalServerError("Failed to retrieve career progress: " + e.getMessage());
        }
    }
}
