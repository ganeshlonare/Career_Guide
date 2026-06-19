package com.career.guide.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {
	private String secret;
	private long expirationSeconds;
	private long refreshExpirationDays;

	public String getSecret() {
		return secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public long getExpirationSeconds() {
		return expirationSeconds;
	}

	public void setExpirationSeconds(long expirationSeconds) {
		this.expirationSeconds = expirationSeconds;
	}

	public long getRefreshExpirationDays() {
		return refreshExpirationDays;
	}

	public void setRefreshExpirationDays(long refreshExpirationDays) {
		this.refreshExpirationDays = refreshExpirationDays;
	}
}
