package com.odsoftware.hrm.dto.masterdata.global;

import com.odsoftware.hrm.entity.master.GlobalZipCodeSourceType;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record GlobalZipCodeResponse(
		UUID id,
		UUID tenantId,
		GlobalMasterReferenceResponse country,
		GlobalMasterReferenceResponse region,
		GlobalMasterReferenceResponse area,
		String city,
		String postalCode,
		String provinceCode,
		String provinceName,
		BigDecimal latitude,
		BigDecimal longitude,
		GlobalZipCodeSourceType sourceType,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
