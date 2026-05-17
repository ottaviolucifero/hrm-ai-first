package com.odsoftware.hrm;

import com.odsoftware.hrm.config.DevPlatformAdminBootstrap;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.master.UserType;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import java.lang.reflect.Field;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DevPlatformAdminBootstrapTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID PLATFORM_SUPER_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000001");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");
	private static final String DEV_PLATFORM_ROLE_CODE = "DEV_PLATFORM_TENANT_ADMIN_QA";

	@Test
	void runSkipsWhenBootstrapIsDisabled() throws Exception {
		TenantRepository tenantRepository = mock(TenantRepository.class);
		UserAccountRepository userAccountRepository = mock(UserAccountRepository.class);
		UserTypeRepository userTypeRepository = mock(UserTypeRepository.class);
		AuthenticationMethodRepository authenticationMethodRepository = mock(AuthenticationMethodRepository.class);
		RoleRepository roleRepository = mock(RoleRepository.class);
		PermissionRepository permissionRepository = mock(PermissionRepository.class);
		RolePermissionRepository rolePermissionRepository = mock(RolePermissionRepository.class);
		UserRoleRepository userRoleRepository = mock(UserRoleRepository.class);
		UserTenantAccessRepository userTenantAccessRepository = mock(UserTenantAccessRepository.class);
		PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

		DevPlatformAdminBootstrap bootstrap = new DevPlatformAdminBootstrap(
				tenantRepository,
				userAccountRepository,
				userTypeRepository,
				authenticationMethodRepository,
				roleRepository,
				permissionRepository,
				rolePermissionRepository,
				userRoleRepository,
				userTenantAccessRepository,
				passwordEncoder,
				false,
				"ottavio.lucifero@igesa.it",
				"Secret1!");

		bootstrap.run(new DefaultApplicationArguments(new String[0]));

		verifyNoBootstrapInteractions(
				tenantRepository,
				userAccountRepository,
				userTypeRepository,
				authenticationMethodRepository,
				roleRepository,
				permissionRepository,
				rolePermissionRepository,
				userRoleRepository,
				userTenantAccessRepository,
				passwordEncoder);
	}

	@Test
	void runCreatesDevPlatformAdminWhenEnabled() throws Exception {
		TenantRepository tenantRepository = mock(TenantRepository.class);
		UserAccountRepository userAccountRepository = mock(UserAccountRepository.class);
		UserTypeRepository userTypeRepository = mock(UserTypeRepository.class);
		AuthenticationMethodRepository authenticationMethodRepository = mock(AuthenticationMethodRepository.class);
		RoleRepository roleRepository = mock(RoleRepository.class);
		PermissionRepository permissionRepository = mock(PermissionRepository.class);
		RolePermissionRepository rolePermissionRepository = mock(RolePermissionRepository.class);
		UserRoleRepository userRoleRepository = mock(UserRoleRepository.class);
		UserTenantAccessRepository userTenantAccessRepository = mock(UserTenantAccessRepository.class);
		PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);

		Tenant foundationTenant = new Tenant();
		setId(foundationTenant, FOUNDATION_TENANT_ID);

		UserType platformUserType = new UserType();
		setId(platformUserType, PLATFORM_SUPER_ADMIN_USER_TYPE_ID);

		AuthenticationMethod authenticationMethod = new AuthenticationMethod();
		setId(authenticationMethod, PASSWORD_ONLY_AUTHENTICATION_METHOD_ID);

		Role savedRole = new Role();
		setId(savedRole, UUID.fromString("75000000-0000-0000-0000-000000000090"));
		savedRole.setTenantId(FOUNDATION_TENANT_ID);
		savedRole.setCode(DEV_PLATFORM_ROLE_CODE);
		savedRole.setName("Dev Platform Tenant Admin QA");
		savedRole.setSystemRole(false);
		savedRole.setActive(true);

		UserAccount savedUser = new UserAccount();
		setId(savedUser, UUID.fromString("90000000-0000-0000-0000-000000000090"));

		when(tenantRepository.findById(FOUNDATION_TENANT_ID)).thenReturn(Optional.of(foundationTenant));
		when(userTypeRepository.findById(PLATFORM_SUPER_ADMIN_USER_TYPE_ID)).thenReturn(Optional.of(platformUserType));
		when(authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID)).thenReturn(Optional.of(authenticationMethod));
		when(roleRepository.findByTenantIdAndCode(FOUNDATION_TENANT_ID, DEV_PLATFORM_ROLE_CODE))
				.thenReturn(Optional.empty());
		when(roleRepository.saveAndFlush(any(Role.class))).thenReturn(savedRole);
		when(rolePermissionRepository.findPermissionCodesByTenantIdAndRoleId(FOUNDATION_TENANT_ID, savedRole.getId()))
				.thenReturn(java.util.List.of());
		when(userAccountRepository.findByEmailIgnoreCase("ottavio.lucifero@igesa.it")).thenReturn(Optional.empty());
		when(passwordEncoder.encode("Secret1!")).thenReturn("encoded-secret");
		when(userAccountRepository.saveAndFlush(any(UserAccount.class))).thenReturn(savedUser);
		when(userTenantAccessRepository.findByUserAccount_IdAndTenant_Id(savedUser.getId(), FOUNDATION_TENANT_ID))
				.thenReturn(Optional.empty());
		when(userRoleRepository.existsByTenant_IdAndUserAccount_IdAndRole_Id(
				FOUNDATION_TENANT_ID,
				savedUser.getId(),
				savedRole.getId())).thenReturn(false);

		for (String permissionCode : java.util.List.of(
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
				"PLATFORM.HOLIDAY_CALENDAR.DELETE")) {
			Permission permission = new Permission();
			setId(permission, UUID.randomUUID());
			permission.setTenantId(FOUNDATION_TENANT_ID);
			permission.setCode(permissionCode);
			permission.setName(permissionCode);
			permission.setActive(true);
			when(permissionRepository.findByTenantIdAndCode(FOUNDATION_TENANT_ID, permissionCode))
					.thenReturn(Optional.of(permission));
		}

		DevPlatformAdminBootstrap bootstrap = new DevPlatformAdminBootstrap(
				tenantRepository,
				userAccountRepository,
				userTypeRepository,
				authenticationMethodRepository,
				roleRepository,
				permissionRepository,
				rolePermissionRepository,
				userRoleRepository,
				userTenantAccessRepository,
				passwordEncoder,
				true,
				"Ottavio.Lucifero@IGESA.IT",
				"Secret1!");

		bootstrap.run(new DefaultApplicationArguments(new String[0]));

		verify(passwordEncoder).encode("Secret1!");
		verify(roleRepository).saveAndFlush(any(Role.class));
		verify(userAccountRepository).saveAndFlush(any(UserAccount.class));
		verify(rolePermissionRepository, times(21)).save(any());
		verify(userTenantAccessRepository).saveAndFlush(any());
		verify(userRoleRepository).saveAndFlush(any());
		verify(userAccountRepository).findByEmailIgnoreCase("ottavio.lucifero@igesa.it");
	}

	private void verifyNoBootstrapInteractions(
			TenantRepository tenantRepository,
			UserAccountRepository userAccountRepository,
			UserTypeRepository userTypeRepository,
			AuthenticationMethodRepository authenticationMethodRepository,
			RoleRepository roleRepository,
			PermissionRepository permissionRepository,
			RolePermissionRepository rolePermissionRepository,
			UserRoleRepository userRoleRepository,
			UserTenantAccessRepository userTenantAccessRepository,
			PasswordEncoder passwordEncoder) {
		verify(tenantRepository, never()).findById(any());
		verify(userAccountRepository, never()).findByEmailIgnoreCase(any());
		verify(userTypeRepository, never()).findById(any());
		verify(authenticationMethodRepository, never()).findById(any());
		verify(roleRepository, never()).findByTenantIdAndCode(any(), any());
		verify(permissionRepository, never()).findByTenantIdAndCode(any(), any());
		verify(rolePermissionRepository, never()).findPermissionCodesByTenantIdAndRoleId(any(), any());
		verify(userRoleRepository, never()).existsByTenant_IdAndUserAccount_IdAndRole_Id(any(), any(), any());
		verify(userTenantAccessRepository, never()).findByUserAccount_IdAndTenant_Id(any(), any());
		verify(passwordEncoder, never()).encode(any());
	}

	private static void setId(Object target, UUID id) throws Exception {
		Class<?> type = target.getClass();
		while (type != null) {
			try {
				Field field = type.getDeclaredField("id");
				field.setAccessible(true);
				field.set(target, id);
				return;
			} catch (NoSuchFieldException ignored) {
				type = type.getSuperclass();
			}
		}
		throw new NoSuchFieldException("id");
	}
}
