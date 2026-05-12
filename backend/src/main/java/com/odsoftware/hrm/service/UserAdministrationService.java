package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationCompanyProfileOptionResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationCompanyProfileResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationEmployeeResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationReferenceResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationRoleResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationTenantAccessResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserCreateRequest;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserDetailResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserListItemResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserUpdateRequest;
import com.odsoftware.hrm.dto.useradministration.UserPasswordResetRequest;
import com.odsoftware.hrm.dto.useradministration.UserPasswordResetResponse;
import com.odsoftware.hrm.dto.useradministration.UserRoleAssignmentRequest;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.master.TimeZone;
import com.odsoftware.hrm.entity.master.UserType;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.audit.AuditLogRepository;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.disciplinary.EmployeeDisciplinaryActionRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.payroll.PayrollDocumentRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.regex.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.odsoftware.hrm.security.CurrentCaller;
import com.odsoftware.hrm.security.CurrentCallerService;
import com.odsoftware.hrm.security.PasswordPolicy;

@Service
@Transactional(readOnly = true)
public class UserAdministrationService {

	private static final String PASSWORD_ONLY_AUTHENTICATION_METHOD_CODE = "PASSWORD_ONLY";
	private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

	private final UserAccountRepository userAccountRepository;
	private final RoleRepository roleRepository;
	private final TenantRepository tenantRepository;
	private final CompanyProfileRepository companyProfileRepository;
	private final UserTypeRepository userTypeRepository;
	private final AuthenticationMethodRepository authenticationMethodRepository;
	private final UserRoleRepository userRoleRepository;
	private final UserTenantAccessRepository userTenantAccessRepository;
	private final AuditLogRepository auditLogRepository;
	private final PayrollDocumentRepository payrollDocumentRepository;
	private final EmployeeDisciplinaryActionRepository employeeDisciplinaryActionRepository;
	private final PasswordPolicy passwordPolicy;
	private final PasswordEncoder passwordEncoder;
	private final CurrentCallerService currentCallerService;

	public UserAdministrationService(
			UserAccountRepository userAccountRepository,
			RoleRepository roleRepository,
			TenantRepository tenantRepository,
			CompanyProfileRepository companyProfileRepository,
			UserTypeRepository userTypeRepository,
			AuthenticationMethodRepository authenticationMethodRepository,
			UserRoleRepository userRoleRepository,
			UserTenantAccessRepository userTenantAccessRepository,
			AuditLogRepository auditLogRepository,
			PayrollDocumentRepository payrollDocumentRepository,
			EmployeeDisciplinaryActionRepository employeeDisciplinaryActionRepository,
			PasswordPolicy passwordPolicy,
			PasswordEncoder passwordEncoder,
			CurrentCallerService currentCallerService) {
		this.userAccountRepository = userAccountRepository;
		this.roleRepository = roleRepository;
		this.tenantRepository = tenantRepository;
		this.companyProfileRepository = companyProfileRepository;
		this.userTypeRepository = userTypeRepository;
		this.authenticationMethodRepository = authenticationMethodRepository;
		this.userRoleRepository = userRoleRepository;
		this.userTenantAccessRepository = userTenantAccessRepository;
		this.auditLogRepository = auditLogRepository;
		this.payrollDocumentRepository = payrollDocumentRepository;
		this.employeeDisciplinaryActionRepository = employeeDisciplinaryActionRepository;
		this.passwordPolicy = passwordPolicy;
		this.passwordEncoder = passwordEncoder;
		this.currentCallerService = currentCallerService;
	}

	public MasterDataPageResponse<UserAdministrationUserListItemResponse> findUsers(UUID tenantId, Integer page, Integer size, String search) {
		UUID authorizedTenantId = resolveAuthorizedTenantFilter(tenantId);
		Page<UserAccount> userPage = userAccountRepository.findAll(
				userSpecification(authorizedTenantId, search, !currentCaller().isPlatformUser()),
				MasterDataQuerySupport.buildPageable(
						page,
						size,
						MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("email"))));
		List<UUID> userIds = userPage.getContent().stream().map(UserAccount::getId).toList();
		Map<UUID, List<UserAdministrationRoleResponse>> rolesByUserId = rolesByUserId(userIds);
		Map<UUID, List<UserAdministrationTenantAccessResponse>> accessesByUserId = accessesByUserId(userIds);

