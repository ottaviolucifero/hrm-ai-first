package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserDetailResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserListItemResponse;
import com.odsoftware.hrm.service.UserAdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.UUID;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "User Administration", description = "Read-only foundation API for tenant user administration")
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

	@GetMapping("/{userId}")
	@Operation(summary = "Get user administration detail")
	public UserAdministrationUserDetailResponse findUserById(@PathVariable UUID userId) {
		return userAdministrationService.findUserById(userId);
	}
}
