package com.odsoftware.hrm.dto.corehr;

import java.time.LocalDate;
import java.util.UUID;

public record EmployeeResponse(
		UUID id,
		CoreHrReferenceResponse tenant,
		CoreHrReferenceResponse companyProfile,
		CoreHrReferenceResponse office,
		String employeeCode,
		String firstName,
		String lastName,
		String email,
		String department,
		String jobTitle,
		String employmentStatus,
		LocalDate hireDate,
		LocalDate terminationDate,
		Boolean active) {
}
