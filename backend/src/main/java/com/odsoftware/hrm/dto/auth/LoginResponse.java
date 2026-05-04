package com.odsoftware.hrm.dto.auth;

public record LoginResponse(
		String accessToken,
		String tokenType,
		long expiresIn,
		AuthenticatedUserResponse user) {
}
