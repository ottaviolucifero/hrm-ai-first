package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationRoleResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserCreateRequest;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserDetailResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserListItemResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserUpdateRequest;
import com.odsoftware.hrm.dto.useradministration.UserPasswordResetRequest;
import com.odsoftware.hrm.dto.useradministration.UserPasswordResetResponse;
import com.odsoftware.hrm.dto.useradministration.UserRoleAssignmentRequest;
import com.odsoftware.hrm.service.UserAdministrationService;
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
@RequestMapping("/api/admin/users")
@Tag(name = "User Administration", description = "Foundation API for tenant user administration")
@Validated
public class UserAdministrationController {

	private final UserAdministrationService userAdministrationService;

	public UserAdministrationController(UserAdministrationService userAdministrationService) {
		this.userAdministrationService = userAdministrationService;
	}

	@GetMapping
	@Operation(summary = "List users for administration")
	public MasterDataPageResponse<UserAdministrationUserListItemResponse> findUsers(
			@RequestParam(required = false) UUID tenantId,
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return userAdministrationService.findUsers(tenantId, page, size, search);
	}

	@GetMapping("/form-options")
	@Operation(summary = "Get user administration form options")
	public UserAdministrationFormOptionsResponse findFormOptions() {
		return userAdministrationService.findFormOptions();
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create a user account for administration")
	public UserAdministrationUserDetailResponse createUser(@Valid @RequestBody UserAdministrationUserCreateRequest request) {
		return userAdministrationService.createUser(request);
	}

	@GetMapping("/{userId}")
	@Operation(summary = "Get user administration detail")
	public UserAdministrationUserDetailResponse findUserById(@PathVariable UUID userId) {
		return userAdministrationService.findUserById(userId);
	}

	@PutMapping("/{userId}")
	@Operation(summary = "Update editable user account administration fields")
	public UserAdministrationUserDetailResponse updateUser(
			@PathVariable UUID userId,
			@Valid @RequestBody UserAdministrationUserUpdateRequest request) {
		return userAdministrationService.updateUser(userId, request);
	}

	@PutMapping("/{userId}/activate")
	@Operation(summary = "Activate a user account")
	public UserAdministrationUserDetailResponse activateUser(@PathVariable UUID userId) {
		return userAdministrationService.activateUser(userId);
	}

	@PutMapping("/{userId}/deactivate")
	@Operation(summary = "Deactivate a user account")
	public UserAdministrationUserDetailResponse deactivateUser(@PathVariable UUID userId) {
		return userAdministrationService.deactivateUser(userId);
	}

	@PutMapping("/{userId}/lock")
	@Operation(summary = "Lock a user account")
	public UserAdministrationUserDetailResponse lockUser(@PathVariable UUID userId) {
		return userAdministrationService.lockUser(userId);
	}

	@PutMapping("/{userId}/unlock")
	@Operation(summary = "Unlock a user account")
	public UserAdministrationUserDetailResponse unlockUser(@PathVariable UUID userId) {
		return userAdministrationService.unlockUser(userId);
	}

	@GetMapping("/{userId}/roles")
	@Operation(summary = "List roles assigned to a user for a tenant")
	public List<UserAdministrationRoleResponse> findAssignedRoles(
			@PathVariable UUID userId,
			@RequestParam UUID tenantId) {
		return userAdministrationService.findAssignedRoles(userId, tenantId);
	}

	@GetMapping("/{userId}/available-roles")
	@Operation(summary = "List tenant roles available for assignment to a user")
	public List<UserAdministrationRoleResponse> findAvailableRoles(
			@PathVariable UUID userId,
			@RequestParam UUID tenantId) {
		return userAdministrationService.findAvailableRoles(userId, tenantId);
	}

	@PostMapping("/{userId}/roles")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Assign a tenant role to a user")
	public List<UserAdministrationRoleResponse> assignRole(
			@PathVariable UUID userId,
			@Valid @RequestBody UserRoleAssignmentRequest request) {
		return userAdministrationService.assignRole(userId, request);
	}

	@PutMapping("/{userId}/password")
	@Operation(summary = "Reset a user password for a tenant")
	public UserPasswordResetResponse resetPassword(
			@PathVariable UUID userId,
			@Valid @RequestBody UserPasswordResetRequest request) {
		return userAdministrationService.resetPassword(userId, request);
	}

	@DeleteMapping("/{userId}/roles/{roleId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Remove a tenant role from a user")
	public void removeRole(
			@PathVariable UUID userId,
			@PathVariable UUID roleId,
			@RequestParam UUID tenantId) {
		userAdministrationService.removeRole(userId, roleId, tenantId);
	}
}
