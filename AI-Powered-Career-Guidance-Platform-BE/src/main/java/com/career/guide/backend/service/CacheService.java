package com.career.guide.backend.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CacheService {
    
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();
    
    private static final long CACHE_DURATION_MINUTES = 30; // Cache for 30 minutes
    
    private static class CacheEntry {
        private final Object data;
        private final LocalDateTime expiryTime;
        
        public CacheEntry(Object data, LocalDateTime expiryTime) {
            this.data = data;
            this.expiryTime = expiryTime;
        }
        
        public Object getData() {
            return data;
        }
        
        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }
    
    public void put(String key, Object data) {
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(CACHE_DURATION_MINUTES);
        cache.put(key, new CacheEntry(data, expiryTime));
    }
    
    public Object get(String key) {
        CacheEntry entry = cache.get(key);
        if (entry == null) {
            return null;
        }
        
        if (entry.isExpired()) {
            cache.remove(key);
            return null;
        }
        
        return entry.getData();
    }
    
    public void evict(String key) {
        cache.remove(key);
    }
    
    public void evictAll() {
        cache.clear();
    }
    
    public void cleanupExpired() {
        cache.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }
    
    // Helper methods for specific cache keys
    public String getRoadmapCacheKey(Long userId) {
        return "roadmap:user:" + userId;
    }
    
    public String getWeeklyPlanCacheKey(Long userId) {
        return "weekly_plan:user:" + userId;
    }
    
    public String getDashboardCacheKey(Long userId) {
        return "dashboard:user:" + userId;
    }
}
