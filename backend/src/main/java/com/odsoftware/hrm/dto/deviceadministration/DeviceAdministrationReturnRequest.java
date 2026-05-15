package com.odsoftware.hrm.dto.deviceadministration;

import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public record DeviceAdministrationReturnRequest(
		OffsetDateTime returnedAt,
		@Size(max = 1000) String returnNote,
		@Size(max = 255) String conditionOnReturn,
		@Size(max = 1000) String notes) {
}
