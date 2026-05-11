package com.odsoftware.hrm.dto.useradministration;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record UserRoleAssignmentRequest(
		@NotNull UUID tenantId,
		@NotNull UUID roleId) {
}
