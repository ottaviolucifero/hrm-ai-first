package com.odsoftware.hrm.dto.deviceadministration;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DeviceAdministrationDeviceDetailResponse(
		UUID id,
		DeviceAdministrationReferenceResponse tenant,
		DeviceAdministrationReferenceResponse companyProfile,
		String name,
		String assetCode,
		String barcodeValue,
		DeviceAdministrationReferenceResponse type,
		DeviceAdministrationReferenceResponse brand,
		String model,
		String serialNumber,
		LocalDate purchaseDate,
		LocalDate warrantyEndDate,
		DeviceAdministrationReferenceResponse deviceStatus,
		DeviceAdministrationReferenceResponse assignedTo,
		OffsetDateTime assignedAt,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
