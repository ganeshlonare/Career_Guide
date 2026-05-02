package com.career.guide.backend.service;

import com.career.guide.backend.dto.roadmap.WeeklyPreparationWeek;
import com.career.guide.backend.entity.User;
import com.career.guide.backend.entity.roadmap.PersonalizedRoadmap;
import com.career.guide.backend.entity.roadmap.PreparationPlan;
import com.career.guide.backend.repository.PersonalizedRoadmapRepository;
import com.career.guide.backend.repository.PreparationPlanRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
public class PreparationPlanService {

    private final PreparationPlanRepository preparationPlanRepository;
    private final PersonalizedRoadmapRepository roadmapRepository;
    private final OllamaClient ollamaClient;
    private final RoadmapService roadmapService;
    private final ObjectMapper objectMapper;
    private final CacheService cacheService;

    public PreparationPlanService(PreparationPlanRepository preparationPlanRepository,
                                  PersonalizedRoadmapRepository roadmapRepository,
                                  OllamaClient ollamaClient,
                                  RoadmapService roadmapService,
                                  CacheService cacheService) {
        this.preparationPlanRepository = preparationPlanRepository;
        this.roadmapRepository = roadmapRepository;
        this.ollamaClient = ollamaClient;
        this.roadmapService = roadmapService;
        this.cacheService = cacheService;
        this.objectMapper = new ObjectMapper();
    }

    public PreparationPlan getOrGenerate(User user) {
        // Check cache first
        String cacheKey = cacheService.getWeeklyPlanCacheKey(user.getId());
        PreparationPlan cachedPlan = (PreparationPlan) cacheService.get(cacheKey);
        if (cachedPlan != null) {
            System.out.println("✅ Returning cached weekly plan for user: " + user.getId());
            return cachedPlan;
        }

        // Return existing plan if present (single plan per user)
        PreparationPlan existing = preparationPlanRepository.findByUser(user).orElse(null);
        if (existing != null) {
            cacheService.put(cacheKey, existing);
            System.out.println("✅ Returning existing weekly plan from database for user: " + user.getId());
            return existing;
        }

        // Find first created roadmap for the user
        PersonalizedRoadmap roadmap = roadmapRepository.findFirstByUserOrderByCreatedAtAsc(user).orElse(null);
        // If none exists, auto-generate a roadmap now
        if (roadmap == null) {
            roadmapService.generateRoadmap(user);
            roadmap = roadmapRepository.findFirstByUserOrderByCreatedAtAsc(user).orElse(null);
        }
        if (roadmap == null) return null;

        // Prefer persisted milestonesArray; fall back to milestones string
        String roadmapJson;
        try {
            if (roadmap.getMilestonesArray() != null && !roadmap.getMilestonesArray().isEmpty()) {
                roadmapJson = objectMapper.writeValueAsString(roadmap.getMilestonesArray());
            } else {
                roadmapJson = roadmap.getMilestones();
            }
        } catch (Exception e) {
            roadmapJson = roadmap.getMilestones();
        }

        // Generate preparation plan from roadmap
        System.out.println("🤖 Generating new weekly plan with Ollama for user: " + user.getId());
        String raw = generatePreparationPlanWithOllama(roadmapJson);
        List<WeeklyPreparationWeek> weeks = parseWeeksArray(raw);

        // Persist single plan for user
        PreparationPlan plan = new PreparationPlan();
        plan.setUser(user);
        plan.setRoadmap(roadmap);
        plan.setContent(raw);
        plan.setWeeksArray(weeks);
        
        PreparationPlan savedPlan = preparationPlanRepository.save(plan);
        
        // Cache the saved plan
        cacheService.put(cacheKey, savedPlan);
        System.out.println("✅ Cached new weekly plan for user: " + user.getId());
        
        return savedPlan;
    }

    public PreparationPlan get(User user) {
        // Check cache first
        String cacheKey = cacheService.getWeeklyPlanCacheKey(user.getId());
        PreparationPlan cachedPlan = (PreparationPlan) cacheService.get(cacheKey);
        if (cachedPlan != null) {
            System.out.println("✅ Returning cached weekly plan for user: " + user.getId());
            return cachedPlan;
        }

        // Return existing plan if present (single plan per user)
        PreparationPlan existing = preparationPlanRepository.findByUser(user).orElse(null);
        if (existing != null) {
            cacheService.put(cacheKey, existing);
            System.out.println("✅ Returning existing weekly plan from database for user: " + user.getId());
            return existing;
        }
        
        System.out.println("⚠️ No weekly plan found for user: " + user.getId());
        return null;
    }