		return MasterDataQuerySupport.toPageResponse(userPage, user -> toListItemResponse(
				user,
				rolesByUserId.getOrDefault(user.getId(), List.of()),
				accessesByUserId.getOrDefault(user.getId(), List.of())));
	}

	public UserAdministrationFormOptionsResponse findFormOptions() {
		CurrentCaller caller = currentCaller();
		List<UserAdministrationReferenceResponse> tenants = tenantRepository.findAll().stream()
				.filter(tenant -> Boolean.TRUE.equals(tenant.getActive()))
				.filter(tenant -> caller.isPlatformUser() || tenant.getId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(Tenant::getCode))
				.map(this::toTenantResponse)
				.toList();
		List<UserAdministrationReferenceResponse> userTypes = userTypeRepository.findAll().stream()
				.filter(userType -> Boolean.TRUE.equals(userType.getActive()))
				.filter(userType -> !isPlatformUserType(userType))
				.sorted(Comparator.comparing(UserType::getCode))
				.map(this::toUserTypeResponse)
				.toList();
		List<UserAdministrationCompanyProfileOptionResponse> companyProfiles = companyProfileRepository.findAll().stream()
				.filter(companyProfile -> Boolean.TRUE.equals(companyProfile.getActive()))
				.filter(companyProfile -> caller.isPlatformUser() || companyProfile.getTenant().getId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(CompanyProfile::getCode))
				.map(this::toCompanyProfileOptionResponse)
				.toList();

		return new UserAdministrationFormOptionsResponse(
				tenants,
				userTypes,
				toAuthenticationMethodResponse(findPasswordOnlyAuthenticationMethod()),
				companyProfiles);
	}

	public UserAdministrationUserDetailResponse findUserById(UUID userId) {
		UserAccount user = findUserForAdministration(userId);
		List<UserAdministrationRoleResponse> roles = userRoleRepository.findWithRoleAndTenantByUserAccountId(userId).stream()
				.map(this::toRoleResponse)
				.toList();
		List<UserAdministrationTenantAccessResponse> tenantAccesses = userTenantAccessRepository.findWithTenantByUserAccountId(userId).stream()
				.map(this::toTenantAccessResponse)
				.toList();
		return toDetailResponse(user, roles, tenantAccesses);
	}

	@Transactional
	public UserAdministrationUserDetailResponse createUser(UserAdministrationUserCreateRequest request) {
		assertCallerCanManageTenant(request.tenantId());
		String email = normalizeAndValidateEmail(request.email());
		validateEmailIsAvailable(email, null);
		if (!passwordPolicy.isValid(request.initialPassword())) {
			throw new InvalidRequestException("Password does not satisfy the current password policy.");
		}

		Tenant tenant = findTenant(request.tenantId());
		UserType userType = findAllowedUserType(request.userTypeId());
		AuthenticationMethod authenticationMethod = findPasswordOnlyAuthenticationMethod();
		CompanyProfile companyProfile = request.companyProfileId() == null
				? null
				: findCompanyProfileForTenant(request.companyProfileId(), tenant.getId());

		UserAccount user = new UserAccount();
		user.setTenant(tenant);
		user.setPrimaryTenant(tenant);
		user.setCompanyProfile(companyProfile);
		user.setUserType(userType);
		user.setAuthenticationMethod(authenticationMethod);
		user.setEmail(email);
		user.setPasswordHash(passwordEncoder.encode(request.initialPassword()));
		user.setPasswordChangedAt(OffsetDateTime.now());
		user.setActive(true);
		user.setLocked(false);
		UserAccount savedUser = userAccountRepository.saveAndFlush(user);

		UserTenantAccess tenantAccess = new UserTenantAccess();
		tenantAccess.setUserAccount(savedUser);
		tenantAccess.setTenant(tenant);
		tenantAccess.setAccessRole(userType.getCode());
		tenantAccess.setActive(true);
		userTenantAccessRepository.saveAndFlush(tenantAccess);

		return findUserById(savedUser.getId());
	}

	@Transactional
	public UserAdministrationUserDetailResponse updateUser(UUID userId, UserAdministrationUserUpdateRequest request) {
		UserAccount user = findUserForAdministration(userId);
		assertUserNotDeleted(user);
		String email = normalizeAndValidateEmail(request.email());
		validateEmailIsAvailable(email, user.getId());
		CompanyProfile companyProfile = request.companyProfileId() == null
				? null
				: findCompanyProfileForTenant(request.companyProfileId(), user.getTenant().getId());

		user.setEmail(email);
		user.setCompanyProfile(companyProfile);
		UserAccount savedUser = userAccountRepository.saveAndFlush(user);
		return findUserById(savedUser.getId());
	}

	@Transactional
	public UserAdministrationUserDetailResponse activateUser(UUID userId) {
		assertUserNotDeleted(findUser(userId));
		return updateUserActive(userId, true);
	}

	@Transactional
	public UserAdministrationUserDetailResponse deactivateUser(UUID userId) {
		UserAccount user = findUser(userId);
		assertUserNotDeleted(user);
		if (currentCaller().userId().equals(user.getId())) {
			throw new AccessDeniedException("Caller cannot deactivate its own user account");
		}
		return updateUserActive(userId, false);
	}

	@Transactional
	public UserAdministrationUserDetailResponse lockUser(UUID userId) {
		assertUserNotDeleted(findUser(userId));
		return updateUserLocked(userId, true);
	}

	@Transactional
	public UserAdministrationUserDetailResponse unlockUser(UUID userId) {
		assertUserNotDeleted(findUser(userId));
		return updateUserLocked(userId, false);
	}

	public List<UserAdministrationRoleResponse> findAssignedRoles(UUID userId, UUID tenantId) {
		UserAccount user = findUser(userId);
		Tenant tenant = requireAuthorizedTenantAccessForCallerAndTarget(user, tenantId);

		return userRoleRepository.findWithRoleAndTenantByUserAccountIdAndTenantId(userId, tenantId).stream()
				.map(this::toRoleResponse)
				.toList();
	}

	public List<UserAdministrationRoleResponse> findAvailableRoles(UUID userId, UUID tenantId) {
		UserAccount user = findUser(userId);
		Tenant tenant = requireAuthorizedTenantAccessForCallerAndTarget(user, tenantId);

		List<UUID> assignedRoleIds = userRoleRepository.findWithRoleAndTenantByUserAccountIdAndTenantId(userId, tenantId).stream()
				.map(userRole -> userRole.getRole().getId())
				.toList();
		return roleRepository.findByTenantIdAndActiveTrueOrderByCodeAsc(tenantId).stream()
				.filter(role -> !assignedRoleIds.contains(role.getId()))
				.map(role -> toRoleResponse(role, tenant))
				.toList();
	}

	@Transactional
	public List<UserAdministrationRoleResponse> assignRole(UUID userId, UserRoleAssignmentRequest request) {
		UserAccount user = findUser(userId);
		assertUserNotDeleted(user);
		Tenant tenant = requireAuthorizedTenantAccessForCallerAndTarget(user, request.tenantId());
		Role role = findRole(request.roleId());
		validateRoleTenant(role, tenant);

		if (userRoleRepository.existsByTenant_IdAndUserAccount_IdAndRole_Id(tenant.getId(), user.getId(), role.getId())) {
			throw new ResourceConflictException("Role already assigned to user for tenant: " + role.getId());
		}

		UserRole userRole = new UserRole();
		userRole.setTenant(tenant);
		userRole.setUserAccount(user);
		userRole.setRole(role);
		userRoleRepository.saveAndFlush(userRole);

		return findAssignedRoles(userId, tenant.getId());
	}

	@Transactional
	public UserPasswordResetResponse resetPassword(UUID userId, UserPasswordResetRequest request) {
		UserAccount user = findUser(userId);
		assertUserNotDeleted(user);
		Tenant tenant = requireAuthorizedTenantAccessForCallerAndTarget(user, request.tenantId());
		if (!passwordPolicy.isValid(request.newPassword())) {
			throw new InvalidRequestException("Password does not satisfy the current password policy.");
		}

		user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
		user.setPasswordChangedAt(OffsetDateTime.now());
		UserAccount savedUser = userAccountRepository.saveAndFlush(user);
		return new UserPasswordResetResponse(
				savedUser.getId(),
				tenant.getId(),
				savedUser.getPasswordChangedAt(),
				savedUser.getLocked(),
				savedUser.getFailedLoginAttempts());
	}

	@Transactional
	public void removeRole(UUID userId, UUID roleId, UUID tenantId) {
		UserAccount user = findUser(userId);
		assertUserNotDeleted(user);
		Tenant tenant = requireAuthorizedTenantAccessForCallerAndTarget(user, tenantId);
		Role role = findRole(roleId);
		validateRoleTenant(role, tenant);

		UserRole userRole = userRoleRepository.findByTenant_IdAndUserAccount_IdAndRole_Id(tenant.getId(), user.getId(), role.getId())
				.orElseThrow(() -> new ResourceNotFoundException("User role assignment not found: " + roleId));
		userRoleRepository.delete(userRole);
		userRoleRepository.flush();
	}

	@Transactional
	public void deleteUser(UUID userId) {
		UserAccount user = findUser(userId);
		CurrentCaller caller = currentCaller();
		if (caller.userId().equals(user.getId())) {
			throw new AccessDeniedException("Caller cannot delete its own user account");
		}
		if (isUserReferenced(user)) {
			throw userDeleteConflict();
		}
		try {
			userAccountRepository.delete(user);
			userAccountRepository.flush();
		}
		catch (DataIntegrityViolationException exception) {
			throw userDeleteConflict();
		}
	}

	private Specification<UserAccount> userSpecification(UUID tenantId, String search, boolean excludePlatformUsers) {
		Specification<UserAccount> searchSpecification = MasterDataQuerySupport.searchSpecification(
				search,
				"email",
				"employee.firstName",
				"employee.lastName",
				"userType.code",
				"tenant.code",
				"tenant.name",
				"companyProfile.code",
				"companyProfile.legalName",
				"companyProfile.tradeName");
		return (root, query, criteriaBuilder) -> {
			Predicate predicate = criteriaBuilder.conjunction();
			if (tenantId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("tenant").get("id"), tenantId));
			}
			if (excludePlatformUsers) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.notLike(criteriaBuilder.upper(root.get("userType").get("code")), "PLATFORM_%"));
			}
			if (searchSpecification == null) {
				return predicate;
			}

			Predicate searchPredicate = searchSpecification.toPredicate(root, query, criteriaBuilder);
			return searchPredicate == null ? predicate : criteriaBuilder.and(predicate, searchPredicate);
		};
	}

	private Map<UUID, List<UserAdministrationRoleResponse>> rolesByUserId(Collection<UUID> userIds) {
		if (userIds.isEmpty()) {
			return Map.of();
		}

		return userRoleRepository.findWithRoleAndTenantByUserAccountIds(userIds).stream()
				.collect(Collectors.groupingBy(
						userRole -> userRole.getUserAccount().getId(),
						Collectors.mapping(this::toRoleResponse, Collectors.toList())));
	}

	private Map<UUID, List<UserAdministrationTenantAccessResponse>> accessesByUserId(Collection<UUID> userIds) {
		if (userIds.isEmpty()) {
			return Map.of();
		}

		return userTenantAccessRepository.findWithTenantByUserAccountIds(userIds).stream()
				.collect(Collectors.groupingBy(
						access -> access.getUserAccount().getId(),
						Collectors.mapping(this::toTenantAccessResponse, Collectors.toList())));
	}

	private UserAdministrationUserListItemResponse toListItemResponse(
			UserAccount user,
			List<UserAdministrationRoleResponse> roles,
			List<UserAdministrationTenantAccessResponse> tenantAccesses) {
		Employee employee = user.getEmployee();
		return new UserAdministrationUserListItemResponse(
				user.getId(),
				displayName(user),
				employee == null ? null : employee.getFirstName(),
				employee == null ? null : employee.getLastName(),
				employee == null ? null : employee.getId(),
				employeeDisplayName(employee),
				employee != null,
				user.getEmail(),
				toUserTypeResponse(user.getUserType()),
				toTenantResponse(user.getTenant()),
				toCompanyProfileResponse(user.getCompanyProfile()),
				user.getActive(),
				user.getLocked(),
				sortedRoles(roles),
				sortedTenantAccesses(tenantAccesses),
				user.getCreatedAt(),
				user.getUpdatedAt());
	}

	private UserAdministrationUserDetailResponse toDetailResponse(
			UserAccount user,
			List<UserAdministrationRoleResponse> roles,
			List<UserAdministrationTenantAccessResponse> tenantAccesses) {
		Employee employee = user.getEmployee();
		return new UserAdministrationUserDetailResponse(
				user.getId(),
				user.getEmail(),
				displayName(user),
				employee == null ? null : employee.getFirstName(),
				employee == null ? null : employee.getLastName(),
				toTenantResponse(user.getTenant()),
				toTenantResponse(user.getPrimaryTenant()),
				toCompanyProfileResponse(user.getCompanyProfile()),
				toEmployeeResponse(employee),
				employee == null ? null : employee.getId(),
				employeeDisplayName(employee),
				employee != null,
				toUserTypeResponse(user.getUserType()),
				toAuthenticationMethodResponse(user.getAuthenticationMethod()),
				user.getPreferredLanguage(),
				toTimeZoneResponse(user.getTimeZone()),
				user.getActive(),
				user.getLocked(),
				user.getEmailVerifiedAt(),
				user.getPasswordChangedAt(),
				user.getLastLoginAt(),
				user.getFailedLoginAttempts(),
				user.getEmailOtpEnabled(),
				user.getAppOtpEnabled(),
				user.getStrongAuthenticationRequired(),
				sortedRoles(roles),
				sortedTenantAccesses(tenantAccesses),
				user.getCreatedAt(),
				user.getUpdatedAt());
	}

	private UserAdministrationRoleResponse toRoleResponse(UserRole userRole) {
		Role role = userRole.getRole();
		Tenant tenant = userRole.getTenant();
		return toRoleResponse(role, tenant);
	}

	private UserAdministrationRoleResponse toRoleResponse(Role role, Tenant tenant) {
		return new UserAdministrationRoleResponse(
				role.getId(),
				tenant.getId(),
				tenant.getCode(),
				tenant.getName(),
				role.getCode(),
				role.getName(),
				role.getSystemRole(),
				role.getActive());
	}

	private UserAccount findUser(UUID userId) {
		UserAccount user = userAccountRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User account not found: " + userId));
		assertCallerCanManageTargetUser(user);
		return user;
	}

	private UserAccount findUserForAdministration(UUID userId) {
		UserAccount user = userAccountRepository.findWithAdministrationGraphById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User account not found: " + userId));
		assertCallerCanManageTargetUser(user);
		return user;
	}

	private Tenant findTenant(UUID tenantId) {
		return tenantRepository.findById(tenantId)
				.orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + tenantId));
	}

	private UserType findAllowedUserType(UUID userTypeId) {
		UserType userType = userTypeRepository.findById(userTypeId)
				.orElseThrow(() -> new ResourceNotFoundException("User type not found: " + userTypeId));
		if (!Boolean.TRUE.equals(userType.getActive()) || isPlatformUserType(userType)) {
			throw new InvalidRequestException("User type is not allowed for tenant user creation: " + userTypeId);
		}

		return userType;
	}

	private AuthenticationMethod findPasswordOnlyAuthenticationMethod() {
		return authenticationMethodRepository.findAll().stream()
				.filter(authenticationMethod -> PASSWORD_ONLY_AUTHENTICATION_METHOD_CODE.equals(authenticationMethod.getCode()))
				.findFirst()
				.orElseThrow(() -> new ResourceNotFoundException("Authentication method not found: " + PASSWORD_ONLY_AUTHENTICATION_METHOD_CODE));
	}

	private CompanyProfile findCompanyProfileForTenant(UUID companyProfileId, UUID tenantId) {
		CompanyProfile companyProfile = companyProfileRepository.findById(companyProfileId)
				.orElseThrow(() -> new ResourceNotFoundException("Company profile not found: " + companyProfileId));
		if (!tenantId.equals(companyProfile.getTenant().getId())) {
			throw new InvalidRequestException("Company profile does not belong to tenant: " + companyProfileId);
		}

		return companyProfile;
	}

	private Role findRole(UUID roleId) {
		return roleRepository.findById(roleId)
				.orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleId));
	}

	private String normalizeAndValidateEmail(String email) {
		String normalizedEmail = email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
		if (normalizedEmail.isBlank() || normalizedEmail.length() > 150 || !EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
			throw new InvalidRequestException("Email is not valid.");
		}

		return normalizedEmail;
	}

	private void validateEmailIsAvailable(String email, UUID currentUserId) {
		userAccountRepository.findByEmailIgnoreCase(email)
				.filter(existingUser -> currentUserId == null || !existingUser.getId().equals(currentUserId))
				.ifPresent(existingUser -> {
					throw new ResourceConflictException("User email already exists: " + email);
				});
	}

	private UserAdministrationUserDetailResponse updateUserActive(UUID userId, boolean active) {
		UserAccount user = findUser(userId);
		user.setActive(active);
		UserAccount savedUser = userAccountRepository.saveAndFlush(user);
		return findUserById(savedUser.getId());
	}

	private boolean isUserReferenced(UserAccount user) {
		UUID userId = user.getId();
		return user.getEmployee() != null
				|| userRoleRepository.existsByUserAccount_Id(userId)
				|| userTenantAccessRepository.existsByUserAccount_Id(userId)
				|| auditLogRepository.existsByUserAccount_Id(userId)
				|| payrollDocumentRepository.existsByUploadedBy_Id(userId)
				|| employeeDisciplinaryActionRepository.existsByIssuedBy_Id(userId)
				|| userAccountRepository.existsByCreatedBy_IdOrUpdatedBy_Id(userId, userId);
	}

	private UserAdministrationUserDetailResponse updateUserLocked(UUID userId, boolean locked) {
		UserAccount user = findUser(userId);
		user.setLocked(locked);
		UserAccount savedUser = userAccountRepository.saveAndFlush(user);
		return findUserById(savedUser.getId());
	}

	private boolean isPlatformUserType(UserType userType) {
		String code = userType.getCode();
		return code != null && code.trim().toUpperCase(Locale.ROOT).startsWith("PLATFORM_");
	}

	private void validateRoleTenant(Role role, Tenant tenant) {
		if (!tenant.getId().equals(role.getTenantId())) {
			throw new InvalidRequestException("Role does not belong to tenant: " + role.getId());
		}
	}

	private Tenant requireAuthorizedTenantAccessForCallerAndTarget(UserAccount user, UUID tenantId) {
		assertCallerCanManageTenant(tenantId);
		assertCallerCanManageTargetUser(user);
		Tenant tenant = findTenant(tenantId);
		if (hasTenantAccess(user, tenantId)) {
			return tenant;
		}

		throw new InvalidRequestException("User does not have active access to tenant: " + tenantId);
	}

	private boolean hasTenantAccess(UserAccount user, UUID tenantId) {
		if (user.getTenant() != null && tenantId.equals(user.getTenant().getId())) {
			return true;
		}

		return userTenantAccessRepository.existsByUserAccount_IdAndTenant_IdAndActiveTrue(user.getId(), tenantId);
	}

	private UserAdministrationTenantAccessResponse toTenantAccessResponse(UserTenantAccess tenantAccess) {
		Tenant tenant = tenantAccess.getTenant();
		return new UserAdministrationTenantAccessResponse(
				tenantAccess.getId(),
				tenant.getId(),
				tenant.getCode(),
				tenant.getName(),
				tenantAccess.getAccessRole(),
				tenantAccess.getActive(),
				tenantAccess.getCreatedAt(),
				tenantAccess.getUpdatedAt());
	}

	private UserAdministrationReferenceResponse toTenantResponse(Tenant tenant) {
		return tenant == null ? null : new UserAdministrationReferenceResponse(tenant.getId(), tenant.getCode(), tenant.getName());
	}

	private UserAdministrationReferenceResponse toUserTypeResponse(UserType userType) {
		return userType == null ? null : new UserAdministrationReferenceResponse(userType.getId(), userType.getCode(), userType.getName());
	}

	private UserAdministrationReferenceResponse toAuthenticationMethodResponse(AuthenticationMethod authenticationMethod) {
		return authenticationMethod == null
				? null
				: new UserAdministrationReferenceResponse(authenticationMethod.getId(), authenticationMethod.getCode(), authenticationMethod.getName());
	}

	private UserAdministrationReferenceResponse toTimeZoneResponse(TimeZone timeZone) {
		return timeZone == null ? null : new UserAdministrationReferenceResponse(timeZone.getId(), timeZone.getCode(), timeZone.getName());
	}

	private UserAdministrationCompanyProfileResponse toCompanyProfileResponse(CompanyProfile companyProfile) {
		return companyProfile == null
				? null
				: new UserAdministrationCompanyProfileResponse(
						companyProfile.getId(),
						companyProfile.getCode(),
						companyProfile.getLegalName(),
						companyProfile.getTradeName());
	}

	private UserAdministrationCompanyProfileOptionResponse toCompanyProfileOptionResponse(CompanyProfile companyProfile) {
		return new UserAdministrationCompanyProfileOptionResponse(
				companyProfile.getId(),
				companyProfile.getTenant().getId(),
				companyProfile.getCode(),
				companyProfile.getLegalName(),
				companyProfile.getTradeName());
	}

	private UserAdministrationEmployeeResponse toEmployeeResponse(Employee employee) {
		return employee == null
				? null
				: new UserAdministrationEmployeeResponse(
						employee.getId(),
						employee.getEmployeeCode(),
						employee.getFirstName(),
						employee.getLastName(),
						employee.getEmail());
	}

	private String displayName(UserAccount user) {
		Employee employee = user.getEmployee();
		if (employee == null) {
			return user.getEmail();
		}

		String employeeDisplayName = employeeDisplayName(employee);
		return employeeDisplayName == null ? user.getEmail() : employeeDisplayName;
	}

	private String employeeDisplayName(Employee employee) {
		if (employee == null) {
			return null;
		}

		String displayName = (safe(employee.getFirstName()) + " " + safe(employee.getLastName())).trim();
		return displayName.isEmpty() ? null : displayName;
	}

	private List<UserAdministrationRoleResponse> sortedRoles(List<UserAdministrationRoleResponse> roles) {
		return roles.stream()
				.sorted(Comparator.comparing(UserAdministrationRoleResponse::code))
				.toList();
	}

	private List<UserAdministrationTenantAccessResponse> sortedTenantAccesses(List<UserAdministrationTenantAccessResponse> tenantAccesses) {
		return tenantAccesses.stream()
				.sorted(Comparator.comparing(UserAdministrationTenantAccessResponse::tenantCode))
				.toList();
	}

	private String safe(String value) {
		return value == null ? "" : value;
	}

	private UUID resolveAuthorizedTenantFilter(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (caller.isPlatformUser()) {
			return tenantId;
		}
		if (tenantId != null && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant user administration is not allowed for caller");
		}
		return caller.tenantId();
	}

	private void assertCallerCanManageTenant(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (!caller.isPlatformUser() && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant user administration is not allowed for caller");
		}
	}

	private void assertCallerCanManageTargetUser(UserAccount user) {
		CurrentCaller caller = currentCaller();
		if (!caller.isPlatformUser() && user.getTenant() != null && !caller.tenantId().equals(user.getTenant().getId())) {
			throw new AccessDeniedException("Cross-tenant user administration is not allowed for caller");
		}
		if (!caller.isPlatformUser() && isPlatformUserType(user.getUserType())) {
			throw new AccessDeniedException("Tenant administrators cannot manage platform users");
		}
	}

	private void assertUserNotDeleted(UserAccount user) {
		if (user.getDeletedAt() != null) {
			throw new InvalidRequestException("User account is logically deleted: " + user.getId());
		}
	}

	private ResourceConflictException userDeleteConflict() {
		return new ResourceConflictException("Utente non cancellabile perche gia referenziato.");
	}

	private CurrentCaller currentCaller() {
		return currentCallerService.requireCurrentCaller();
	}
}
