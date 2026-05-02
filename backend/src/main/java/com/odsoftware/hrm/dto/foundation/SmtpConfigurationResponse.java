package com.odsoftware.hrm.dto.foundation;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SmtpConfigurationResponse(
		UUID id,
		FoundationReferenceResponse tenant,
		String code,
		String host,
		Integer port,
		String username,
		FoundationReferenceResponse smtpEncryptionType,
		String senderEmail,
		String senderName,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
