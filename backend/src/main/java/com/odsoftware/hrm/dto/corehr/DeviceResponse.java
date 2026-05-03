package com.odsoftware.hrm.dto.corehr;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DeviceResponse(
		UUID id,
		CoreHrReferenceResponse tenant,
		CoreHrReferenceResponse companyProfile,
		String name,
		CoreHrReferenceResponse type,
		CoreHrReferenceResponse brand,
		String model,
		String serialNumber,
		LocalDate purchaseDate,
		LocalDate warrantyEndDate,
		CoreHrReferenceResponse deviceStatus,
		CoreHrReferenceResponse assignedTo,
		OffsetDateTime assignedAt,
		Boolean active) {
}
