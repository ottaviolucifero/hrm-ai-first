package com.odsoftware.hrm.dto.corehr;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ContractResponse(
		UUID id,
		CoreHrReferenceResponse tenant,
		CoreHrReferenceResponse companyProfile,
		CoreHrReferenceResponse employee,
		CoreHrReferenceResponse contractType,
		CoreHrReferenceResponse currency,
		LocalDate startDate,
		LocalDate endDate,
		BigDecimal baseSalary,
		BigDecimal weeklyHours,
		Boolean active) {
}