    private List<WeeklyPreparationWeek> parseWeeksArray(String text) {
        if (text == null || text.isBlank()) {
            System.out.println("❌ Weekly plan response is null or blank");
            return Collections.emptyList();
        }
        try {
            System.out.println("📦 Raw weekly plan response: " + text);
            int start = text.indexOf('[');
            int end = text.lastIndexOf(']');
            String json = (start >= 0 && end > start) ? text.substring(start, end + 1) : text;
            System.out.println("📦 Extracted JSON: " + json);
            List<WeeklyPreparationWeek> result = objectMapper.readValue(json, new TypeReference<List<WeeklyPreparationWeek>>() {});
            System.out.println("✅ Parsed weekly plan weeks: " + result.size());
            return result;
        } catch (Exception e) {
            System.out.println("❌ Failed to parse weekly plan: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    private String generatePreparationPlanWithOllama(String roadmapJson) {
        try {
            String prompt = "Generate a comprehensive 12-week preparation plan based on this roadmap data: " + roadmapJson + 
                           "\n\nIMPORTANT: You MUST generate ALL 12 weeks, not just 1 week. Each week should build upon the previous one." +
                           "\n\nReturn ONLY a JSON array with this exact format for ALL 12 weeks:\n" +
                           "[\n" +
                           "  {\n" +
                           "    \"week\": 1,\n" +
                           "    \"title\": \"Week 1: Foundation Setup\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Install development tools\", \"youtube_link\": \"https://example.com/video1\"},\n" +
                           "      {\"subpoint\": \"Learn basic syntax\", \"youtube_link\": \"https://example.com/video2\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 2,\n" +
                           "    \"title\": \"Week 2: Basic Concepts\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Variables and data types\", \"youtube_link\": \"https://example.com/video3\"},\n" +
                           "      {\"subpoint\": \"Control structures\", \"youtube_link\": \"https://example.com/video4\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 3,\n" +
                           "    \"title\": \"Week 3: Intermediate Topics\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Functions and methods\", \"youtube_link\": \"https://example.com/video5\"},\n" +
                           "      {\"subpoint\": \"Object-oriented basics\", \"youtube_link\": \"https://example.com/video6\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 4,\n" +
                           "    \"title\": \"Week 4: Advanced Concepts\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Advanced OOP concepts\", \"youtube_link\": \"https://example.com/video7\"},\n" +
                           "      {\"subpoint\": \"Error handling\", \"youtube_link\": \"https://example.com/video8\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 5,\n" +
                           "    \"title\": \"Week 5: Data Structures\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Arrays and lists\", \"youtube_link\": \"https://example.com/video9\"},\n" +
                           "      {\"subpoint\": \"Stacks and queues\", \"youtube_link\": \"https://example.com/video10\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 6,\n" +
                           "    \"title\": \"Week 6: Algorithms\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Sorting algorithms\", \"youtube_link\": \"https://example.com/video11\"},\n" +
                           "      {\"subpoint\": \"Searching algorithms\", \"youtube_link\": \"https://example.com/video12\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 7,\n" +
                           "    \"title\": \"Week 7: Web Development Basics\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"HTML/CSS fundamentals\", \"youtube_link\": \"https://example.com/video13\"},\n" +
                           "      {\"subpoint\": \"JavaScript basics\", \"youtube_link\": \"https://example.com/video14\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 8,\n" +
                           "    \"title\": \"Week 8: Backend Development\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Server-side programming\", \"youtube_link\": \"https://example.com/video15\"},\n" +
                           "      {\"subpoint\": \"Database basics\", \"youtube_link\": \"https://example.com/video16\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 9,\n" +
                           "    \"title\": \"Week 9: Frameworks and Tools\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Popular frameworks\", \"youtube_link\": \"https://example.com/video17\"},\n" +
                           "      {\"subpoint\": \"Development tools\", \"youtube_link\": \"https://example.com/video18\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 10,\n" +
                           "    \"title\": \"Week 10: Testing and Debugging\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Unit testing\", \"youtube_link\": \"https://example.com/video19\"},\n" +
                           "      {\"subpoint\": \"Debugging techniques\", \"youtube_link\": \"https://example.com/video20\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 11,\n" +
                           "    \"title\": \"Week 11: Project Development\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Project planning\", \"youtube_link\": \"https://example.com/video21\"},\n" +
                           "      {\"subpoint\": \"Building a full application\", \"youtube_link\": \"https://example.com/video22\"}\n" +
                           "    ]\n" +
                           "  },\n" +
                           "  {\n" +
                           "    \"week\": 12,\n" +
                           "    \"title\": \"Week 12: Portfolio and Interview Prep\",\n" +
                           "    \"data\": [\n" +
                           "      {\"subpoint\": \"Portfolio creation\", \"youtube_link\": \"https://example.com/video23\"},\n" +
                           "      {\"subpoint\": \"Interview preparation\", \"youtube_link\": \"https://example.com/video24\"}\n" +
                           "    ]\n" +
                           "  }\n" +
                           "]";
            System.out.println("Generating 12-week plan with Ollama...");
            String response = ollamaClient.generateResponse(prompt);
            System.out.println("Ollama response for weekly plan: " + response);
            return response;
        } catch (Exception e) {
            System.out.println("Failed to generate weekly plan with Ollama: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to generate preparation plan with Ollama: " + e.getMessage(), e);
        }
    }
}
