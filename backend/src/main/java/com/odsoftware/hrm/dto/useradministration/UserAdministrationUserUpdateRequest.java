package com.odsoftware.hrm.dto.useradministration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record UserAdministrationUserUpdateRequest(
		@NotBlank @Size(max = 150) String email,
		UUID companyProfileId) {
}
