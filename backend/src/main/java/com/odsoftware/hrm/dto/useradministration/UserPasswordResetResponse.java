package com.odsoftware.hrm.dto.useradministration;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UserPasswordResetResponse(
		UUID userId,
		UUID tenantId,
		OffsetDateTime passwordChangedAt,
		Boolean locked,
		Integer failedLoginAttempts) {
}
