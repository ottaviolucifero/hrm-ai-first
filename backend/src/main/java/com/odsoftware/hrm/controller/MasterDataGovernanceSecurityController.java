package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.masterdata.governancesecurity.AuthenticationMethodRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.AuthenticationMethodResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.GlobalGovernanceMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.GlobalGovernanceMasterDataResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.PermissionRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.PermissionResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.RoleRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.RoleResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.SeverityMasterDataAutoCodeRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.SeverityMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.SeverityMasterDataResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.TenantGovernanceMasterDataAutoCodeRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.TenantGovernanceMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.TenantGovernanceMasterDataResponse;
import com.odsoftware.hrm.service.MasterDataGovernanceSecurityService;
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
@RequestMapping("/api/master-data/governance-security")
@Tag(name = "Master Data Governance Security", description = "CRUD API for governance/security master data")
@Validated
public class MasterDataGovernanceSecurityController {

	private final MasterDataGovernanceSecurityService masterDataGovernanceSecurityService;

	public MasterDataGovernanceSecurityController(MasterDataGovernanceSecurityService masterDataGovernanceSecurityService) {
		this.masterDataGovernanceSecurityService = masterDataGovernanceSecurityService;
	}

	@GetMapping("/user-types")
	@Operation(summary = "List user types")
	public MasterDataPageResponse<GlobalGovernanceMasterDataResponse> findUserTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findUserTypes(page, size, search);
	}

	@GetMapping("/user-types/{id}")
	@Operation(summary = "Get user type by id")
	public GlobalGovernanceMasterDataResponse findUserTypeById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findUserTypeById(id);
	}

	@PostMapping("/user-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create user type")
	public GlobalGovernanceMasterDataResponse createUserType(@Valid @RequestBody GlobalGovernanceMasterDataRequest request) {
		return masterDataGovernanceSecurityService.createUserType(request);
	}

	@PutMapping("/user-types/{id}")
	@Operation(summary = "Update user type")
	public GlobalGovernanceMasterDataResponse updateUserType(@PathVariable UUID id, @Valid @RequestBody GlobalGovernanceMasterDataRequest request) {
		return masterDataGovernanceSecurityService.updateUserType(id, request);
	}

	@DeleteMapping("/user-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable user type")
	public void disableUserType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableUserType(id);
	}

	@GetMapping("/authentication-methods")
	@Operation(summary = "List authentication methods")
	public MasterDataPageResponse<AuthenticationMethodResponse> findAuthenticationMethods(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findAuthenticationMethods(page, size, search);
	}

	@GetMapping("/authentication-methods/{id}")
	@Operation(summary = "Get authentication method by id")
	public AuthenticationMethodResponse findAuthenticationMethodById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findAuthenticationMethodById(id);
	}

	@PostMapping("/authentication-methods")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create authentication method")
	public AuthenticationMethodResponse createAuthenticationMethod(@Valid @RequestBody AuthenticationMethodRequest request) {
		return masterDataGovernanceSecurityService.createAuthenticationMethod(request);
	}

	@PutMapping("/authentication-methods/{id}")
	@Operation(summary = "Update authentication method")
	public AuthenticationMethodResponse updateAuthenticationMethod(@PathVariable UUID id, @Valid @RequestBody AuthenticationMethodRequest request) {
		return masterDataGovernanceSecurityService.updateAuthenticationMethod(id, request);
	}

	@DeleteMapping("/authentication-methods/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable authentication method")
	public void disableAuthenticationMethod(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableAuthenticationMethod(id);
	}

	@GetMapping("/audit-action-types")
	@Operation(summary = "List audit action types")
	public MasterDataPageResponse<SeverityMasterDataResponse> findAuditActionTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findAuditActionTypes(page, size, search);
	}

	@GetMapping("/audit-action-types/{id}")
	@Operation(summary = "Get audit action type by id")
	public SeverityMasterDataResponse findAuditActionTypeById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findAuditActionTypeById(id);
	}

	@PostMapping("/audit-action-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create audit action type")
	public SeverityMasterDataResponse createAuditActionType(@Valid @RequestBody SeverityMasterDataRequest request) {
		return masterDataGovernanceSecurityService.createAuditActionType(request);
	}

	@PutMapping("/audit-action-types/{id}")
	@Operation(summary = "Update audit action type")
	public SeverityMasterDataResponse updateAuditActionType(@PathVariable UUID id, @Valid @RequestBody SeverityMasterDataRequest request) {
		return masterDataGovernanceSecurityService.updateAuditActionType(id, request);
	}

	@DeleteMapping("/audit-action-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable audit action type")
	public void disableAuditActionType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableAuditActionType(id);
	}

	@GetMapping("/disciplinary-action-types")
	@Operation(summary = "List disciplinary action types")
	public MasterDataPageResponse<SeverityMasterDataResponse> findDisciplinaryActionTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findDisciplinaryActionTypes(page, size, search);
	}

	@GetMapping("/disciplinary-action-types/{id}")
	@Operation(summary = "Get disciplinary action type by id")
	public SeverityMasterDataResponse findDisciplinaryActionTypeById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findDisciplinaryActionTypeById(id);
	}

	@PostMapping("/disciplinary-action-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create disciplinary action type")
	public SeverityMasterDataResponse createDisciplinaryActionType(@Valid @RequestBody SeverityMasterDataAutoCodeRequest request) {
		return masterDataGovernanceSecurityService.createDisciplinaryActionType(request);
	}

	@PutMapping("/disciplinary-action-types/{id}")
	@Operation(summary = "Update disciplinary action type")
	public SeverityMasterDataResponse updateDisciplinaryActionType(@PathVariable UUID id, @Valid @RequestBody SeverityMasterDataAutoCodeRequest request) {
		return masterDataGovernanceSecurityService.updateDisciplinaryActionType(id, request);
	}

	@DeleteMapping("/disciplinary-action-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable disciplinary action type")
	public void disableDisciplinaryActionType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableDisciplinaryActionType(id);
	}

	@DeleteMapping("/disciplinary-action-types/{id}/physical")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Physically delete disciplinary action type")
	public void deletePhysicalDisciplinaryActionType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.deletePhysicalDisciplinaryActionType(id);
	}

	@GetMapping("/smtp-encryption-types")
	@Operation(summary = "List SMTP encryption types")
	public MasterDataPageResponse<GlobalGovernanceMasterDataResponse> findSmtpEncryptionTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findSmtpEncryptionTypes(page, size, search);
	}

	@GetMapping("/smtp-encryption-types/{id}")
	@Operation(summary = "Get SMTP encryption type by id")
	public GlobalGovernanceMasterDataResponse findSmtpEncryptionTypeById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findSmtpEncryptionTypeById(id);
	}

	@PostMapping("/smtp-encryption-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create SMTP encryption type")
	public GlobalGovernanceMasterDataResponse createSmtpEncryptionType(@Valid @RequestBody GlobalGovernanceMasterDataRequest request) {
		return masterDataGovernanceSecurityService.createSmtpEncryptionType(request);
	}

	@PutMapping("/smtp-encryption-types/{id}")
	@Operation(summary = "Update SMTP encryption type")
	public GlobalGovernanceMasterDataResponse updateSmtpEncryptionType(@PathVariable UUID id, @Valid @RequestBody GlobalGovernanceMasterDataRequest request) {
		return masterDataGovernanceSecurityService.updateSmtpEncryptionType(id, request);
	}

	@DeleteMapping("/smtp-encryption-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable SMTP encryption type")
	public void disableSmtpEncryptionType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableSmtpEncryptionType(id);
	}

	@GetMapping("/roles")
	@Operation(summary = "List roles")
	public MasterDataPageResponse<RoleResponse> findRoles(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findRoles(page, size, search);
	}

	@GetMapping("/roles/{id}")
	@Operation(summary = "Get role by id")
	public RoleResponse findRoleById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findRoleById(id);
	}

	@PostMapping("/roles")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create role")
	public RoleResponse createRole(@Valid @RequestBody RoleRequest request) {
		return masterDataGovernanceSecurityService.createRole(request);
	}

	@PutMapping("/roles/{id}")
	@Operation(summary = "Update role")
	public RoleResponse updateRole(@PathVariable UUID id, @Valid @RequestBody RoleRequest request) {
		return masterDataGovernanceSecurityService.updateRole(id, request);
	}

	@DeleteMapping("/roles/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable role")
	public void disableRole(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableRole(id);
	}

	@GetMapping("/permissions")
	@Operation(summary = "List permissions")
	public MasterDataPageResponse<PermissionResponse> findPermissions(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findPermissions(page, size, search);
	}

	@GetMapping("/permissions/{id}")
	@Operation(summary = "Get permission by id")
	public PermissionResponse findPermissionById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findPermissionById(id);
	}

	@PostMapping("/permissions")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create permission")
	public PermissionResponse createPermission(@Valid @RequestBody PermissionRequest request) {
		return masterDataGovernanceSecurityService.createPermission(request);
	}

	@PutMapping("/permissions/{id}")
	@Operation(summary = "Update permission")
	public PermissionResponse updatePermission(@PathVariable UUID id, @Valid @RequestBody PermissionRequest request) {
		return masterDataGovernanceSecurityService.updatePermission(id, request);
	}

	@DeleteMapping("/permissions/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable permission")
	public void disablePermission(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disablePermission(id);
	}

	@GetMapping("/company-profile-types")
	@Operation(summary = "List company profile types")
	public MasterDataPageResponse<TenantGovernanceMasterDataResponse> findCompanyProfileTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findCompanyProfileTypes(page, size, search);
	}

	@GetMapping("/company-profile-types/{id}")
	@Operation(summary = "Get company profile type by id")
	public TenantGovernanceMasterDataResponse findCompanyProfileTypeById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findCompanyProfileTypeById(id);
	}

	@PostMapping("/company-profile-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create company profile type")
	public TenantGovernanceMasterDataResponse createCompanyProfileType(@Valid @RequestBody TenantGovernanceMasterDataAutoCodeRequest request) {
		return masterDataGovernanceSecurityService.createCompanyProfileType(request);
	}

	@PutMapping("/company-profile-types/{id}")
	@Operation(summary = "Update company profile type")
	public TenantGovernanceMasterDataResponse updateCompanyProfileType(@PathVariable UUID id, @Valid @RequestBody TenantGovernanceMasterDataAutoCodeRequest request) {
		return masterDataGovernanceSecurityService.updateCompanyProfileType(id, request);
	}

	@DeleteMapping("/company-profile-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable company profile type")
	public void disableCompanyProfileType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableCompanyProfileType(id);
	}

	@DeleteMapping("/company-profile-types/{id}/physical")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Physically delete company profile type")
	public void deletePhysicalCompanyProfileType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.deletePhysicalCompanyProfileType(id);
	}

	@GetMapping("/office-location-types")
	@Operation(summary = "List office location types")
	public MasterDataPageResponse<TenantGovernanceMasterDataResponse> findOfficeLocationTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGovernanceSecurityService.findOfficeLocationTypes(page, size, search);
	}

	@GetMapping("/office-location-types/{id}")
	@Operation(summary = "Get office location type by id")
	public TenantGovernanceMasterDataResponse findOfficeLocationTypeById(@PathVariable UUID id) {
		return masterDataGovernanceSecurityService.findOfficeLocationTypeById(id);
	}

	@PostMapping("/office-location-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create office location type")
	public TenantGovernanceMasterDataResponse createOfficeLocationType(@Valid @RequestBody TenantGovernanceMasterDataAutoCodeRequest request) {
		return masterDataGovernanceSecurityService.createOfficeLocationType(request);
	}

	@PutMapping("/office-location-types/{id}")
	@Operation(summary = "Update office location type")
	public TenantGovernanceMasterDataResponse updateOfficeLocationType(@PathVariable UUID id, @Valid @RequestBody TenantGovernanceMasterDataAutoCodeRequest request) {
		return masterDataGovernanceSecurityService.updateOfficeLocationType(id, request);
	}

	@DeleteMapping("/office-location-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable office location type")
	public void disableOfficeLocationType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.disableOfficeLocationType(id);
	}

	@DeleteMapping("/office-location-types/{id}/physical")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Physically delete office location type")
	public void deletePhysicalOfficeLocationType(@PathVariable UUID id) {
		masterDataGovernanceSecurityService.deletePhysicalOfficeLocationType(id);
	}
}
