package com.odsoftware.hrm.dto.useradministration;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record UserAdministrationUserListItemResponse(
		UUID id,
		String displayName,
		String firstName,
		String lastName,
		UUID employeeId,
		String employeeDisplayName,
		Boolean hasEmployeeLink,
		String email,
		UserAdministrationReferenceResponse userType,
		UserAdministrationReferenceResponse tenant,
		UserAdministrationCompanyProfileResponse companyProfile,
		Boolean active,
		Boolean locked,
		List<UserAdministrationRoleResponse> roles,
		List<UserAdministrationTenantAccessResponse> tenantAccesses,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
