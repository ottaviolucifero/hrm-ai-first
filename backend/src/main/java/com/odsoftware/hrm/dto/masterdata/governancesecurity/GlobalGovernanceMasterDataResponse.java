package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record GlobalGovernanceMasterDataResponse(
		UUID id,
		String code,
		String name,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
