package com.career.guide.backend.service;

import com.career.guide.backend.dto.roadmap.RoadmapResponse;
import com.career.guide.backend.dto.roadmap.PersonalizedRoadmapResponse;
import com.career.guide.backend.dto.roadmap.RoadmapUpdateRequest;
import com.career.guide.backend.dto.roadmap.RoadmapMilestone;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.career.guide.backend.entity.OnboardingData;
import com.career.guide.backend.entity.User;
import com.career.guide.backend.entity.quiz.QuizResult;
import com.career.guide.backend.entity.roadmap.PersonalizedRoadmap;
import com.career.guide.backend.repository.OnboardingDataRepository;
import com.career.guide.backend.repository.PersonalizedRoadmapRepository;
import com.career.guide.backend.repository.QuizResultRepository;
import com.career.guide.backend.util.DtoMapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class RoadmapService {

	private final PersonalizedRoadmapRepository roadmapRepository;
	private final OnboardingDataRepository onboardingDataRepository;
	private final QuizResultRepository quizResultRepository;
	private final OllamaClient ollamaClient;
	private final ModelMapper modelMapper;
	private final DtoMapper dtoMapper;
	private final ObjectMapper objectMapper;
	private final CacheService cacheService;

	public RoadmapService(PersonalizedRoadmapRepository roadmapRepository,
			OnboardingDataRepository onboardingDataRepository,
			QuizResultRepository quizResultRepository,
			OllamaClient ollamaClient,
			ModelMapper modelMapper,
			DtoMapper dtoMapper,
			CacheService cacheService) {
		this.roadmapRepository = roadmapRepository;
		this.onboardingDataRepository = onboardingDataRepository;
		this.quizResultRepository = quizResultRepository;
		this.ollamaClient = ollamaClient;
		this.modelMapper = modelMapper;
		this.dtoMapper = dtoMapper;
		this.objectMapper = new ObjectMapper();
		this.cacheService = cacheService;
	}

	public RoadmapResponse generateRoadmap(User user) {
		// Check cache first
		String cacheKey = cacheService.getRoadmapCacheKey(user.getId());
		RoadmapResponse cachedResponse = (RoadmapResponse) cacheService.get(cacheKey);
		if (cachedResponse != null) {
			System.out.println("✅ Returning cached roadmap for user: " + user.getId());
			return cachedResponse;
		}
		
		// Check if roadmap already exists in database
		PersonalizedRoadmap existingRoadmap = roadmapRepository.findFirstByUserOrderByCreatedAtAsc(user).orElse(null);
		if (existingRoadmap != null) {
			RoadmapResponse response = modelMapper.map(existingRoadmap, RoadmapResponse.class);
			cacheService.put(cacheKey, response);
			System.out.println("✅ Returning existing roadmap from database for user: " + user.getId());
			return response;
		}
		
		OnboardingData onboarding = onboardingDataRepository.findByUser(user).orElse(null);
		QuizResult latestQuiz = quizResultRepository.findByUserOrderByCompletedAtDesc(user)
				.stream().findFirst().orElse(null);
		
		System.out.println("🤖 Generating new roadmap with Ollama for user: " + user.getId());
		String roadmapData = generateRoadmapWithOllama(user, onboarding, latestQuiz);
		
		// Parse milestones from JSON response
		List<RoadmapMilestone> milestones = parseMilestonesFromJson(roadmapData);
		
		PersonalizedRoadmap roadmap = new PersonalizedRoadmap();
		roadmap.setUser(user);
		roadmap.setTitle("Personalized Career Roadmap");
		roadmap.setDescription("AI-generated roadmap based on your profile and quiz results");
		roadmap.setTargetRole(onboarding != null ? onboarding.getCareerGoal() : "Software Developer");
		roadmap.setEstimatedDuration(milestones.size()); // Duration based on number of milestones
		roadmap.setRoadmapData(roadmapData);
		roadmap.setTechnicalSkills(extractTechnicalSkills(milestones));
		roadmap.setSoftSkills(extractSoftSkills(milestones));
		try {
			// Persist only the extracted milestones array as JSON
			String milestonesJson = objectMapper.writeValueAsString(milestones);
			roadmap.setMilestones(milestonesJson);
			// Also persist parsed milestones array to avoid recomputation on reads
			roadmap.setMilestonesArray(milestones);
		} catch (Exception e) {
			// Fallback to raw data if serialization fails
			roadmap.setMilestones(roadmapData);
		}
		roadmap.setStatus(com.career.guide.backend.entity.enums.RoadmapStatus.ACTIVE);
		roadmap.setCreatedAt(LocalDateTime.now());
		roadmap.setUpdatedAt(LocalDateTime.now());
		
		PersonalizedRoadmap personalizedRoadmap = roadmapRepository.save(roadmap);

		// Create response with parsed milestones
		RoadmapResponse response = modelMapper.map(personalizedRoadmap, RoadmapResponse.class);
		response.setMilestonesArray(milestones);
		
		// Cache the response
		cacheService.put(cacheKey, response);
		System.out.println("✅ Cached new roadmap for user: " + user.getId());
		
		return response;
    }

    public List<PersonalizedRoadmap> getUserRoadmaps(User user) {
        return roadmapRepository.findByUserAndStatus(user, com.career.guide.backend.entity.enums.RoadmapStatus.ACTIVE);
    }

    public List<PersonalizedRoadmapResponse> getUserRoadmapsResponse(User user) {
        List<PersonalizedRoadmap> roadmaps = getUserRoadmaps(user);
        return dtoMapper.toPersonalizedRoadmapResponseList(roadmaps);
    }

    public List<RoadmapResponse> getUserRoadmapsFull(User user) {
        List<PersonalizedRoadmap> roadmaps = getUserRoadmaps(user);
        return roadmaps.stream().map(this::buildRoadmapResponse).toList();
    }

    public PersonalizedRoadmap getRoadmap(Long roadmapId) {
        return roadmapRepository.findById(roadmapId).orElse(null);
    }

    public PersonalizedRoadmapResponse getRoadmapResponse(Long roadmapId) {
        PersonalizedRoadmap roadmap = getRoadmap(roadmapId);
        return dtoMapper.toPersonalizedRoadmapResponse(roadmap);
    }

    public RoadmapResponse getRoadmapFull(Long roadmapId) {
        PersonalizedRoadmap roadmap = getRoadmap(roadmapId);
        return buildRoadmapResponse(roadmap);
    }

    public PersonalizedRoadmap updateRoadmap(Long roadmapId, PersonalizedRoadmap updates) {
        PersonalizedRoadmap roadmap = roadmapRepository.findById(roadmapId).orElse(null);
        if (roadmap != null) {
            roadmap.setTitle(updates.getTitle());
            roadmap.setDescription(updates.getDescription());
            roadmap.setUpdatedAt(LocalDateTime.now());
            return roadmapRepository.save(roadmap);
        }
        return null;
    }

    public PersonalizedRoadmapResponse updateRoadmapResponse(Long roadmapId, RoadmapUpdateRequest updates) {
        PersonalizedRoadmap roadmap = roadmapRepository.findById(roadmapId).orElse(null);
        if (roadmap != null) {
            if (updates.getTitle() != null) roadmap.setTitle(updates.getTitle());
            if (updates.getDescription() != null) roadmap.setDescription(updates.getDescription());
            if (updates.getTargetRole() != null) roadmap.setTargetRole(updates.getTargetRole());
            if (updates.getEstimatedDuration() != null) roadmap.setEstimatedDuration(updates.getEstimatedDuration());
            if (updates.getRoadmapData() != null) roadmap.setRoadmapData(updates.getRoadmapData());
            if (updates.getTechnicalSkills() != null) roadmap.setTechnicalSkills(updates.getTechnicalSkills());
            if (updates.getSoftSkills() != null) roadmap.setSoftSkills(updates.getSoftSkills());
            if (updates.getMilestones() != null) {
                roadmap.setMilestones(updates.getMilestones());
                // Keep milestonesArray in sync from provided JSON string
                try {
                    List<RoadmapMilestone> list = objectMapper.readValue(updates.getMilestones(), new com.fasterxml.jackson.core.type.TypeReference<List<RoadmapMilestone>>() {});
                    roadmap.setMilestonesArray(list);
                } catch (Exception ignore) {
                    // ignore parsing error, keep previous array
                }
            }
            if (updates.getStatus() != null) {
                try {
                    roadmap.setStatus(com.career.guide.backend.entity.enums.RoadmapStatus.valueOf(updates.getStatus()));
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore
                }
            }
            roadmap.setUpdatedAt(LocalDateTime.now());
            PersonalizedRoadmap savedRoadmap = roadmapRepository.save(roadmap);
            return dtoMapper.toPersonalizedRoadmapResponse(savedRoadmap);
        }
        return null;
    }

    public void deleteRoadmap(Long roadmapId) {
        roadmapRepository.deleteById(roadmapId);
    }

    public RoadmapResponse toRoadmapResponse(PersonalizedRoadmap roadmap) {
        return modelMapper.map(roadmap, RoadmapResponse.class);
    }

    // Parse milestones array from raw Gemini JSON response
    private List<RoadmapMilestone> parseMilestonesFromJson(String roadmapData) {
        try {
            int jsonStartIndex = roadmapData.indexOf("[");
            int jsonEndIndex = roadmapData.lastIndexOf("]") + 1;
            if (jsonStartIndex != -1 && jsonEndIndex > jsonStartIndex) {
                String jsonString = roadmapData.substring(jsonStartIndex, jsonEndIndex);
                return objectMapper.readValue(jsonString, new TypeReference<List<RoadmapMilestone>>() {});
            }
        } catch (Exception e) {
            System.err.println("Failed to parse milestones JSON: " + e.getMessage());
        }
        return getDefaultMilestones();
    }

    // Parse milestones array from stored JSON string column
    private List<RoadmapMilestone> parseMilestonesFromString(String stored) {
        try {
            if (stored == null || stored.isBlank()) return List.of();
            return objectMapper.readValue(stored, new TypeReference<List<RoadmapMilestone>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }

    // Build RoadmapResponse and populate milestonesArray from stored JSON
    private RoadmapResponse buildRoadmapResponse(PersonalizedRoadmap entity) {
        if (entity == null) return null;
        RoadmapResponse resp = modelMapper.map(entity, RoadmapResponse.class);
        List<RoadmapMilestone> list = entity.getMilestonesArray();
        if (list == null || list.isEmpty()) {
            list = parseMilestonesFromString(entity.getMilestones());
        }
        resp.setMilestonesArray(list);
        return resp;
    }

    private List<RoadmapMilestone> getDefaultMilestones() {
        return List.of(
            RoadmapMilestone.builder()
                .title("Learn Programming Fundamentals")
                .subTitle("Foundations")
                .description("Master basic programming concepts, variables, and control structures")
                .durationWeeks(2)
                .prerequisites(List.of())
                .resources(List.of())
                .dependencies(List.of())
                .tags(List.of("fundamentals", "basics"))
                .documentationLink("https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide")
                .completed(false)
                .build(),
            RoadmapMilestone.builder()
                .title("Build First Project")
                .subTitle("Hands-on")
                .description("Create a simple application to apply your programming knowledge")
                .durationWeeks(2)
                .prerequisites(List.of("Learn Programming Fundamentals"))
                .resources(List.of())
                .dependencies(List.of())
                .tags(List.of("project", "practice"))
                .documentationLink("https://github.com/topics/beginner-projects")
                .completed(false)
                .build()
        );
    }

    private String extractTechnicalSkills(List<RoadmapMilestone> milestones) {
        // Extract technical skills from milestone titles/tags
        List<String> skills = milestones.stream()
            .map(m -> m.getTitle() != null ? m.getTitle() : "")
            .filter(title -> title.toLowerCase().contains("programming") || 
                             title.toLowerCase().contains("development") ||
                             title.toLowerCase().contains("framework") ||
                             title.toLowerCase().contains("database"))
			.toList();
		
		try {
			return objectMapper.writeValueAsString(skills);
		} catch (Exception e) {
			return "[\"Programming\", \"Development\", \"Problem Solving\"]";
		}
	}

	private String extractSoftSkills(List<RoadmapMilestone> milestones) {
		// Extract soft skills from milestone titles/tags
		List<String> skills = milestones.stream()
			.map(m -> m.getTitle() != null ? m.getTitle() : "")
			.filter(title -> title.toLowerCase().contains("communication") || 
                             title.toLowerCase().contains("teamwork") ||
                             title.toLowerCase().contains("leadership") ||
                             title.toLowerCase().contains("interview"))
			.toList();
		
		try {
			return objectMapper.writeValueAsString(skills.isEmpty() ? 
				List.of("Communication", "Problem Solving", "Teamwork", "Leadership") : skills);
		} catch (Exception e) {
			return "[\"Communication\", \"Problem Solving\", \"Teamwork\", \"Leadership\"]";
		}
	}

	private String generateRoadmapWithOllama(User user, OnboardingData onboarding, QuizResult latestQuiz) {
		try {
			String prompt = buildRoadmapPrompt(user, onboarding, latestQuiz);
			return ollamaClient.generateResponse(prompt);
		} catch (Exception e) {
			throw new RuntimeException("Failed to generate roadmap with Ollama: " + e.getMessage(), e);
		}
	}

	private String buildRoadmapPrompt(User user, OnboardingData onboarding, QuizResult latestQuiz) {
		StringBuilder prompt = new StringBuilder();
		prompt.append("Generate a personalized career roadmap as a JSON array of milestones. ");
		
		if (onboarding != null) {
			prompt.append("User Profile:\n");
			prompt.append("- Degree: ").append(onboarding.getDegree()).append("\n");
			prompt.append("- Branch: ").append(onboarding.getBranch()).append("\n");
			prompt.append("- Current Year: ").append(onboarding.getCurrentYear()).append("\n");
			prompt.append("- Career Goal: ").append(onboarding.getCareerGoal()).append("\n");
			prompt.append("- Target Companies: ").append(onboarding.getTargetCompanies()).append("\n");
			prompt.append("- Preferred Roles: ").append(onboarding.getPreferredRoles()).append("\n");
			prompt.append("- Programming Language: ").append(onboarding.getPrimaryProgrammingLanguage()).append("\n");
			prompt.append("- Expertise Level: ").append(onboarding.getProgrammingExpertiseLevel()).append("\n");
		}
		
		if (latestQuiz != null) {
			prompt.append("\nQuiz Results:\n");
			prompt.append("- Total Score: ").append(latestQuiz.getTotalScore()).append("\n");
			prompt.append("- Skill Scores: ").append(latestQuiz.getSkillScores()).append("\n");
		}
		
		prompt.append("\nGenerate 8-10 milestones from beginner to advanced level. ");
        prompt.append("Return ONLY a JSON array with this exact format:\n");
        prompt.append("[\n");
        prompt.append("  {\n");
        prompt.append("    \"title\": \"Milestone title\",\n");
        prompt.append("    \"description\": \"Detailed description of what to learn\",\n");
        prompt.append("    \"duration\": \"duration in weeks\",\n");
        prompt.append("    \"skills\": [\"skill1\", \"skill2\", \"skill3\"],\n");
        prompt.append("    \"resources\": [\n");
        prompt.append("      {\"type\": \"course\", \"title\": \"Resource title\", \"url\": \"https://example.com\", \"free\": true},\n");
        prompt.append("      {\"type\": \"video\", \"title\": \"Video title\", \"url\": \"https://example.com\", \"free\": true}\n");
        prompt.append("    ]\n");
        prompt.append("  }\n");
        prompt.append("]\n");
		
		return prompt.toString();
	}
}
