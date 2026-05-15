package com.odsoftware.hrm.dto.companyprofileadministration;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CompanyProfileAdministrationCompanyProfileCreateRequest(
		@NotNull UUID tenantId,
		@NotNull UUID companyProfileTypeId,
		@NotBlank @Size(max = 150) String legalName,
		@NotBlank @Size(max = 150) String tradeName,
		@Size(max = 50) String vatNumber,
		@Size(max = 50) String taxIdentifier,
		@Size(max = 50) String taxNumber,
		@NotBlank @Email @Size(max = 150) String email,
		@Email @Size(max = 150) String pecEmail,
		@Size(max = 70) String phone,
		@Size(max = 10) String phoneDialCode,
		@Size(max = 50) String phoneNationalNumber,
		@Size(max = 50) String sdiCode,
		@NotNull UUID countryId,
		UUID regionId,
		UUID areaId,
		@NotNull UUID globalZipCodeId,
		@NotBlank @Size(max = 150) String street,
		@NotBlank @Size(max = 30) String streetNumber) {
}
