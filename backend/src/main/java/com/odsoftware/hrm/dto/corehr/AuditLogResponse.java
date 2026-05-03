package com.odsoftware.hrm.dto.corehr;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AuditLogResponse(
		UUID id,
		CoreHrReferenceResponse tenant,
		CoreHrReferenceResponse companyProfile,
		CoreHrReferenceResponse userAccount,
		CoreHrReferenceResponse auditActionType,
		CoreHrReferenceResponse actingTenant,
		CoreHrReferenceResponse targetTenant,
		String impersonationMode,
		String entityType,
		UUID entityId,
		String entityDisplayName,
		String description,
		OffsetDateTime createdAt,
		Boolean success,
		String severityLevel) {
}
