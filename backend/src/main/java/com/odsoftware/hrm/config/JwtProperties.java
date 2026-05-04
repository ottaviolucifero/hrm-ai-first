package com.odsoftware.hrm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "hrm.security.jwt")
public record JwtProperties(String secret, long expiresIn) {
}
