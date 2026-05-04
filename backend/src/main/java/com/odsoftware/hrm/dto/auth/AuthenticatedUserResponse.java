package com.odsoftware.hrm.dto.auth;

import java.util.UUID;

public record AuthenticatedUserResponse(
		UUID id,
		UUID tenantId,
		String email,
		String userType) {
}
