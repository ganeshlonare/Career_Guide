package com.career.guide.backend.security;

import com.career.guide.backend.entity.User;
import com.career.guide.backend.repository.UserRepository;
import com.career.guide.backend.service.CacheService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

	private final UserRepository userRepository;
	private final CacheService cacheService;

	public SecurityUtils(UserRepository userRepository, CacheService cacheService) {
		this.userRepository = userRepository;
		this.cacheService = cacheService;
	}

	public User getCurrentUserOrThrow() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || auth.getName() == null) {
			throw new IllegalStateException("Unauthenticated");
		}
		String email = auth.getName();
		String cacheKey = cacheService.getUserCacheKey(email);
		User user = (User) cacheService.get(cacheKey);
		if (user == null) {
			user = userRepository.findByEmail(email).orElseThrow();
			cacheService.put(cacheKey, user);
		}
		return user;
	}
}


