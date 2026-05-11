package com.odsoftware.hrm.dto.useradministration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record UserPasswordResetRequest(
		@NotNull UUID tenantId,
		@NotBlank @Size(max = 255) String newPassword) {
}
