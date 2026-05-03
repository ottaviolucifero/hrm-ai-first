package com.odsoftware.hrm.dto.corehr;

import com.odsoftware.hrm.entity.payroll.PayrollDocumentStatus;
import java.time.OffsetDateTime;
import java.util.UUID;

public record PayrollDocumentResponse(
		UUID id,
		CoreHrReferenceResponse tenant,
		CoreHrReferenceResponse companyProfile,
		CoreHrReferenceResponse employee,
		CoreHrReferenceResponse contract,
		CoreHrReferenceResponse documentType,
		CoreHrReferenceResponse uploadedBy,
		String originalFilename,
		String contentType,
		Long fileSizeBytes,
		Integer periodYear,
		Integer periodMonth,
		PayrollDocumentStatus status,
		OffsetDateTime publishedAt,
		String issuerName,
		OffsetDateTime uploadedAt) {
}
