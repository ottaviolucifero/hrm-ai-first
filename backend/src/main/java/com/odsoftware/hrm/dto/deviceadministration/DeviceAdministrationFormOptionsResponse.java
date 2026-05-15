package com.odsoftware.hrm.dto.deviceadministration;

import java.util.List;

public record DeviceAdministrationFormOptionsResponse(
		List<DeviceAdministrationReferenceResponse> tenants,
		List<DeviceAdministrationReferenceResponse> companyProfiles,
		List<DeviceAdministrationReferenceResponse> deviceTypes,
		List<DeviceAdministrationReferenceResponse> deviceBrands,
		List<DeviceAdministrationReferenceResponse> deviceStatuses,
		List<DeviceAdministrationEmployeeOptionResponse> employees) {
}
