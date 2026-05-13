package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantCreateRequest;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantDetailResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantListItemResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantUpdateRequest;
import com.odsoftware.hrm.service.TenantAdministrationService;
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
@RequestMapping("/api/admin/tenants")
@Tag(name = "Tenant Administration", description = "Platform administration API for tenant CRUD")
@Validated
public class TenantAdministrationController {

	private final TenantAdministrationService tenantAdministrationService;

	public TenantAdministrationController(TenantAdministrationService tenantAdministrationService) {
		this.tenantAdministrationService = tenantAdministrationService;
	}

	@GetMapping
	@Operation(summary = "List tenants for administration")
	public MasterDataPageResponse<TenantAdministrationTenantListItemResponse> findTenants(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return tenantAdministrationService.findTenants(page, size, search);
	}

	@GetMapping("/form-options")
	@Operation(summary = "Get tenant administration form options")
	public TenantAdministrationFormOptionsResponse findFormOptions() {
		return tenantAdministrationService.findFormOptions();
	}

	@GetMapping("/{tenantId}")
	@Operation(summary = "Get tenant administration detail")
	public TenantAdministrationTenantDetailResponse findTenantById(@PathVariable UUID tenantId) {
		return tenantAdministrationService.findTenantById(tenantId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create tenant")
	public TenantAdministrationTenantDetailResponse createTenant(@Valid @RequestBody TenantAdministrationTenantCreateRequest request) {
		return tenantAdministrationService.createTenant(request);
	}

	@PutMapping("/{tenantId}")
	@Operation(summary = "Update tenant")
	public TenantAdministrationTenantDetailResponse updateTenant(
			@PathVariable UUID tenantId,
			@Valid @RequestBody TenantAdministrationTenantUpdateRequest request) {
		return tenantAdministrationService.updateTenant(tenantId, request);
	}

	@PutMapping("/{tenantId}/activate")
	@Operation(summary = "Activate tenant")
	public TenantAdministrationTenantDetailResponse activateTenant(@PathVariable UUID tenantId) {
		return tenantAdministrationService.activateTenant(tenantId);
	}

	@PutMapping("/{tenantId}/deactivate")
	@Operation(summary = "Deactivate tenant")
	public TenantAdministrationTenantDetailResponse deactivateTenant(@PathVariable UUID tenantId) {
		return tenantAdministrationService.deactivateTenant(tenantId);
	}

	@DeleteMapping("/{tenantId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Delete tenant when not referenced")
	public void deleteTenant(@PathVariable UUID tenantId) {
		tenantAdministrationService.deleteTenant(tenantId);
	}
}
