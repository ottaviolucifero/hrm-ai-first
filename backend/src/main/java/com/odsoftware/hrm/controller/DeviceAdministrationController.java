package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceCreateRequest;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceDetailResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceListItemResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceUpdateRequest;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.service.DeviceAdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/devices")
@Tag(name = "Device Administration", description = "Foundation API for device administration CRUD")
@Validated
public class DeviceAdministrationController {

	private final DeviceAdministrationService deviceAdministrationService;

	public DeviceAdministrationController(DeviceAdministrationService deviceAdministrationService) {
		this.deviceAdministrationService = deviceAdministrationService;
	}

	@GetMapping
	@Operation(summary = "List devices for administration")
	public MasterDataPageResponse<DeviceAdministrationDeviceListItemResponse> findDevices(
			@RequestParam(required = false) UUID tenantId,
			@RequestParam(required = false) UUID companyProfileId,
			@RequestParam(required = false) UUID deviceTypeId,
			@RequestParam(required = false) UUID deviceBrandId,
			@RequestParam(required = false) UUID deviceStatusId,
			@RequestParam(required = false) UUID assignedToEmployeeId,
			@RequestParam(required = false) Boolean active,
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return deviceAdministrationService.findDevices(
				tenantId,
				companyProfileId,
				deviceTypeId,
				deviceBrandId,
				deviceStatusId,
				assignedToEmployeeId,
				active,
				page,
				size,
				search);
	}

	@GetMapping("/form-options")
	@Operation(summary = "Get device administration form options")
	public DeviceAdministrationFormOptionsResponse findFormOptions() {
		return deviceAdministrationService.findFormOptions();
	}

	@GetMapping("/{deviceId}")
	@Operation(summary = "Get device administration detail")
	public DeviceAdministrationDeviceDetailResponse findDeviceById(@PathVariable UUID deviceId) {
		return deviceAdministrationService.findDeviceById(deviceId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create device")
	public DeviceAdministrationDeviceDetailResponse createDevice(
			@Valid @RequestBody DeviceAdministrationDeviceCreateRequest request) {
		return deviceAdministrationService.createDevice(request);
	}

	@PutMapping("/{deviceId}")
	@Operation(summary = "Update device")
	public DeviceAdministrationDeviceDetailResponse updateDevice(
			@PathVariable UUID deviceId,
			@Valid @RequestBody DeviceAdministrationDeviceUpdateRequest request) {
		return deviceAdministrationService.updateDevice(deviceId, request);
	}

	@PutMapping("/{deviceId}/activate")
	@Operation(summary = "Activate device")
	public DeviceAdministrationDeviceDetailResponse activateDevice(@PathVariable UUID deviceId) {
		return deviceAdministrationService.activateDevice(deviceId);
	}

	@PutMapping("/{deviceId}/deactivate")
	@Operation(summary = "Deactivate device")
	public DeviceAdministrationDeviceDetailResponse deactivateDevice(@PathVariable UUID deviceId) {
		return deviceAdministrationService.deactivateDevice(deviceId);
	}

	@DeleteMapping("/{deviceId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Permanently delete device when it is not referenced")
	public void deleteDevice(@PathVariable UUID deviceId) {
		deviceAdministrationService.deleteDevice(deviceId);
	}
}
