package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationPermissionResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleCreateRequest;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleDetailResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleListItemResponse;
import com.odsoftware.hrm.dto.roleadministration.RoleAdministrationRoleUpdateRequest;
import com.odsoftware.hrm.dto.roleadministration.RolePermissionAssignmentResponse;
import com.odsoftware.hrm.dto.roleadministration.RolePermissionAssignmentUpdateRequest;
import com.odsoftware.hrm.service.RoleAdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.UUID;
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
@RequestMapping("/api/admin/roles")
@Tag(name = "Role Administration", description = "Foundation API for role and role-permission administration")
@Validated
public class RoleAdministrationController {

	private final RoleAdministrationService roleAdministrationService;

	public RoleAdministrationController(RoleAdministrationService roleAdministrationService) {
		this.roleAdministrationService = roleAdministrationService;
	}

	@GetMapping
	@Operation(summary = "List roles for administration")
	public MasterDataPageResponse<RoleAdministrationRoleListItemResponse> findRoles(
			@RequestParam(required = false) UUID tenantId,
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return roleAdministrationService.findRoles(tenantId, page, size, search);
	}

	@GetMapping("/{roleId}")
	@Operation(summary = "Get role administration detail")
	public RoleAdministrationRoleDetailResponse findRoleById(@PathVariable UUID roleId) {
		return roleAdministrationService.findRoleById(roleId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create custom tenant role")
	public RoleAdministrationRoleDetailResponse createRole(@Valid @RequestBody RoleAdministrationRoleCreateRequest request) {
		return roleAdministrationService.createRole(request);
	}

	@PutMapping("/{roleId}")
	@Operation(summary = "Update custom tenant role")
	public RoleAdministrationRoleDetailResponse updateRole(
			@PathVariable UUID roleId,
			@Valid @RequestBody RoleAdministrationRoleUpdateRequest request) {
		return roleAdministrationService.updateRole(roleId, request);
	}

	@PutMapping("/{roleId}/activate")
	@Operation(summary = "Activate custom tenant role")
	public RoleAdministrationRoleDetailResponse activateRole(@PathVariable UUID roleId) {
		return roleAdministrationService.activateRole(roleId);
	}

	@PutMapping("/{roleId}/deactivate")
	@Operation(summary = "Deactivate custom tenant role")
	public RoleAdministrationRoleDetailResponse deactivateRole(@PathVariable UUID roleId) {
		return roleAdministrationService.deactivateRole(roleId);
	}

	@GetMapping("/{roleId}/permissions")
	@Operation(summary = "List permissions assigned to a role")
	public List<RoleAdministrationPermissionResponse> findAssignedPermissions(@PathVariable UUID roleId) {
		return roleAdministrationService.findAssignedPermissions(roleId).permissions();
	}

	@PutMapping("/{roleId}/permissions")
	@Operation(summary = "Replace permissions assigned to a role")
	public RolePermissionAssignmentResponse updateAssignedPermissions(
			@PathVariable UUID roleId,
			@Valid @RequestBody RolePermissionAssignmentUpdateRequest request) {
		return roleAdministrationService.updateAssignedPermissions(roleId, request);
	}

	@DeleteMapping("/{roleId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Delete custom tenant role")
	public void deleteRole(@PathVariable UUID roleId) {
		roleAdministrationService.deleteRole(roleId);
	}
}
