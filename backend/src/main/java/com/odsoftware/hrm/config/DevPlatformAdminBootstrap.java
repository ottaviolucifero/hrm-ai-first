package com.odsoftware.hrm.config;

import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.master.UserType;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Profile("dev")
public class DevPlatformAdminBootstrap implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(DevPlatformAdminBootstrap.class);

	static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	static final UUID PLATFORM_SUPER_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000001");
	static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");
	static final String DEV_PLATFORM_ROLE_CODE = "DEV_PLATFORM_TENANT_ADMIN_QA";
	private static final String DEV_PLATFORM_ROLE_NAME = "Dev Platform Tenant Admin QA";
	private static final String DEV_PLATFORM_ACCESS_ROLE = "PLATFORM_SUPER_ADMIN";
	private static final List<String> REQUIRED_PERMISSION_CODES = List.of(
			"PLATFORM.TENANT.READ",
			"PLATFORM.TENANT.CREATE",
			"PLATFORM.TENANT.UPDATE",
			"PLATFORM.TENANT.DELETE",
			"PLATFORM.TENANT.MANAGE",
			"PLATFORM.COMPANY_PROFILE.READ",
			"PLATFORM.COMPANY_PROFILE.CREATE",
			"PLATFORM.COMPANY_PROFILE.UPDATE",
			"PLATFORM.COMPANY_PROFILE.DELETE",
			"PLATFORM.DEVICE.READ",
			"PLATFORM.DEVICE.CREATE",
			"PLATFORM.DEVICE.UPDATE",
			"PLATFORM.DEVICE.DELETE",
			"PLATFORM.LEAVE_REQUEST.READ",
			"PLATFORM.LEAVE_REQUEST.CREATE",
			"PLATFORM.LEAVE_REQUEST.UPDATE",
			"PLATFORM.LEAVE_REQUEST.DELETE",
			"PLATFORM.HOLIDAY_CALENDAR.READ",
			"PLATFORM.HOLIDAY_CALENDAR.CREATE",
			"PLATFORM.HOLIDAY_CALENDAR.UPDATE",
			"PLATFORM.HOLIDAY_CALENDAR.DELETE");

	private final TenantRepository tenantRepository;
	private final UserAccountRepository userAccountRepository;
	private final UserTypeRepository userTypeRepository;
	private final AuthenticationMethodRepository authenticationMethodRepository;
	private final RoleRepository roleRepository;
	private final PermissionRepository permissionRepository;
	private final RolePermissionRepository rolePermissionRepository;
	private final UserRoleRepository userRoleRepository;
	private final UserTenantAccessRepository userTenantAccessRepository;
	private final PasswordEncoder passwordEncoder;
	private final boolean enabled;
	private final String email;
	private final String password;

	public DevPlatformAdminBootstrap(
			TenantRepository tenantRepository,
			UserAccountRepository userAccountRepository,
			UserTypeRepository userTypeRepository,
			AuthenticationMethodRepository authenticationMethodRepository,
			RoleRepository roleRepository,
			PermissionRepository permissionRepository,
			RolePermissionRepository rolePermissionRepository,
			UserRoleRepository userRoleRepository,
			UserTenantAccessRepository userTenantAccessRepository,
			PasswordEncoder passwordEncoder,
			@Value("${hrm.dev.platform-admin.enabled:false}") boolean enabled,
			@Value("${hrm.dev.platform-admin.email:ottavio.lucifero@igesa.it}") String email,
			@Value("${hrm.dev.platform-admin.password:}") String password) {
		this.tenantRepository = tenantRepository;
		this.userAccountRepository = userAccountRepository;
		this.userTypeRepository = userTypeRepository;
		this.authenticationMethodRepository = authenticationMethodRepository;
		this.roleRepository = roleRepository;
		this.permissionRepository = permissionRepository;
		this.rolePermissionRepository = rolePermissionRepository;
		this.userRoleRepository = userRoleRepository;
		this.userTenantAccessRepository = userTenantAccessRepository;
		this.passwordEncoder = passwordEncoder;
		this.enabled = enabled;
		this.email = email;
		this.password = password;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (!enabled) {
			return;
		}

		String normalizedEmail = normalizeEmail(email);
		if (normalizedEmail.isBlank()) {
			log.warn("Dev platform admin bootstrap skipped because the configured email is blank");
			return;
		}
		if (password == null || password.isBlank()) {
			log.warn("Dev platform admin bootstrap skipped for {} because no password is configured", normalizedEmail);
			return;
		}

		Tenant foundationTenant = tenantRepository.findById(FOUNDATION_TENANT_ID)
				.orElseThrow(() -> new IllegalStateException("Foundation tenant not found: " + FOUNDATION_TENANT_ID));
		UserType platformSuperAdmin = userTypeRepository.findById(PLATFORM_SUPER_ADMIN_USER_TYPE_ID)
				.orElseThrow(() -> new IllegalStateException("Platform super admin user type not found: " + PLATFORM_SUPER_ADMIN_USER_TYPE_ID));
		AuthenticationMethod passwordOnly = authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID)
				.orElseThrow(() -> new IllegalStateException("Password-only authentication method not found: " + PASSWORD_ONLY_AUTHENTICATION_METHOD_ID));

		Role role = ensureRole(foundationTenant);
		List<Permission> permissions = resolvePermissions();
		ensureRolePermissions(foundationTenant, role, permissions);
		UserAccount userAccount = ensureUserAccount(foundationTenant, platformSuperAdmin, passwordOnly, normalizedEmail);
		ensureTenantAccess(userAccount, foundationTenant);
		ensureUserRole(userAccount, foundationTenant, role);

		log.info("Dev platform admin bootstrap aligned account {}", normalizedEmail);
	}

	private Role ensureRole(Tenant foundationTenant) {
		return roleRepository.findByTenantIdAndCode(FOUNDATION_TENANT_ID, DEV_PLATFORM_ROLE_CODE)
				.map(existingRole -> {
					existingRole.setName(DEV_PLATFORM_ROLE_NAME);
					existingRole.setSystemRole(false);
					existingRole.setActive(true);
					return roleRepository.saveAndFlush(existingRole);
				})
				.orElseGet(() -> {
					Role role = new Role();
					role.setTenantId(FOUNDATION_TENANT_ID);
					role.setCode(DEV_PLATFORM_ROLE_CODE);
					role.setName(DEV_PLATFORM_ROLE_NAME);
					role.setSystemRole(false);
					role.setActive(true);
					return roleRepository.saveAndFlush(role);
				});
	}

	private List<Permission> resolvePermissions() {
		return REQUIRED_PERMISSION_CODES.stream()
				.map(code -> permissionRepository.findByTenantIdAndCode(FOUNDATION_TENANT_ID, code)
						.orElseThrow(() -> new IllegalStateException("Required platform permission not found: " + code)))
				.toList();
	}

	private void ensureRolePermissions(Tenant foundationTenant, Role role, List<Permission> permissions) {
		Set<String> grantedPermissionCodes = new LinkedHashSet<>(
				rolePermissionRepository.findPermissionCodesByTenantIdAndRoleId(FOUNDATION_TENANT_ID, role.getId()));
		for (Permission permission : permissions) {
			if (grantedPermissionCodes.contains(permission.getCode())) {
				continue;
			}
			RolePermission rolePermission = new RolePermission();
			rolePermission.setTenant(foundationTenant);
			rolePermission.setRole(role);
			rolePermission.setPermission(permission);
			rolePermissionRepository.save(rolePermission);
		}
	}

	private UserAccount ensureUserAccount(
			Tenant foundationTenant,
			UserType platformSuperAdmin,
			AuthenticationMethod passwordOnly,
			String normalizedEmail) {
		UserAccount userAccount = userAccountRepository.findByEmailIgnoreCase(normalizedEmail)
				.orElseGet(UserAccount::new);
		userAccount.setTenant(foundationTenant);
		userAccount.setPrimaryTenant(foundationTenant);
		userAccount.setUserType(platformSuperAdmin);
		userAccount.setAuthenticationMethod(passwordOnly);
		userAccount.setEmail(normalizedEmail);
		userAccount.setPasswordHash(passwordEncoder.encode(password));
		userAccount.setPasswordChangedAt(OffsetDateTime.now());
		userAccount.setStrongAuthenticationRequired(true);
		userAccount.setActive(true);
		userAccount.setLocked(false);
		return userAccountRepository.saveAndFlush(userAccount);
	}

	private void ensureTenantAccess(UserAccount userAccount, Tenant foundationTenant) {
		UserTenantAccess tenantAccess = userTenantAccessRepository.findByUserAccount_IdAndTenant_Id(userAccount.getId(), FOUNDATION_TENANT_ID)
				.orElseGet(UserTenantAccess::new);
		tenantAccess.setUserAccount(userAccount);
		tenantAccess.setTenant(foundationTenant);
		tenantAccess.setAccessRole(DEV_PLATFORM_ACCESS_ROLE);
		tenantAccess.setActive(true);
		userTenantAccessRepository.saveAndFlush(tenantAccess);
	}

	private void ensureUserRole(UserAccount userAccount, Tenant foundationTenant, Role role) {
		if (userRoleRepository.existsByTenant_IdAndUserAccount_IdAndRole_Id(FOUNDATION_TENANT_ID, userAccount.getId(), role.getId())) {
			return;
		}
		UserRole userRole = new UserRole();
		userRole.setTenant(foundationTenant);
		userRole.setUserAccount(userAccount);
		userRole.setRole(role);
		userRoleRepository.saveAndFlush(userRole);
	}

	private String normalizeEmail(String candidate) {
		if (candidate == null) {
			return "";
		}
		return candidate.trim().toLowerCase(Locale.ROOT);
	}
}
