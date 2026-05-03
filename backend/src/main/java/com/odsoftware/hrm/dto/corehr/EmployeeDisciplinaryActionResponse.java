package com.odsoftware.hrm.dto.corehr;

import java.time.LocalDate;
import java.util.UUID;

public record EmployeeDisciplinaryActionResponse(
		UUID id,
		CoreHrReferenceResponse tenant,
		CoreHrReferenceResponse companyProfile,
		CoreHrReferenceResponse employee,
		CoreHrReferenceResponse disciplinaryActionType,
		LocalDate actionDate,
		String title,
		String description,
		CoreHrReferenceResponse issuedBy,
		CoreHrReferenceResponse relatedDocument,
		Boolean active) {
}
