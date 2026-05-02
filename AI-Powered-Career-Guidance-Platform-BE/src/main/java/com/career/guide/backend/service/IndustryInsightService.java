package com.career.guide.backend.service;

import com.career.guide.backend.dto.industry.IndustryInsightResponse;
import com.career.guide.backend.entity.User;
import com.career.guide.backend.entity.insights.IndustryInsight;
import com.career.guide.backend.repository.IndustryInsightRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class IndustryInsightService {

    private final IndustryInsightRepository industryInsightRepository;
    private final OllamaClient ollamaClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public IndustryInsightService(IndustryInsightRepository industryInsightRepository,
                                  OllamaClient ollamaClient) {
        this.industryInsightRepository = industryInsightRepository;
        this.ollamaClient = ollamaClient;
    }

    public IndustryInsightResponse getInsightsForUser(User user) {
        return getInsightsForUser(user, false);
    }

    public IndustryInsightResponse getInsightsForUser(User user, boolean forceRefresh) {
        // Determine the industry name. Prefer onboarding branch/goal if present.
        String industryName = "Technology";
        if (user.getOnboardingData() != null) {
            if (user.getOnboardingData().getBranch() != null && !user.getOnboardingData().getBranch().isBlank()) {
                industryName = user.getOnboardingData().getBranch();
            } else if (user.getOnboardingData().getCareerGoal() != null && !user.getOnboardingData().getCareerGoal().isBlank()) {
                industryName = user.getOnboardingData().getCareerGoal();
            }
        }

        // Normalize common academic labels to broader industries for better results
        industryName = normalizeIndustry(industryName);

        IndustryInsight existing = industryInsightRepository.findByIndustry(industryName).orElse(null);
        if (!forceRefresh && existing != null && existing.getNextUpdate() != null && existing.getNextUpdate().isAfter(LocalDateTime.now()) && isValid(existing)) {
            return toResponse(existing);
        }

        // Generate fresh insights via Ollama
        String raw = generateIndustryInsightsWithOllama(industryName);
        if (raw == null || raw.isBlank()) {
            // Retry once with same prompt if empty
            raw = generateIndustryInsightsWithOllama(industryName);
        }
        IndustryInsight entity = existing != null ? existing : new IndustryInsight();
        entity.setIndustry(industryName);

        try {
            JsonNode root = safeJson(raw);
            if (root == null) throw new RuntimeException("Invalid JSON from Gemini for industry insights");

            // Persist raw arrays as JSON strings to keep flexibility on UI
            JsonNode salaryRanges = root.get("salaryRanges");
            entity.setSalaryRanges(salaryRanges != null ? objectMapper.writeValueAsString(salaryRanges) : "[]");

            JsonNode growthRate = root.get("growthRate");
            if (growthRate != null && growthRate.isNumber()) {
                entity.setGrowthRate(growthRate.asDouble());
            }

            JsonNode demandLevel = root.get("demandLevel");
            entity.setDemandLevel(demandLevel != null ? demandLevel.asText("") : "");

            JsonNode topSkills = root.get("topSkills");
            entity.setTopSkills(topSkills != null ? objectMapper.writeValueAsString(topSkills) : "[]");

            JsonNode marketOutlook = root.get("marketOutlook");
            entity.setMarketOutlook(marketOutlook != null ? marketOutlook.asText("") : "");

            JsonNode keyTrends = root.get("keyTrends");
            entity.setKeyTrends(keyTrends != null ? objectMapper.writeValueAsString(keyTrends) : "[]");

            JsonNode recommendedSkills = root.get("recommendedSkills");
            entity.setRecommendedSkills(recommendedSkills != null ? objectMapper.writeValueAsString(recommendedSkills) : "[]");

        } catch (Exception e) {
            // fallback empty structure to avoid failure; caller may retry later
            entity.setSalaryRanges("[]");
            entity.setTopSkills("[]");
            entity.setKeyTrends("[]");
            entity.setRecommendedSkills("[]");
        }

        entity.setLastUpdated(LocalDateTime.now());
        entity.setNextUpdate(LocalDateTime.now().plusDays(7));
        IndustryInsight saved = industryInsightRepository.save(entity);
        return toResponse(saved);
    }

    private boolean isValid(IndustryInsight e) {
        try {
            boolean hasSalary = e.getSalaryRanges() != null && !e.getSalaryRanges().isBlank() && objectMapper.readTree(e.getSalaryRanges()).size() >= 3;
            boolean hasSkills = e.getTopSkills() != null && !e.getTopSkills().isBlank() && objectMapper.readTree(e.getTopSkills()).size() >= 5;
            boolean hasTrends = e.getKeyTrends() != null && !e.getKeyTrends().isBlank() && objectMapper.readTree(e.getKeyTrends()).size() >= 5;
            boolean hasRecommended = e.getRecommendedSkills() != null && !e.getRecommendedSkills().isBlank() && objectMapper.readTree(e.getRecommendedSkills()).size() >= 5;
            boolean numericOk = e.getGrowthRate() != null && e.getGrowthRate() > 0;
            boolean enumsOk = e.getDemandLevel() != null && !e.getDemandLevel().isBlank() && e.getMarketOutlook() != null && !e.getMarketOutlook().isBlank();
            return hasSalary && hasSkills && hasTrends && hasRecommended && numericOk && enumsOk;
        } catch (Exception ex) {
            return false;
        }
    }

    private JsonNode safeJson(String text) {
        if (text == null || text.isBlank()) return null;
        try {
            // Strip potential markdown fences
            String cleaned = text.replaceAll("```(?:json)?\\n?", "").trim();
            return objectMapper.readTree(cleaned);
        } catch (Exception e) {
            try {
                int s = text.indexOf('{' );
                int eIdx = text.lastIndexOf('}');
                if (s >= 0 && eIdx > s) {
                    return objectMapper.readTree(text.substring(s, eIdx + 1));
                }
            } catch (Exception ignore) {}
            return null;
        }
    }

    private IndustryInsightResponse toResponse(IndustryInsight entity) {
        try {
            var salaryRanges = entity.getSalaryRanges() != null && !entity.getSalaryRanges().isBlank()
                ? objectMapper.readValue(entity.getSalaryRanges(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<com.career.guide.backend.dto.industry.SalaryRange>>() {})
                : java.util.List.<com.career.guide.backend.dto.industry.SalaryRange>of();
            var topSkills = entity.getTopSkills() != null && !entity.getTopSkills().isBlank()
                ? objectMapper.readValue(entity.getTopSkills(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<String>>() {})
                : java.util.List.<String>of();
            var keyTrends = entity.getKeyTrends() != null && !entity.getKeyTrends().isBlank()
                ? objectMapper.readValue(entity.getKeyTrends(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<String>>() {})
                : java.util.List.<String>of();
            var recommended = entity.getRecommendedSkills() != null && !entity.getRecommendedSkills().isBlank()
                ? objectMapper.readValue(entity.getRecommendedSkills(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<String>>() {})
                : java.util.List.<String>of();

            return IndustryInsightResponse.builder()
                .industry(entity.getIndustry())
                .salaryRanges(salaryRanges)
                .growthRate(entity.getGrowthRate())
                .demandLevel(entity.getDemandLevel())
                .topSkills(topSkills)
                .marketOutlook(entity.getMarketOutlook())
                .keyTrends(keyTrends)
                .recommendedSkills(recommended)
                .build();
        } catch (Exception e) {
            return IndustryInsightResponse.builder()
                .industry(entity.getIndustry())
                .salaryRanges(java.util.List.of())
                .growthRate(entity.getGrowthRate())
                .demandLevel(entity.getDemandLevel())
                .topSkills(java.util.List.of())
                .marketOutlook(entity.getMarketOutlook())
                .keyTrends(java.util.List.of())
                .recommendedSkills(java.util.List.of())
                .build();
        }
    }

    private String normalizeIndustry(String raw) {
        if (raw == null) return "Technology";
        String s = raw.trim().toLowerCase();
        if (s.contains("computer science") || s.equals("cs") || s.contains("it")) return "Software Engineering";
        if (s.contains("data science") || s.contains("ml") || s.contains("ai")) return "Data Science";
        if (s.contains("web") || s.contains("frontend") || s.contains("backend")) return "Web Development";
        if (s.contains("cyber")) return "Cybersecurity";
        if (s.contains("cloud")) return "Cloud Computing";
        return Character.toUpperCase(raw.charAt(0)) + raw.substring(1);
    }

    private String generateIndustryInsightsWithOllama(String industryName) {
        try {
            String prompt = "Generate industry insights for " + industryName + ". Return ONLY a JSON object with this exact format:\n" +
                           "{\n" +
                           "  \"salaryRanges\": [\n" +
                           "    {\"level\": \"Entry Level\", \"min\": 60000, \"max\": 80000, \"currency\": \"USD\"},\n" +
                           "    {\"level\": \"Mid Level\", \"min\": 80000, \"max\": 120000, \"currency\": \"USD\"},\n" +
                           "    {\"level\": \"Senior Level\", \"min\": 120000, \"max\": 180000, \"currency\": \"USD\"}\n" +
                           "  ],\n" +
                           "  \"growthRate\": 8.5,\n" +
                           "  \"demandLevel\": \"High\",\n" +
                           "  \"topSkills\": [\"JavaScript\", \"Python\", \"React\", \"Node.js\", \"AWS\"],\n" +
                           "  \"marketOutlook\": \"Positive with strong demand for skilled professionals\",\n" +
                           "  \"keyTrends\": [\"Remote work adoption\", \"AI integration\", \"Cloud migration\", \"DevOps practices\"],\n" +
                           "  \"recommendedSkills\": [\"Machine Learning\", \"Containerization\", \"Microservices\", \"Security best practices\"]\n" +
                           "}";
            return ollamaClient.generateResponse(prompt);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate industry insights with Ollama: " + e.getMessage(), e);
        }
    }
}
