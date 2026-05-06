package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.governancesecurity.AuthenticationMethodRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.AuthenticationMethodResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.GlobalGovernanceMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.GlobalGovernanceMasterDataResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.PermissionRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.PermissionResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.RoleRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.RoleResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.SeverityMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.SeverityMasterDataResponse;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.TenantGovernanceMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.governancesecurity.TenantGovernanceMasterDataResponse;
import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import com.odsoftware.hrm.entity.master.AuditActionType;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.CompanyProfileType;
import com.odsoftware.hrm.entity.master.DisciplinaryActionType;
import com.odsoftware.hrm.entity.master.OfficeLocationType;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.master.SmtpEncryptionType;
import com.odsoftware.hrm.entity.master.UserType;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.AuditActionTypeRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.DisciplinaryActionTypeRepository;
import com.odsoftware.hrm.repository.master.OfficeLocationTypeRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.SmtpEncryptionTypeRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import java.util.Locale;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Supplier;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MasterDataGovernanceSecurityService {

	private final TenantRepository tenantRepository;
	private final UserTypeRepository userTypeRepository;
	private final AuthenticationMethodRepository authenticationMethodRepository;
	private final AuditActionTypeRepository auditActionTypeRepository;
	private final DisciplinaryActionTypeRepository disciplinaryActionTypeRepository;
	private final SmtpEncryptionTypeRepository smtpEncryptionTypeRepository;
	private final RoleRepository roleRepository;
	private final PermissionRepository permissionRepository;
	private final CompanyProfileTypeRepository companyProfileTypeRepository;
	private final OfficeLocationTypeRepository officeLocationTypeRepository;

	public MasterDataGovernanceSecurityService(
			TenantRepository tenantRepository,
			UserTypeRepository userTypeRepository,
			AuthenticationMethodRepository authenticationMethodRepository,
			AuditActionTypeRepository auditActionTypeRepository,
			DisciplinaryActionTypeRepository disciplinaryActionTypeRepository,
			SmtpEncryptionTypeRepository smtpEncryptionTypeRepository,
			RoleRepository roleRepository,
			PermissionRepository permissionRepository,
			CompanyProfileTypeRepository companyProfileTypeRepository,
			OfficeLocationTypeRepository officeLocationTypeRepository) {
		this.tenantRepository = tenantRepository;
		this.userTypeRepository = userTypeRepository;
		this.authenticationMethodRepository = authenticationMethodRepository;
		this.auditActionTypeRepository = auditActionTypeRepository;
		this.disciplinaryActionTypeRepository = disciplinaryActionTypeRepository;
		this.smtpEncryptionTypeRepository = smtpEncryptionTypeRepository;
		this.roleRepository = roleRepository;
		this.permissionRepository = permissionRepository;
		this.companyProfileTypeRepository = companyProfileTypeRepository;
		this.officeLocationTypeRepository = officeLocationTypeRepository;
	}

	public MasterDataPageResponse<GlobalGovernanceMasterDataResponse> findUserTypes(Integer page, Integer size, String search) {
		return findGlobalPage(
				userTypeRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toUserTypeResponse);
	}

	public GlobalGovernanceMasterDataResponse findUserTypeById(UUID id) {
		return toUserTypeResponse(findUserType(id));
	}

	@Transactional
	public GlobalGovernanceMasterDataResponse createUserType(GlobalGovernanceMasterDataRequest request) {
		String code = cleanUpper(request.code());
		if (userTypeRepository.existsByCode(code)) {
			throw new ResourceConflictException("User type code already exists: " + code);
		}
		UserType userType = new UserType();
		applyUserType(userType, request, code);
		return toUserTypeResponse(userTypeRepository.save(userType));
	}

	@Transactional
	public GlobalGovernanceMasterDataResponse updateUserType(UUID id, GlobalGovernanceMasterDataRequest request) {
		UserType userType = findUserType(id);
		String code = cleanUpper(request.code());
		if (userTypeRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("User type code already exists: " + code);
		}
		applyUserType(userType, request, code);
		return toUserTypeResponse(userTypeRepository.save(userType));
	}

	@Transactional
	public void disableUserType(UUID id) {
		UserType userType = findUserType(id);
		userType.setActive(false);
		userTypeRepository.save(userType);
	}

	public MasterDataPageResponse<AuthenticationMethodResponse> findAuthenticationMethods(Integer page, Integer size, String search) {
		return findGlobalPage(
				authenticationMethodRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toAuthenticationMethodResponse);
	}

	public AuthenticationMethodResponse findAuthenticationMethodById(UUID id) {
		return toAuthenticationMethodResponse(findAuthenticationMethod(id));
	}

	@Transactional
	public AuthenticationMethodResponse createAuthenticationMethod(AuthenticationMethodRequest request) {
		String code = cleanUpper(request.code());
		if (authenticationMethodRepository.existsByCode(code)) {
			throw new ResourceConflictException("Authentication method code already exists: " + code);
		}
		AuthenticationMethod authenticationMethod = new AuthenticationMethod();
		applyAuthenticationMethod(authenticationMethod, request, code);
		return toAuthenticationMethodResponse(authenticationMethodRepository.save(authenticationMethod));
	}

	@Transactional
	public AuthenticationMethodResponse updateAuthenticationMethod(UUID id, AuthenticationMethodRequest request) {
		AuthenticationMethod authenticationMethod = findAuthenticationMethod(id);
		String code = cleanUpper(request.code());
		if (authenticationMethodRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("Authentication method code already exists: " + code);
		}
		applyAuthenticationMethod(authenticationMethod, request, code);
		return toAuthenticationMethodResponse(authenticationMethodRepository.save(authenticationMethod));
	}

	@Transactional
	public void disableAuthenticationMethod(UUID id) {
		AuthenticationMethod authenticationMethod = findAuthenticationMethod(id);
		authenticationMethod.setActive(false);
		authenticationMethodRepository.save(authenticationMethod);
	}

	public MasterDataPageResponse<SeverityMasterDataResponse> findAuditActionTypes(Integer page, Integer size, String search) {
		return findGlobalPage(
				auditActionTypeRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name", "severityLevel"),
				this::toAuditActionTypeResponse);
	}

	public SeverityMasterDataResponse findAuditActionTypeById(UUID id) {
		return toAuditActionTypeResponse(findAuditActionType(id));
	}

	@Transactional
	public SeverityMasterDataResponse createAuditActionType(SeverityMasterDataRequest request) {
		String code = cleanUpper(request.code());
		if (auditActionTypeRepository.existsByCode(code)) {
			throw new ResourceConflictException("Audit action type code already exists: " + code);
		}
		AuditActionType auditActionType = new AuditActionType();
		applyAuditActionType(auditActionType, request, code);
		return toAuditActionTypeResponse(auditActionTypeRepository.save(auditActionType));
	}

	@Transactional
	public SeverityMasterDataResponse updateAuditActionType(UUID id, SeverityMasterDataRequest request) {
		AuditActionType auditActionType = findAuditActionType(id);
		String code = cleanUpper(request.code());
		if (auditActionTypeRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("Audit action type code already exists: " + code);
		}
		applyAuditActionType(auditActionType, request, code);
		return toAuditActionTypeResponse(auditActionTypeRepository.save(auditActionType));
	}

	@Transactional
	public void disableAuditActionType(UUID id) {
		AuditActionType auditActionType = findAuditActionType(id);
		auditActionType.setActive(false);
		auditActionTypeRepository.save(auditActionType);
	}

	public MasterDataPageResponse<SeverityMasterDataResponse> findDisciplinaryActionTypes(Integer page, Integer size, String search) {
		return findGlobalPage(
				disciplinaryActionTypeRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name", "severityLevel"),
				this::toDisciplinaryActionTypeResponse);
	}

	public SeverityMasterDataResponse findDisciplinaryActionTypeById(UUID id) {
		return toDisciplinaryActionTypeResponse(findDisciplinaryActionType(id));
	}

	@Transactional
	public SeverityMasterDataResponse createDisciplinaryActionType(SeverityMasterDataRequest request) {
		String code = cleanUpper(request.code());
		if (disciplinaryActionTypeRepository.existsByCode(code)) {
			throw new ResourceConflictException("Disciplinary action type code already exists: " + code);
		}
		DisciplinaryActionType disciplinaryActionType = new DisciplinaryActionType();
		applyDisciplinaryActionType(disciplinaryActionType, request, code);
		return toDisciplinaryActionTypeResponse(disciplinaryActionTypeRepository.save(disciplinaryActionType));
	}

	@Transactional
	public SeverityMasterDataResponse updateDisciplinaryActionType(UUID id, SeverityMasterDataRequest request) {
		DisciplinaryActionType disciplinaryActionType = findDisciplinaryActionType(id);
		String code = cleanUpper(request.code());
		if (disciplinaryActionTypeRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("Disciplinary action type code already exists: " + code);
		}
		applyDisciplinaryActionType(disciplinaryActionType, request, code);
		return toDisciplinaryActionTypeResponse(disciplinaryActionTypeRepository.save(disciplinaryActionType));
	}

	@Transactional
	public void disableDisciplinaryActionType(UUID id) {
		DisciplinaryActionType disciplinaryActionType = findDisciplinaryActionType(id);
		disciplinaryActionType.setActive(false);
		disciplinaryActionTypeRepository.save(disciplinaryActionType);
	}

	public MasterDataPageResponse<GlobalGovernanceMasterDataResponse> findSmtpEncryptionTypes(Integer page, Integer size, String search) {
		return findGlobalPage(
				smtpEncryptionTypeRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toSmtpEncryptionTypeResponse);
	}

	public GlobalGovernanceMasterDataResponse findSmtpEncryptionTypeById(UUID id) {
		return toSmtpEncryptionTypeResponse(findSmtpEncryptionType(id));
	}

	@Transactional
	public GlobalGovernanceMasterDataResponse createSmtpEncryptionType(GlobalGovernanceMasterDataRequest request) {
		String code = cleanUpper(request.code());
		if (smtpEncryptionTypeRepository.existsByCode(code)) {
			throw new ResourceConflictException("SMTP encryption type code already exists: " + code);
		}
		SmtpEncryptionType smtpEncryptionType = new SmtpEncryptionType();
		applySmtpEncryptionType(smtpEncryptionType, request, code);
		return toSmtpEncryptionTypeResponse(smtpEncryptionTypeRepository.save(smtpEncryptionType));
	}

	@Transactional
	public GlobalGovernanceMasterDataResponse updateSmtpEncryptionType(UUID id, GlobalGovernanceMasterDataRequest request) {
		SmtpEncryptionType smtpEncryptionType = findSmtpEncryptionType(id);
		String code = cleanUpper(request.code());
		if (smtpEncryptionTypeRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("SMTP encryption type code already exists: " + code);
		}
		applySmtpEncryptionType(smtpEncryptionType, request, code);
		return toSmtpEncryptionTypeResponse(smtpEncryptionTypeRepository.save(smtpEncryptionType));
	}

	@Transactional
	public void disableSmtpEncryptionType(UUID id) {
		SmtpEncryptionType smtpEncryptionType = findSmtpEncryptionType(id);
		smtpEncryptionType.setActive(false);
		smtpEncryptionTypeRepository.save(smtpEncryptionType);
	}

	public MasterDataPageResponse<RoleResponse> findRoles(Integer page, Integer size, String search) {
		return findGlobalPage(
				roleRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toRoleResponse);
	}

	public RoleResponse findRoleById(UUID id) {
		return toRoleResponse(findRole(id));
	}

	@Transactional
	public RoleResponse createRole(RoleRequest request) {
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (roleRepository.existsByTenantIdAndCode(request.tenantId(), code)) {
			throw new ResourceConflictException("Role code already exists for tenant: " + code);
		}
		Role role = new Role();
		applyRole(role, request, code);
		return toRoleResponse(roleRepository.save(role));
	}

	@Transactional
	public RoleResponse updateRole(UUID id, RoleRequest request) {
		Role role = findRole(id);
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (roleRepository.existsByTenantIdAndCodeAndIdNot(request.tenantId(), code, id)) {
			throw new ResourceConflictException("Role code already exists for tenant: " + code);
		}
		applyRole(role, request, code);
		return toRoleResponse(roleRepository.save(role));
	}

	@Transactional
	public void disableRole(UUID id) {
		Role role = findRole(id);
		role.setActive(false);
		roleRepository.save(role);
	}

	public MasterDataPageResponse<PermissionResponse> findPermissions(Integer page, Integer size, String search) {
		return findGlobalPage(
				permissionRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toPermissionResponse);
	}

	public PermissionResponse findPermissionById(UUID id) {
		return toPermissionResponse(findPermission(id));
	}

	@Transactional
	public PermissionResponse createPermission(PermissionRequest request) {
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (permissionRepository.existsByTenantIdAndCode(request.tenantId(), code)) {
			throw new ResourceConflictException("Permission code already exists for tenant: " + code);
		}
		Permission permission = new Permission();
		applyPermission(permission, request, code);
		return toPermissionResponse(permissionRepository.save(permission));
	}

	@Transactional
	public PermissionResponse updatePermission(UUID id, PermissionRequest request) {
		Permission permission = findPermission(id);
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (permissionRepository.existsByTenantIdAndCodeAndIdNot(request.tenantId(), code, id)) {
			throw new ResourceConflictException("Permission code already exists for tenant: " + code);
		}
		applyPermission(permission, request, code);
		return toPermissionResponse(permissionRepository.save(permission));
	}

	@Transactional
	public void disablePermission(UUID id) {
		Permission permission = findPermission(id);
		permission.setActive(false);
		permissionRepository.save(permission);
	}

	public MasterDataPageResponse<TenantGovernanceMasterDataResponse> findCompanyProfileTypes(Integer page, Integer size, String search) {
		return findTenantMasterData(companyProfileTypeRepository, page, size, search);
	}

	public TenantGovernanceMasterDataResponse findCompanyProfileTypeById(UUID id) {
		return findTenantMasterDataById(id, companyProfileTypeRepository, "Company profile type");
	}

	@Transactional
	public TenantGovernanceMasterDataResponse createCompanyProfileType(TenantGovernanceMasterDataRequest request) {
		return createTenantMasterData(request, CompanyProfileType::new, companyProfileTypeRepository, companyProfileTypeRepository::existsByTenantIdAndCode, "Company profile type");
	}

	@Transactional
	public TenantGovernanceMasterDataResponse updateCompanyProfileType(UUID id, TenantGovernanceMasterDataRequest request) {
		return updateTenantMasterData(id, request, companyProfileTypeRepository, companyProfileTypeRepository::existsByTenantIdAndCodeAndIdNot, "Company profile type");
	}

	@Transactional
	public void disableCompanyProfileType(UUID id) {
		disableTenantMasterData(id, companyProfileTypeRepository, "Company profile type");
	}

	public MasterDataPageResponse<TenantGovernanceMasterDataResponse> findOfficeLocationTypes(Integer page, Integer size, String search) {
		return findTenantMasterData(officeLocationTypeRepository, page, size, search);
	}

	public TenantGovernanceMasterDataResponse findOfficeLocationTypeById(UUID id) {
		return findTenantMasterDataById(id, officeLocationTypeRepository, "Office location type");
	}

	@Transactional
	public TenantGovernanceMasterDataResponse createOfficeLocationType(TenantGovernanceMasterDataRequest request) {
		return createTenantMasterData(request, OfficeLocationType::new, officeLocationTypeRepository, officeLocationTypeRepository::existsByTenantIdAndCode, "Office location type");
	}

	@Transactional
	public TenantGovernanceMasterDataResponse updateOfficeLocationType(UUID id, TenantGovernanceMasterDataRequest request) {
		return updateTenantMasterData(id, request, officeLocationTypeRepository, officeLocationTypeRepository::existsByTenantIdAndCodeAndIdNot, "Office location type");
	}

	@Transactional
	public void disableOfficeLocationType(UUID id) {
		disableTenantMasterData(id, officeLocationTypeRepository, "Office location type");
	}

	private UserType findUserType(UUID id) {
		return findEntity(id, userTypeRepository, "User type");
	}

	private AuthenticationMethod findAuthenticationMethod(UUID id) {
		return findEntity(id, authenticationMethodRepository, "Authentication method");
	}

	private AuditActionType findAuditActionType(UUID id) {
		return findEntity(id, auditActionTypeRepository, "Audit action type");
	}

	private DisciplinaryActionType findDisciplinaryActionType(UUID id) {
		return findEntity(id, disciplinaryActionTypeRepository, "Disciplinary action type");
	}

	private SmtpEncryptionType findSmtpEncryptionType(UUID id) {
		return findEntity(id, smtpEncryptionTypeRepository, "SMTP encryption type");
	}

	private Role findRole(UUID id) {
		return findEntity(id, roleRepository, "Role");
	}

	private Permission findPermission(UUID id) {
		return findEntity(id, permissionRepository, "Permission");
	}

	private <T> T findEntity(UUID id, org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository, String label) {
		return repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(label + " not found: " + id));
	}

	private <T extends BaseTenantMasterEntity> MasterDataPageResponse<TenantGovernanceMasterDataResponse> findTenantMasterData(
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			Integer page,
			Integer size,
			String search) {
		return findGlobalPage(
				repository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toTenantGovernanceMasterDataResponse);
	}

	private <T extends BaseTenantMasterEntity> TenantGovernanceMasterDataResponse findTenantMasterDataById(
			UUID id,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			String label) {
		return toTenantGovernanceMasterDataResponse(findEntity(id, repository, label));
	}

	private <T extends BaseTenantMasterEntity> TenantGovernanceMasterDataResponse createTenantMasterData(
			TenantGovernanceMasterDataRequest request,
			Supplier<T> factory,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			TenantCodeExists existsByTenantIdAndCode,
			String label) {
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (existsByTenantIdAndCode.exists(request.tenantId(), code)) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
		T entity = factory.get();
		applyTenantMasterData(entity, request, code);
		return toTenantGovernanceMasterDataResponse(repository.save(entity));
	}

	private <T extends BaseTenantMasterEntity> TenantGovernanceMasterDataResponse updateTenantMasterData(
			UUID id,
			TenantGovernanceMasterDataRequest request,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			TenantCodeExcludingIdExists existsByTenantIdAndCodeAndIdNot,
			String label) {
		T entity = findEntity(id, repository, label);
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (existsByTenantIdAndCodeAndIdNot.exists(request.tenantId(), code, id)) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
		applyTenantMasterData(entity, request, code);
		return toTenantGovernanceMasterDataResponse(repository.save(entity));
	}

	private <T extends BaseTenantMasterEntity> void disableTenantMasterData(
			UUID id,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			String label) {
		T entity = findEntity(id, repository, label);
		entity.setActive(false);
		repository.save(entity);
	}

	private void validateTenant(UUID tenantId) {
		if (!tenantRepository.existsById(tenantId)) {
			throw new ResourceNotFoundException("Tenant not found: " + tenantId);
		}
	}

	private void applyUserType(UserType userType, GlobalGovernanceMasterDataRequest request, String code) {
		userType.setCode(code);
		userType.setName(clean(request.name()));
		userType.setActive(activeOrDefault(request.active()));
	}

	private void applyAuthenticationMethod(AuthenticationMethod authenticationMethod, AuthenticationMethodRequest request, String code) {
		authenticationMethod.setCode(code);
		authenticationMethod.setName(clean(request.name()));
		authenticationMethod.setStrongAuthRequired(falseOrValue(request.strongAuthRequired()));
		authenticationMethod.setActive(activeOrDefault(request.active()));
	}

	private void applyAuditActionType(AuditActionType auditActionType, SeverityMasterDataRequest request, String code) {
		auditActionType.setCode(code);
		auditActionType.setName(clean(request.name()));
		auditActionType.setSeverityLevel(cleanUpper(request.severityLevel()));
		auditActionType.setActive(activeOrDefault(request.active()));
	}

	private void applyDisciplinaryActionType(DisciplinaryActionType disciplinaryActionType, SeverityMasterDataRequest request, String code) {
		disciplinaryActionType.setCode(code);
		disciplinaryActionType.setName(clean(request.name()));
		disciplinaryActionType.setSeverityLevel(cleanUpper(request.severityLevel()));
		disciplinaryActionType.setActive(activeOrDefault(request.active()));
	}

	private void applySmtpEncryptionType(SmtpEncryptionType smtpEncryptionType, GlobalGovernanceMasterDataRequest request, String code) {
		smtpEncryptionType.setCode(code);
		smtpEncryptionType.setName(clean(request.name()));
		smtpEncryptionType.setActive(activeOrDefault(request.active()));
	}

	private void applyRole(Role role, RoleRequest request, String code) {
		role.setTenantId(request.tenantId());
		role.setCode(code);
		role.setName(clean(request.name()));
		role.setSystemRole(falseOrValue(request.systemRole()));
		role.setActive(activeOrDefault(request.active()));
	}

	private void applyPermission(Permission permission, PermissionRequest request, String code) {
		permission.setTenantId(request.tenantId());
		permission.setCode(code);
		permission.setName(clean(request.name()));
		permission.setSystemPermission(falseOrValue(request.systemPermission()));
		permission.setActive(activeOrDefault(request.active()));
	}

	private void applyTenantMasterData(BaseTenantMasterEntity entity, TenantGovernanceMasterDataRequest request, String code) {
		entity.setTenantId(request.tenantId());
		entity.setCode(code);
		entity.setName(clean(request.name()));
		entity.setActive(activeOrDefault(request.active()));
	}

	private GlobalGovernanceMasterDataResponse toUserTypeResponse(UserType userType) {
		return toGlobalResponse(userType.getId(), userType.getCode(), userType.getName(), userType.getActive(), userType.getCreatedAt(), userType.getUpdatedAt());
	}

	private AuthenticationMethodResponse toAuthenticationMethodResponse(AuthenticationMethod authenticationMethod) {
		return new AuthenticationMethodResponse(
				authenticationMethod.getId(),
				authenticationMethod.getCode(),
				authenticationMethod.getName(),
				authenticationMethod.getStrongAuthRequired(),
				authenticationMethod.getActive(),
				authenticationMethod.getCreatedAt(),
				authenticationMethod.getUpdatedAt());
	}

	private SeverityMasterDataResponse toAuditActionTypeResponse(AuditActionType auditActionType) {
		return toSeverityResponse(auditActionType.getId(), auditActionType.getCode(), auditActionType.getName(), auditActionType.getSeverityLevel(), auditActionType.getActive(), auditActionType.getCreatedAt(), auditActionType.getUpdatedAt());
	}

	private SeverityMasterDataResponse toDisciplinaryActionTypeResponse(DisciplinaryActionType disciplinaryActionType) {
		return toSeverityResponse(disciplinaryActionType.getId(), disciplinaryActionType.getCode(), disciplinaryActionType.getName(), disciplinaryActionType.getSeverityLevel(), disciplinaryActionType.getActive(), disciplinaryActionType.getCreatedAt(), disciplinaryActionType.getUpdatedAt());
	}

	private GlobalGovernanceMasterDataResponse toSmtpEncryptionTypeResponse(SmtpEncryptionType smtpEncryptionType) {
		return toGlobalResponse(smtpEncryptionType.getId(), smtpEncryptionType.getCode(), smtpEncryptionType.getName(), smtpEncryptionType.getActive(), smtpEncryptionType.getCreatedAt(), smtpEncryptionType.getUpdatedAt());
	}

	private RoleResponse toRoleResponse(Role role) {
		return new RoleResponse(
				role.getId(),
				role.getTenantId(),
				role.getCode(),
				role.getName(),
				role.getSystemRole(),
				role.getActive(),
				role.getCreatedAt(),
				role.getUpdatedAt());
	}

	private PermissionResponse toPermissionResponse(Permission permission) {
		return new PermissionResponse(
				permission.getId(),
				permission.getTenantId(),
				permission.getCode(),
				permission.getName(),
				permission.getSystemPermission(),
				permission.getActive(),
				permission.getCreatedAt(),
				permission.getUpdatedAt());
	}

	private TenantGovernanceMasterDataResponse toTenantGovernanceMasterDataResponse(BaseTenantMasterEntity entity) {
		return new TenantGovernanceMasterDataResponse(
				entity.getId(),
				entity.getTenantId(),
				entity.getCode(),
				entity.getName(),
				entity.getActive(),
				entity.getCreatedAt(),
				entity.getUpdatedAt());
	}

	private GlobalGovernanceMasterDataResponse toGlobalResponse(UUID id, String code, String name, Boolean active, java.time.OffsetDateTime createdAt, java.time.OffsetDateTime updatedAt) {
		return new GlobalGovernanceMasterDataResponse(id, code, name, active, createdAt, updatedAt);
	}

	private SeverityMasterDataResponse toSeverityResponse(UUID id, String code, String name, String severityLevel, Boolean active, java.time.OffsetDateTime createdAt, java.time.OffsetDateTime updatedAt) {
		return new SeverityMasterDataResponse(id, code, name, severityLevel, active, createdAt, updatedAt);
	}

	private Boolean activeOrDefault(Boolean active) {
		return active == null ? Boolean.TRUE : active;
	}

	private Boolean falseOrValue(Boolean value) {
		return value == null ? Boolean.FALSE : value;
	}

	private String cleanUpper(String value) {
		String cleaned = clean(value);
		return cleaned == null ? null : cleaned.toUpperCase(Locale.ROOT);
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}

	private <T, R> MasterDataPageResponse<R> findGlobalPage(
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			Integer page,
			Integer size,
			String search,
			org.springframework.data.jpa.domain.Specification<T> specification,
			Function<T, R> mapper) {
		return MasterDataQuerySupport.toPageResponse(
				repository.findAll(
						specification,
						MasterDataQuerySupport.buildPageable(page, size, Sort.by("code"))),
				mapper);
	}

	@FunctionalInterface
	private interface TenantCodeExists {
		boolean exists(UUID tenantId, String code);
	}

	@FunctionalInterface
	private interface TenantCodeExcludingIdExists {
		boolean exists(UUID tenantId, String code, UUID id);
	}
}
