package com.odsoftware.hrm.dto.useradministration;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record UserAdministrationUserDetailResponse(
		UUID id,
		String email,
		String displayName,
		String firstName,
		String lastName,
		UserAdministrationReferenceResponse tenant,
		UserAdministrationReferenceResponse primaryTenant,
		UserAdministrationCompanyProfileResponse companyProfile,
		UserAdministrationEmployeeResponse employee,
		UserAdministrationReferenceResponse userType,
		UserAdministrationReferenceResponse authenticationMethod,
		String preferredLanguage,
		UserAdministrationReferenceResponse timeZone,
		Boolean active,
		Boolean locked,
		OffsetDateTime emailVerifiedAt,
		OffsetDateTime passwordChangedAt,
		OffsetDateTime lastLoginAt,
		Integer failedLoginAttempts,
		Boolean emailOtpEnabled,
		Boolean appOtpEnabled,
		Boolean strongAuthenticationRequired,
		List<UserAdministrationRoleResponse> roles,
		List<UserAdministrationTenantAccessResponse> tenantAccesses,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
