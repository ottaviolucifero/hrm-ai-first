package com.odsoftware.hrm.dto.masterdata.governancesecurity;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AuthenticationMethodResponse(
		UUID id,
		String code,
		String name,
		Boolean strongAuthRequired,
		Boolean active,
		OffsetDateTime createdAt,
		OffsetDateTime updatedAt) {
}
