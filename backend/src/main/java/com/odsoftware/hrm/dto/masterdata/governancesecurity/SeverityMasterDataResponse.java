package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record SeverityMasterDataResponse(
		UUID id,
		String code,
		String name,
		String severityLevel,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
