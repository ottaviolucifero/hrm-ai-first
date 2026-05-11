package com.odsoftware.hrm.dto.useradministration;

import java.util.UUID;

public record UserAdministrationEmployeeResponse(
		UUID id,
		String employeeCode,
		String firstName,
		String lastName,
		String email) {
}
