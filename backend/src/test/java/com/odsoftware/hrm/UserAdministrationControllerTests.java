package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.master.UserType;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UserAdministrationControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_PROFILE_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");
	private static final UUID PLATFORM_SUPER_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000003");
	private static final UUID EMPLOYEE_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000004");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private CompanyProfileRepository companyProfileRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private AuthenticationMethodRepository authenticationMethodRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private UserTenantAccessRepository userTenantAccessRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	@WithMockUser
	void userAdministrationListsUsersWithTenantFilterAndDerivedDisplayName() throws Exception {
		UserAccount linkedUser = saveUser("task0534.linked@example.com", EMPLOYEE_USER_TYPE_ID, saveEmployee("TASK0534_EMPLOYEE_1", "Ada", "Lovelace"));
		UserAccount emailOnlyUser = saveUser("task0534.emailonly@example.com", TENANT_ADMIN_USER_TYPE_ID, null);
		Tenant otherTenant = saveTenant("TASK0534_LIST_OTHER_TENANT");
		saveUser(otherTenant, "task0534.other@example.com");
		Role role = saveRole("TASK0534_LIST_ROLE", "Task 053.4 List Role");
		saveUserRole(role, linkedUser);
		saveUserTenantAccess(linkedUser, "TENANT_ADMIN");

		mockMvc.perform(get("/api/admin/users")
						.param("tenantId", FOUNDATION_TENANT_ID.toString())
						.param("search", "task0534"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(2))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].displayName").value("Ada Lovelace"))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].firstName").value("Ada"))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].roles[0].code").value("TASK0534_LIST_ROLE"))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].tenantAccesses[0].accessRole").value("TENANT_ADMIN"))
				.andExpect(jsonPath("$.content[?(@.id=='" + emailOnlyUser.getId() + "')].displayName").value("task0534.emailonly@example.com"))
				.andExpect(jsonPath("$.content[?(@.email=='task0534.other@example.com')]").isEmpty())
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(25));
	}

	@Test
	@WithMockUser
	void userAdministrationSupportsPlatformListWithoutTenantFilter() throws Exception {
		Tenant otherTenant = saveTenant("TASK0534_PLATFORM_TENANT");
		UserAccount user = saveUser(otherTenant, "task0534.platform@example.com");

		mockMvc.perform(get("/api/admin/users")
						.param("search", "task0534.platform@example.com"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(user.getId().toString()))
				.andExpect(jsonPath("$.content[0].tenant.id").value(otherTenant.getId().toString()));
	}

	@Test
	@WithMockUser
	void userAdministrationReturnsDetailWithoutSensitiveFields() throws Exception {
		Employee employee = saveEmployee("TASK0534_EMPLOYEE_2", "Grace", "Hopper");
		UserAccount user = saveUser("task0534.detail@example.com", EMPLOYEE_USER_TYPE_ID, employee);
		Role role = saveRole("TASK0534_DETAIL_ROLE", "Task 053.4 Detail Role");
		saveUserRole(role, user);
		saveUserTenantAccess(user, "TENANT_USER");

		mockMvc.perform(get("/api/admin/users/{userId}", user.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(user.getId().toString()))
				.andExpect(jsonPath("$.email").value("task0534.detail@example.com"))
				.andExpect(jsonPath("$.displayName").value("Grace Hopper"))
				.andExpect(jsonPath("$.employee.id").value(employee.getId().toString()))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.companyProfile.id").value(FOUNDATION_COMPANY_PROFILE_ID.toString()))
				.andExpect(jsonPath("$.userType.code").value("EMPLOYEE"))
				.andExpect(jsonPath("$.authenticationMethod.code").value("PASSWORD_ONLY"))
				.andExpect(jsonPath("$.roles[0].code").value("TASK0534_DETAIL_ROLE"))
				.andExpect(jsonPath("$.tenantAccesses[0].accessRole").value("TENANT_USER"))
				.andExpect(jsonPath("$.emailOtpEnabled").value(false))
				.andExpect(jsonPath("$.appOtpEnabled").value(false))
				.andExpect(jsonPath("$.strongAuthenticationRequired").value(false))
				.andExpect(jsonPath("$.passwordHash").doesNotExist())
				.andExpect(jsonPath("$.otpSecret").doesNotExist());
	}

	@Test
	@WithMockUser
	void userAdministrationReturnsNotFoundForMissingUser() throws Exception {
		mockMvc.perform(get("/api/admin/users/{userId}", MISSING_ID))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("User account not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void userAdministrationReturnsFormOptionsForCreateEdit() throws Exception {
		mockMvc.perform(get("/api/admin/users/form-options"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tenants[?(@.id=='" + FOUNDATION_TENANT_ID + "')]").exists())
				.andExpect(jsonPath("$.userTypes[?(@.code=='TENANT_ADMIN')]").exists())
				.andExpect(jsonPath("$.userTypes[?(@.code=='EMPLOYEE')]").exists())
				.andExpect(jsonPath("$.userTypes[?(@.code=='PLATFORM_SUPER_ADMIN')]").isEmpty())
				.andExpect(jsonPath("$.authenticationMethod.code").value("PASSWORD_ONLY"))
				.andExpect(jsonPath("$.companyProfiles[?(@.id=='" + FOUNDATION_COMPANY_PROFILE_ID + "')].tenantId").value(FOUNDATION_TENANT_ID.toString()));
	}

	@Test
	@WithMockUser
	void userAdministrationCreatesUserWithNormalizedEmailPasswordHashAndTenantAccess() throws Exception {
		String rawPassword = "TenantCreate1!";

		MvcResult result = mockMvc.perform(postJson("/api/admin/users", userCreateRequest(
						"  TASK0537.Create@Example.COM  ",
						TENANT_ADMIN_USER_TYPE_ID,
						FOUNDATION_TENANT_ID,
						FOUNDATION_COMPANY_PROFILE_ID,
						rawPassword)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("task0537.create@example.com"))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.primaryTenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.companyProfile.id").value(FOUNDATION_COMPANY_PROFILE_ID.toString()))
				.andExpect(jsonPath("$.userType.code").value("TENANT_ADMIN"))
				.andExpect(jsonPath("$.authenticationMethod.code").value("PASSWORD_ONLY"))
				.andExpect(jsonPath("$.active").value(true))
				.andExpect(jsonPath("$.locked").value(false))
				.andExpect(jsonPath("$.passwordChangedAt").isNotEmpty())
				.andExpect(jsonPath("$.tenantAccesses[0].tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.tenantAccesses[0].accessRole").value("TENANT_ADMIN"))
				.andExpect(jsonPath("$.passwordHash").doesNotExist())
				.andReturn();

		UserAccount createdUser = userAccountRepository.findByEmailIgnoreCase("task0537.create@example.com").orElseThrow();
		assertThat(passwordEncoder.matches(rawPassword, createdUser.getPasswordHash())).isTrue();
		assertThat(createdUser.getPasswordHash()).isNotEqualTo(rawPassword);
		assertThat(createdUser.getPrimaryTenant().getId()).isEqualTo(FOUNDATION_TENANT_ID);
		assertThat(createdUser.getActive()).isTrue();
		assertThat(createdUser.getLocked()).isFalse();
		UserTenantAccess tenantAccess = userTenantAccessRepository.findByUserAccount_IdAndTenant_Id(createdUser.getId(), FOUNDATION_TENANT_ID).orElseThrow();
		assertThat(tenantAccess.getAccessRole()).isEqualTo("TENANT_ADMIN");
		assertThat(tenantAccess.getActive()).isTrue();
		assertThat(result.getResponse().getContentAsString()).doesNotContain(rawPassword);
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsCreateWithDuplicateEmailCaseInsensitive() throws Exception {
		saveUser("task0537.duplicate@example.com", TENANT_ADMIN_USER_TYPE_ID, null);

		mockMvc.perform(postJson("/api/admin/users", userCreateRequest(
						"TASK0537.DUPLICATE@EXAMPLE.COM",
						TENANT_ADMIN_USER_TYPE_ID,
						FOUNDATION_TENANT_ID,
						null,
						"TenantCreate1!")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("User email already exists: task0537.duplicate@example.com"));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsCreateWithCompanyProfileFromDifferentTenant() throws Exception {
		Tenant otherTenant = saveTenant("TASK0537_COMPANY_OTHER_TENANT");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0537_OTHER_COMPANY");

		mockMvc.perform(postJson("/api/admin/users", userCreateRequest(
						"task0537.company-mismatch@example.com",
						TENANT_ADMIN_USER_TYPE_ID,
						FOUNDATION_TENANT_ID,
						otherCompanyProfile.getId(),
						"TenantCreate1!")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Company profile does not belong to tenant: " + otherCompanyProfile.getId()));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsCreateWithPlatformUserType() throws Exception {
		mockMvc.perform(postJson("/api/admin/users", userCreateRequest(
						"task0537.platform-type@example.com",
						PLATFORM_SUPER_ADMIN_USER_TYPE_ID,
						FOUNDATION_TENANT_ID,
						null,
						"TenantCreate1!")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("User type is not allowed for tenant user creation: " + PLATFORM_SUPER_ADMIN_USER_TYPE_ID));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsCreateWhenInitialPasswordDoesNotSatisfyPolicy() throws Exception {
		mockMvc.perform(postJson("/api/admin/users", userCreateRequest(
						"task0537.weak-password@example.com",
						TENANT_ADMIN_USER_TYPE_ID,
						FOUNDATION_TENANT_ID,
						null,
						"weak")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Password does not satisfy the current password policy."));
	}

	@Test
	@WithMockUser
	void userAdministrationUpdatesEmailAndCompanyProfileOnly() throws Exception {
		UserAccount user = saveUser("task0537.update@example.com", TENANT_ADMIN_USER_TYPE_ID, null);
		CompanyProfile companyProfile = companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow();

		mockMvc.perform(putJson("/api/admin/users/" + user.getId(), userUpdateRequest(" TASK0537.Updated@Example.COM ", companyProfile.getId())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("task0537.updated@example.com"))
				.andExpect(jsonPath("$.companyProfile.id").value(companyProfile.getId().toString()))
				.andExpect(jsonPath("$.userType.code").value("TENANT_ADMIN"))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.authenticationMethod.code").value("PASSWORD_ONLY"));

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getEmail()).isEqualTo("task0537.updated@example.com");
		assertThat(reloadedUser.getCompanyProfile().getId()).isEqualTo(companyProfile.getId());
		assertThat(reloadedUser.getUserType().getId()).isEqualTo(TENANT_ADMIN_USER_TYPE_ID);
		assertThat(reloadedUser.getTenant().getId()).isEqualTo(FOUNDATION_TENANT_ID);
	}

	@Test
	@WithMockUser
	void userAdministrationUpdatesCompanyProfileToNull() throws Exception {
		UserAccount user = saveUser("task0537.clear-company@example.com", TENANT_ADMIN_USER_TYPE_ID, null);

		mockMvc.perform(putJson("/api/admin/users/" + user.getId(), userUpdateRequest("task0537.clear-company@example.com", null)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.companyProfile").doesNotExist());

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getCompanyProfile()).isNull();
	}

	@Test
	@WithMockUser
	void userAdministrationListsAvailableRolesForTenantExcludingAssignedAndInactiveRoles() throws Exception {
		UserAccount user = saveUser("task0535.available@example.com", EMPLOYEE_USER_TYPE_ID, null);
		saveUserTenantAccess(user, "TENANT_USER");
		Role assignedRole = saveRole("TASK0535_AVAILABLE_ASSIGNED", "Task 053.5 Assigned Role");
		Role availableRole = saveRole("TASK0535_AVAILABLE_ROLE", "Task 053.5 Available Role");
		saveRole(FOUNDATION_TENANT_ID, "TASK0535_AVAILABLE_INACTIVE", "Task 053.5 Inactive Role", false);
		saveUserRole(assignedRole, user);

		mockMvc.perform(get("/api/admin/users/{userId}/available-roles", user.getId())
						.param("tenantId", FOUNDATION_TENANT_ID.toString()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[?(@.id=='" + availableRole.getId() + "')].code").value("TASK0535_AVAILABLE_ROLE"))
				.andExpect(jsonPath("$[?(@.id=='" + availableRole.getId() + "')].tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$[?(@.id=='" + assignedRole.getId() + "')]").isEmpty())
				.andExpect(jsonPath("$[?(@.code=='TASK0535_AVAILABLE_INACTIVE')]").isEmpty());
	}

	@Test
	@WithMockUser
	void userAdministrationReturnsEmptyAssignedRolesForAccountTenantWithoutAccessBridge() throws Exception {
		UserAccount user = saveUser("task0535.emptyroles@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(get("/api/admin/users/{userId}/roles", user.getId())
						.param("tenantId", FOUNDATION_TENANT_ID.toString()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(0));
	}

	@Test
	@WithMockUser
	void userAdministrationReturnsAvailableRolesForAccountTenantWithoutAccessBridge() throws Exception {
		UserAccount user = saveUser("task0535.emptyavailable@example.com", EMPLOYEE_USER_TYPE_ID, null);
		Role availableRole = saveRole("TASK0535_EMPTY_AVAILABLE", "Task 053.5 Empty Available Role");

		mockMvc.perform(get("/api/admin/users/{userId}/available-roles", user.getId())
						.param("tenantId", FOUNDATION_TENANT_ID.toString()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[?(@.id=='" + availableRole.getId() + "')].code").value("TASK0535_EMPTY_AVAILABLE"))
				.andExpect(jsonPath("$[?(@.id=='" + availableRole.getId() + "')].tenantId").value(FOUNDATION_TENANT_ID.toString()));
	}

	@Test
	@WithMockUser
	void userAdministrationAssignsTenantRoleToUser() throws Exception {
		UserAccount user = saveUser("task0535.assign@example.com", EMPLOYEE_USER_TYPE_ID, null);
		saveUserTenantAccess(user, "TENANT_USER");
		Role role = saveRole("TASK0535_ASSIGN_ROLE", "Task 053.5 Assign Role");

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(FOUNDATION_TENANT_ID, role.getId())))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].id").value(role.getId().toString()))
				.andExpect(jsonPath("$[0].code").value("TASK0535_ASSIGN_ROLE"));

		assertThat(userRoleRepository.existsByTenant_IdAndUserAccount_IdAndRole_Id(FOUNDATION_TENANT_ID, user.getId(), role.getId())).isTrue();
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsDuplicateRoleAssignment() throws Exception {
		UserAccount user = saveUser("task0535.duplicate@example.com", EMPLOYEE_USER_TYPE_ID, null);
		saveUserTenantAccess(user, "TENANT_USER");
		Role role = saveRole("TASK0535_DUPLICATE_ASSIGNMENT", "Task 053.5 Duplicate Assignment");
		saveUserRole(role, user);

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(FOUNDATION_TENANT_ID, role.getId())))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Role already assigned to user for tenant: " + role.getId()));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsRoleAssignmentWhenRoleBelongsToDifferentTenant() throws Exception {
		UserAccount user = saveUser("task0535.otherrole@example.com", EMPLOYEE_USER_TYPE_ID, null);
		saveUserTenantAccess(user, "TENANT_USER");
		Tenant otherTenant = saveTenant("TASK0535_ROLE_OTHER_TENANT");
		Role otherTenantRole = saveRole(otherTenant.getId(), "TASK0535_OTHER_TENANT_ROLE", "Task 053.5 Other Tenant Role", true);

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(FOUNDATION_TENANT_ID, otherTenantRole.getId())))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Role does not belong to tenant: " + otherTenantRole.getId()));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsRoleAssignmentWithoutActiveTenantAccess() throws Exception {
		UserAccount user = saveUser("task0535.noaccess@example.com", EMPLOYEE_USER_TYPE_ID, null);
		Tenant otherTenant = saveTenant("TASK0535_NO_ACCESS_TENANT");
		Role role = saveRole(otherTenant.getId(), "TASK0535_NO_ACCESS_ROLE", "Task 053.5 No Access Role", true);

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(otherTenant.getId(), role.getId())))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("User does not have active access to tenant: " + otherTenant.getId()));
	}

	@Test
	@WithMockUser
	void userAdministrationRemovesTenantRoleFromUser() throws Exception {
		UserAccount user = saveUser("task0535.remove@example.com", EMPLOYEE_USER_TYPE_ID, null);
		saveUserTenantAccess(user, "TENANT_USER");
		Role role = saveRole("TASK0535_REMOVE_ROLE", "Task 053.5 Remove Role");
		saveUserRole(role, user);

		mockMvc.perform(delete("/api/admin/users/{userId}/roles/{roleId}", user.getId(), role.getId())
						.param("tenantId", FOUNDATION_TENANT_ID.toString()))
				.andExpect(status().isNoContent());

		assertThat(userRoleRepository.existsByTenant_IdAndUserAccount_IdAndRole_Id(FOUNDATION_TENANT_ID, user.getId(), role.getId())).isFalse();
	}

	@Test
	@WithMockUser
	void userAdministrationResetsPasswordForAccountTenantWithoutAccessBridge() throws Exception {
		UserAccount user = saveUser("task0536.reset.directtenant@example.com", EMPLOYEE_USER_TYPE_ID, null);
		user.setPasswordHash("legacy-hash");
		user.setPasswordChangedAt(OffsetDateTime.parse("2026-05-10T08:00:00Z"));
		user.setLocked(true);
		user.setFailedLoginAttempts(3);
		userAccountRepository.saveAndFlush(user);

		String rawPassword = "TenantReset1!";
		MvcResult result = mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(FOUNDATION_TENANT_ID, rawPassword)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.userId").value(user.getId().toString()))
				.andExpect(jsonPath("$.tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.passwordChangedAt").isNotEmpty())
				.andExpect(jsonPath("$.locked").value(true))
				.andExpect(jsonPath("$.failedLoginAttempts").value(3))
				.andExpect(jsonPath("$.passwordHash").doesNotExist())
				.andExpect(jsonPath("$.newPassword").doesNotExist())
				.andReturn();

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getPasswordHash()).isNotEqualTo("legacy-hash");
		assertThat(reloadedUser.getPasswordHash()).isNotEqualTo(rawPassword);
		assertThat(passwordEncoder.matches(rawPassword, reloadedUser.getPasswordHash())).isTrue();
		assertThat(reloadedUser.getPasswordChangedAt()).isAfter(OffsetDateTime.parse("2026-05-10T08:00:00Z"));
		assertThat(reloadedUser.getLocked()).isTrue();
		assertThat(reloadedUser.getFailedLoginAttempts()).isEqualTo(3);
		assertThat(result.getResponse().getContentAsString()).doesNotContain(rawPassword);
	}

	@Test
	@WithMockUser
	void userAdministrationResetsPasswordWithActiveTenantAccess() throws Exception {
		Tenant otherTenant = saveTenant("TASK0536_ACCESS_TENANT");
		UserAccount user = saveUser("task0536.reset.access@example.com", EMPLOYEE_USER_TYPE_ID, null);
		saveUserTenantAccess(user, otherTenant, "TENANT_USER");

		mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(otherTenant.getId(), "TenantAccess1!")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tenantId").value(otherTenant.getId().toString()));

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(passwordEncoder.matches("TenantAccess1!", reloadedUser.getPasswordHash())).isTrue();
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsPasswordResetWhenPasswordDoesNotSatisfyPolicy() throws Exception {
		UserAccount user = saveUser("task0536.weak@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(FOUNDATION_TENANT_ID, "weak")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Password does not satisfy the current password policy."));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsPasswordResetWithoutActiveTenantAccess() throws Exception {
		UserAccount user = saveUser("task0536.noaccess@example.com", EMPLOYEE_USER_TYPE_ID, null);
		Tenant otherTenant = saveTenant("TASK0536_NO_ACCESS_TENANT");

		mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(otherTenant.getId(), "OtherTenant1!")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("User does not have active access to tenant: " + otherTenant.getId()));
	}

	@Test
	void openApiIncludesUserAdministrationEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/users']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/form-options']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/form-options'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles/{roleId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles/{roleId}'].delete").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/available-roles']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/available-roles'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/password']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/password'].put").exists());
	}

	private Tenant saveTenant(String code) {
		Tenant foundationTenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		Tenant tenant = new Tenant();
		tenant.setCode(code);
		tenant.setName(code);
		tenant.setLegalName(code + " Legal Entity");
		tenant.setDefaultCountry(foundationTenant.getDefaultCountry());
		tenant.setDefaultCurrency(foundationTenant.getDefaultCurrency());
		tenant.setActive(true);
		return tenantRepository.saveAndFlush(tenant);
	}

	private CompanyProfile saveCompanyProfile(Tenant tenant, String code) {
		CompanyProfile baseCompanyProfile = companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow();
		CompanyProfile companyProfile = new CompanyProfile();
		companyProfile.setTenant(tenant);
		companyProfile.setCompanyProfileType(baseCompanyProfile.getCompanyProfileType());
		companyProfile.setCode(code);
		companyProfile.setLegalName(code + " Legal Entity");
		companyProfile.setTradeName(code);
		companyProfile.setCountry(baseCompanyProfile.getCountry());
		companyProfile.setStreet("Task 053.7 Street");
		companyProfile.setStreetNumber("1");
		companyProfile.setActive(true);
		return companyProfileRepository.saveAndFlush(companyProfile);
	}

	private Employee saveEmployee(String employeeCode, String firstName, String lastName) {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfile companyProfile = companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow();
		Employee employee = new Employee();
		employee.setTenant(tenant);
		employee.setCompany(companyProfile);
		employee.setEmployeeCode(employeeCode);
		employee.setFirstName(firstName);
		employee.setLastName(lastName);
		employee.setEmail(employeeCode.toLowerCase() + "@example.com");
		employee.setEmploymentStatus("ACTIVE");
		employee.setActive(true);
		return employeeRepository.saveAndFlush(employee);
	}

	private UserAccount saveUser(String email, UUID userTypeId, Employee employee) {
		UserAccount userAccount = baseUser(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(), email, userTypeId);
		userAccount.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow());
		userAccount.setEmployee(employee);
		return userAccountRepository.saveAndFlush(userAccount);
	}

	private UserAccount saveUser(Tenant tenant, String email) {
		return userAccountRepository.saveAndFlush(baseUser(tenant, email, TENANT_ADMIN_USER_TYPE_ID));
	}

	private UserAccount baseUser(Tenant tenant, String email, UUID userTypeId) {
		UserType userType = userTypeRepository.findById(userTypeId).orElseThrow();
		AuthenticationMethod authenticationMethod = authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID).orElseThrow();
		UserAccount userAccount = new UserAccount();
		userAccount.setTenant(tenant);
		userAccount.setPrimaryTenant(tenant);
		userAccount.setUserType(userType);
		userAccount.setAuthenticationMethod(authenticationMethod);
		userAccount.setEmail(email);
		userAccount.setActive(true);
		userAccount.setLocked(false);
		return userAccount;
	}

	private Role saveRole(String code, String name) {
		return saveRole(FOUNDATION_TENANT_ID, code, name, true);
	}

	private Role saveRole(UUID tenantId, String code, String name, boolean active) {
		Role role = new Role();
		role.setTenantId(tenantId);
		role.setCode(code);
		role.setName(name);
		role.setSystemRole(false);
		role.setActive(active);
		return roleRepository.saveAndFlush(role);
	}

	private void saveUserRole(Role role, UserAccount userAccount) {
		UserRole userRole = new UserRole();
		userRole.setTenant(tenantRepository.findById(role.getTenantId()).orElseThrow());
		userRole.setUserAccount(userAccount);
		userRole.setRole(role);
		userRoleRepository.saveAndFlush(userRole);
	}

	private void saveUserTenantAccess(UserAccount userAccount, String accessRole) {
		saveUserTenantAccess(userAccount, userAccount.getTenant(), accessRole);
	}

	private void saveUserTenantAccess(UserAccount userAccount, Tenant tenant, String accessRole) {
		UserTenantAccess userTenantAccess = new UserTenantAccess();
		userTenantAccess.setUserAccount(userAccount);
		userTenantAccess.setTenant(tenant);
		userTenantAccess.setAccessRole(accessRole);
		userTenantAccess.setActive(true);
		userTenantAccessRepository.saveAndFlush(userTenantAccess);
	}

	private java.util.Map<String, Object> roleAssignmentRequest(UUID tenantId, UUID roleId) {
		java.util.Map<String, Object> request = new java.util.LinkedHashMap<>();
		request.put("tenantId", tenantId);
		request.put("roleId", roleId);
		return request;
	}

	private java.util.Map<String, Object> passwordResetRequest(UUID tenantId, String newPassword) {
		java.util.Map<String, Object> request = new java.util.LinkedHashMap<>();
		request.put("tenantId", tenantId);
		request.put("newPassword", newPassword);
		return request;
	}

	private java.util.Map<String, Object> userCreateRequest(String email, UUID userTypeId, UUID tenantId, UUID companyProfileId, String initialPassword) {
		java.util.Map<String, Object> request = new java.util.LinkedHashMap<>();
		request.put("email", email);
		request.put("userTypeId", userTypeId);
		request.put("tenantId", tenantId);
		request.put("companyProfileId", companyProfileId);
		request.put("initialPassword", initialPassword);
		return request;
	}

	private java.util.Map<String, Object> userUpdateRequest(String email, UUID companyProfileId) {
		java.util.Map<String, Object> request = new java.util.LinkedHashMap<>();
		request.put("email", email);
		request.put("companyProfileId", companyProfileId);
		return request;
	}

	private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder postJson(String path, Object request) throws Exception {
		return post(path)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request));
	}

	private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder putJson(String path, Object request) throws Exception {
		return put(path)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request));
	}
}
