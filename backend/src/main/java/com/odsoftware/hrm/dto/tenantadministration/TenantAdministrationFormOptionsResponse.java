package com.odsoftware.hrm.dto.tenantadministration;

import com.odsoftware.hrm.dto.foundation.FoundationReferenceResponse;
import java.util.List;

public record TenantAdministrationFormOptionsResponse(
		List<FoundationReferenceResponse> countries,
		List<FoundationReferenceResponse> currencies) {
}
