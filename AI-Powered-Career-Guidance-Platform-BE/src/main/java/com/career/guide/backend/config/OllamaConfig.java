package com.career.guide.backend.config;

import com.career.guide.backend.service.OllamaClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OllamaConfig {

    @Value("${ollama.base-url:http://localhost:11434}")
    private String ollamaBaseUrl;

    @Value("${ollama.model:qwen2.5:1.5b}")
    private String ollamaModel;

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public OllamaClient ollamaClient(RestTemplate restTemplate) {
        return new OllamaClient(restTemplate, ollamaBaseUrl, ollamaModel);
    }
}
