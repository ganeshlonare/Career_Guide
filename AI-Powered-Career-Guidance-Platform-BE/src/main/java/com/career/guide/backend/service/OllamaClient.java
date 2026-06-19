package com.career.guide.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

public class OllamaClient {
    
    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String model;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public OllamaClient(RestTemplate restTemplate, String baseUrl, String model, String apiKey) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.model = model;
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    public String generateResponse(String prompt) {
        try {
            // Support both Ollama and OpenAI schemas
            boolean isOpenAI = baseUrl.contains("groq.com") || baseUrl.contains("openai.com") || baseUrl.contains("/v1");
            
            Map<String, Object> requestBody;
            if (isOpenAI) {
                requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                    ),
                    "temperature", 0.7,
                    "max_tokens", 2000
                );
            } else {
                requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                    ),
                    "stream", false,
                    "options", Map.of(
                        "temperature", 0.7,
                        "max_tokens", 2000
                    )
                );
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (apiKey != null && !apiKey.trim().isEmpty()) {
                headers.setBearerAuth(apiKey);
            }
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            String url = baseUrl + (isOpenAI && !baseUrl.endsWith("/chat/completions") ? "/chat/completions" : (!isOpenAI && !baseUrl.endsWith("/api/chat") ? "/api/chat" : ""));
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode responseJson = objectMapper.readTree(response.getBody());
                
                // OpenAI Schema parsing
                if (responseJson.has("choices") && responseJson.get("choices").isArray() && responseJson.get("choices").size() > 0) {
                    JsonNode message = responseJson.get("choices").get(0).get("message");
                    if (message != null && message.has("content")) {
                        return message.get("content").asText();
                    }
                }
                
                // Ollama Schema parsing
                JsonNode message = responseJson.get("message");
                if (message != null && message.has("content")) {
                    return message.get("content").asText();
                }
            }
            
            throw new RuntimeException("Invalid response from Ollama");
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate response from Ollama: " + e.getMessage(), e);
        }
    }

    public boolean isHealthy() {
        try {
            String url = baseUrl + "/api/tags";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return response.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }

    public String getModel() {
        return model;
    }
}
