package com.odsoftware.hrm.dto.masterdata.global;

import java.util.UUID;

public record GlobalMasterReferenceResponse(
		UUID id,
		String code,
		String name) {
}
