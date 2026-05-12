package com.odsoftware.hrm.security;

import java.util.Locale;
import java.util.UUID;

public record CurrentCaller(
		UUID userId,
		UUID tenantId,
		String userType) {

	public boolean isPlatformUser() {
		return userType != null && userType.trim().toUpperCase(Locale.ROOT).startsWith("PLATFORM_");
	}
}
