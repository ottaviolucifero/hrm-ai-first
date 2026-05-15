package com.odsoftware.hrm.dto.deviceadministration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DeviceAdministrationDeviceUpdateRequest(
		@NotNull UUID companyProfileId,
		@NotBlank @Size(max = 150) String name,
		@NotNull UUID deviceTypeId,
		@NotNull UUID deviceBrandId,
		@Size(max = 100) String model,
		@NotBlank @Size(max = 100) String serialNumber,
		LocalDate purchaseDate,
		LocalDate warrantyEndDate,
		@NotNull UUID deviceStatusId,
		UUID assignedToEmployeeId,
		OffsetDateTime assignedAt) {
}
