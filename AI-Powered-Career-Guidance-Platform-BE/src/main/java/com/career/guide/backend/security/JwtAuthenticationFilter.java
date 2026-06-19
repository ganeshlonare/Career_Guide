package com.career.guide.backend.security;

import com.career.guide.backend.entity.User;
import com.career.guide.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	public JwtAuthenticationFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	@Override
	protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
			throws ServletException, java.io.IOException {
		
		// Skip JWT processing for Swagger/OpenAPI endpoints
		String requestPath = request.getServletPath();
		if (requestPath.startsWith("/v3/api-docs") || 
		    requestPath.startsWith("/swagger-ui") || 
		    requestPath.equals("/swagger-ui.html")) {
			filterChain.doFilter(request, response);
			return;
		}
		
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			try {
				String subject = jwtService.extractSubject(token);
				if (subject != null) {
					var auth = new UsernamePasswordAuthenticationToken(subject, null, java.util.Collections.emptyList());
					auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			} catch (Exception ignored) {
				// invalid token, ignore
			}
		}
		filterChain.doFilter(request, response);
	}
}


