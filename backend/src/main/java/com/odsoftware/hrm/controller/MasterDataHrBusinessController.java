package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.masterdata.hrbusiness.TenantMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.hrbusiness.TenantMasterDataResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.service.MasterDataHrBusinessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/master-data/hr-business")
@Tag(name = "Master Data HR Business", description = "CRUD API for tenant-scoped HR/business master data")
@Validated
public class MasterDataHrBusinessController {

	private final MasterDataHrBusinessService masterDataHrBusinessService;

	public MasterDataHrBusinessController(MasterDataHrBusinessService masterDataHrBusinessService) {
		this.masterDataHrBusinessService = masterDataHrBusinessService;
	}

	@GetMapping("/departments")
	@Operation(summary = "List departments")
	public MasterDataPageResponse<TenantMasterDataResponse> findDepartments(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findDepartments(page, size, search);
	}

	@GetMapping("/departments/{id}")
	@Operation(summary = "Get department by id")
	public TenantMasterDataResponse findDepartmentById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findDepartmentById(id);
	}

	@PostMapping("/departments")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create department")
	public TenantMasterDataResponse createDepartment(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createDepartment(request);
	}

	@PutMapping("/departments/{id}")
	@Operation(summary = "Update department")
	public TenantMasterDataResponse updateDepartment(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateDepartment(id, request);
	}

	@DeleteMapping("/departments/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable department")
	public void disableDepartment(@PathVariable UUID id) {
		masterDataHrBusinessService.disableDepartment(id);
	}

	@DeleteMapping("/departments/{id}/physical")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Physically delete department")
	public void deletePhysicalDepartment(@PathVariable UUID id) {
		masterDataHrBusinessService.deletePhysicalDepartment(id);
	}

	@GetMapping("/job-titles")
	@Operation(summary = "List job titles")
	public MasterDataPageResponse<TenantMasterDataResponse> findJobTitles(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findJobTitles(page, size, search);
	}

	@GetMapping("/job-titles/{id}")
	@Operation(summary = "Get job title by id")
	public TenantMasterDataResponse findJobTitleById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findJobTitleById(id);
	}

	@PostMapping("/job-titles")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create job title")
	public TenantMasterDataResponse createJobTitle(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createJobTitle(request);
	}

	@PutMapping("/job-titles/{id}")
	@Operation(summary = "Update job title")
	public TenantMasterDataResponse updateJobTitle(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateJobTitle(id, request);
	}

	@DeleteMapping("/job-titles/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable job title")
	public void disableJobTitle(@PathVariable UUID id) {
		masterDataHrBusinessService.disableJobTitle(id);
	}

	@DeleteMapping("/job-titles/{id}/physical")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Physically delete job title")
	public void deletePhysicalJobTitle(@PathVariable UUID id) {
		masterDataHrBusinessService.deletePhysicalJobTitle(id);
	}

	@GetMapping("/contract-types")
	@Operation(summary = "List contract types")
	public MasterDataPageResponse<TenantMasterDataResponse> findContractTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findContractTypes(page, size, search);
	}

	@GetMapping("/contract-types/{id}")
	@Operation(summary = "Get contract type by id")
	public TenantMasterDataResponse findContractTypeById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findContractTypeById(id);
	}

	@PostMapping("/contract-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create contract type")
	public TenantMasterDataResponse createContractType(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createContractType(request);
	}

	@PutMapping("/contract-types/{id}")
	@Operation(summary = "Update contract type")
	public TenantMasterDataResponse updateContractType(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateContractType(id, request);
	}

	@DeleteMapping("/contract-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable contract type")
	public void disableContractType(@PathVariable UUID id) {
		masterDataHrBusinessService.disableContractType(id);
	}

	@DeleteMapping("/contract-types/{id}/physical")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Physically delete contract type")
	public void deletePhysicalContractType(@PathVariable UUID id) {
		masterDataHrBusinessService.deletePhysicalContractType(id);
	}

	@GetMapping("/employment-statuses")
	@Operation(summary = "List employment statuses")
	public MasterDataPageResponse<TenantMasterDataResponse> findEmploymentStatuses(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findEmploymentStatuses(page, size, search);
	}

	@GetMapping("/employment-statuses/{id}")
	@Operation(summary = "Get employment status by id")
	public TenantMasterDataResponse findEmploymentStatusById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findEmploymentStatusById(id);
	}

	@PostMapping("/employment-statuses")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create employment status")
	public TenantMasterDataResponse createEmploymentStatus(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createEmploymentStatus(request);
	}

	@PutMapping("/employment-statuses/{id}")
	@Operation(summary = "Update employment status")
	public TenantMasterDataResponse updateEmploymentStatus(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateEmploymentStatus(id, request);
	}

	@DeleteMapping("/employment-statuses/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable employment status")
	public void disableEmploymentStatus(@PathVariable UUID id) {
		masterDataHrBusinessService.disableEmploymentStatus(id);
	}

	@GetMapping("/work-modes")
	@Operation(summary = "List work modes")
	public MasterDataPageResponse<TenantMasterDataResponse> findWorkModes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findWorkModes(page, size, search);
	}

	@GetMapping("/work-modes/{id}")
	@Operation(summary = "Get work mode by id")
	public TenantMasterDataResponse findWorkModeById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findWorkModeById(id);
	}

	@PostMapping("/work-modes")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create work mode")
	public TenantMasterDataResponse createWorkMode(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createWorkMode(request);
	}

	@PutMapping("/work-modes/{id}")
	@Operation(summary = "Update work mode")
	public TenantMasterDataResponse updateWorkMode(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateWorkMode(id, request);
	}

	@DeleteMapping("/work-modes/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable work mode")
	public void disableWorkMode(@PathVariable UUID id) {
		masterDataHrBusinessService.disableWorkMode(id);
	}

	@DeleteMapping("/work-modes/{id}/physical")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Physically delete work mode")
	public void deletePhysicalWorkMode(@PathVariable UUID id) {
		masterDataHrBusinessService.deletePhysicalWorkMode(id);
	}

	@GetMapping("/leave-request-types")
	@Operation(summary = "List leave request types")
	public MasterDataPageResponse<TenantMasterDataResponse> findLeaveRequestTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findLeaveRequestTypes(page, size, search);
	}

	@GetMapping("/leave-request-types/{id}")
	@Operation(summary = "Get leave request type by id")
	public TenantMasterDataResponse findLeaveRequestTypeById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findLeaveRequestTypeById(id);
	}

	@PostMapping("/leave-request-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create leave request type")
	public TenantMasterDataResponse createLeaveRequestType(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createLeaveRequestType(request);
	}

	@PutMapping("/leave-request-types/{id}")
	@Operation(summary = "Update leave request type")
	public TenantMasterDataResponse updateLeaveRequestType(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateLeaveRequestType(id, request);
	}

	@DeleteMapping("/leave-request-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable leave request type")
	public void disableLeaveRequestType(@PathVariable UUID id) {
		masterDataHrBusinessService.disableLeaveRequestType(id);
	}

	@GetMapping("/document-types")
	@Operation(summary = "List document types")
	public MasterDataPageResponse<TenantMasterDataResponse> findDocumentTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findDocumentTypes(page, size, search);
	}

	@GetMapping("/document-types/{id}")
	@Operation(summary = "Get document type by id")
	public TenantMasterDataResponse findDocumentTypeById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findDocumentTypeById(id);
	}

	@PostMapping("/document-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create document type")
	public TenantMasterDataResponse createDocumentType(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createDocumentType(request);
	}

	@PutMapping("/document-types/{id}")
	@Operation(summary = "Update document type")
	public TenantMasterDataResponse updateDocumentType(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateDocumentType(id, request);
	}

	@DeleteMapping("/document-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable document type")
	public void disableDocumentType(@PathVariable UUID id) {
		masterDataHrBusinessService.disableDocumentType(id);
	}

	@GetMapping("/device-types")
	@Operation(summary = "List device types")
	public MasterDataPageResponse<TenantMasterDataResponse> findDeviceTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findDeviceTypes(page, size, search);
	}

	@GetMapping("/device-types/{id}")
	@Operation(summary = "Get device type by id")
	public TenantMasterDataResponse findDeviceTypeById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findDeviceTypeById(id);
	}

	@PostMapping("/device-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create device type")
	public TenantMasterDataResponse createDeviceType(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createDeviceType(request);
	}

	@PutMapping("/device-types/{id}")
	@Operation(summary = "Update device type")
	public TenantMasterDataResponse updateDeviceType(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateDeviceType(id, request);
	}

	@DeleteMapping("/device-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable device type")
	public void disableDeviceType(@PathVariable UUID id) {
		masterDataHrBusinessService.disableDeviceType(id);
	}

	@GetMapping("/device-brands")
	@Operation(summary = "List device brands")
	public MasterDataPageResponse<TenantMasterDataResponse> findDeviceBrands(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findDeviceBrands(page, size, search);
	}

	@GetMapping("/device-brands/{id}")
	@Operation(summary = "Get device brand by id")
	public TenantMasterDataResponse findDeviceBrandById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findDeviceBrandById(id);
	}

	@PostMapping("/device-brands")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create device brand")
	public TenantMasterDataResponse createDeviceBrand(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createDeviceBrand(request);
	}

	@PutMapping("/device-brands/{id}")
	@Operation(summary = "Update device brand")
	public TenantMasterDataResponse updateDeviceBrand(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateDeviceBrand(id, request);
	}

	@DeleteMapping("/device-brands/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable device brand")
	public void disableDeviceBrand(@PathVariable UUID id) {
		masterDataHrBusinessService.disableDeviceBrand(id);
	}

	@GetMapping("/device-statuses")
	@Operation(summary = "List device statuses")
	public MasterDataPageResponse<TenantMasterDataResponse> findDeviceStatuses(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataHrBusinessService.findDeviceStatuses(page, size, search);
	}

	@GetMapping("/device-statuses/{id}")
	@Operation(summary = "Get device status by id")
	public TenantMasterDataResponse findDeviceStatusById(@PathVariable UUID id) {
		return masterDataHrBusinessService.findDeviceStatusById(id);
	}

	@PostMapping("/device-statuses")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create device status")
	public TenantMasterDataResponse createDeviceStatus(@Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.createDeviceStatus(request);
	}

	@PutMapping("/device-statuses/{id}")
	@Operation(summary = "Update device status")
	public TenantMasterDataResponse updateDeviceStatus(@PathVariable UUID id, @Valid @RequestBody TenantMasterDataRequest request) {
		return masterDataHrBusinessService.updateDeviceStatus(id, request);
	}

	@DeleteMapping("/device-statuses/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable device status")
	public void disableDeviceStatus(@PathVariable UUID id) {
		masterDataHrBusinessService.disableDeviceStatus(id);
	}
}
