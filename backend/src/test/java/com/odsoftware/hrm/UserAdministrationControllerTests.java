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
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
	private static final UUID TENANT_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000011");
	private static final UUID PLATFORM_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000012");
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
						.with(userAdminCaller())
						.param("tenantId", FOUNDATION_TENANT_ID.toString())
						.param("search", "task0534"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(2))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].displayName").value("Ada Lovelace"))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].firstName").value("Ada"))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].employeeId").value(linkedUser.getEmployee().getId().toString()))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].employeeDisplayName").value("Ada Lovelace"))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].hasEmployeeLink").value(true))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].roles[0].code").value("TASK0534_LIST_ROLE"))
				.andExpect(jsonPath("$.content[?(@.id=='" + linkedUser.getId() + "')].tenantAccesses[0].accessRole").value("TENANT_ADMIN"))
				.andExpect(jsonPath("$.content[?(@.id=='" + emailOnlyUser.getId() + "')].displayName").value("task0534.emailonly@example.com"))
				.andExpect(jsonPath("$.content[?(@.id=='" + emailOnlyUser.getId() + "')].hasEmployeeLink").value(false))
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
						.with(platformUserAdminCaller())
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

		mockMvc.perform(get("/api/admin/users/{userId}", user.getId()).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(user.getId().toString()))
				.andExpect(jsonPath("$.email").value("task0534.detail@example.com"))
				.andExpect(jsonPath("$.displayName").value("Grace Hopper"))
				.andExpect(jsonPath("$.employee.id").value(employee.getId().toString()))
				.andExpect(jsonPath("$.employeeId").value(employee.getId().toString()))
				.andExpect(jsonPath("$.employeeDisplayName").value("Grace Hopper"))
				.andExpect(jsonPath("$.hasEmployeeLink").value(true))
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
		mockMvc.perform(get("/api/admin/users/{userId}", MISSING_ID).with(userAdminCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("User account not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void userAdministrationReturnsFormOptionsForCreateEdit() throws Exception {
		mockMvc.perform(get("/api/admin/users/form-options").with(userAdminCaller()))
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
						rawPassword)).with(userAdminCaller()))
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
						"TenantCreate1!")).with(userAdminCaller()))
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
						"TenantCreate1!")).with(userAdminCaller()))
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
						"TenantCreate1!")).with(userAdminCaller()))
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
						"weak")).with(userAdminCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Password does not satisfy the current password policy."));
	}

	@Test
	@WithMockUser
	void userAdministrationUpdatesEmailAndCompanyProfileOnly() throws Exception {
		UserAccount user = saveUser("task0537.update@example.com", TENANT_ADMIN_USER_TYPE_ID, null);
		CompanyProfile companyProfile = companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow();

		mockMvc.perform(putJson("/api/admin/users/" + user.getId(), userUpdateRequest(" TASK0537.Updated@Example.COM ", companyProfile.getId())).with(userAdminCaller()))
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

		mockMvc.perform(putJson("/api/admin/users/" + user.getId(), userUpdateRequest("task0537.clear-company@example.com", null)).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.companyProfile").doesNotExist());

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getCompanyProfile()).isNull();
	}

	@Test
	@WithMockUser
	void userAdministrationActivatesAndDeactivatesUserIdempotently() throws Exception {
		UserAccount user = saveUser("task0538.active@example.com", TENANT_ADMIN_USER_TYPE_ID, null);

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", user.getId()).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(user.getId().toString()))
				.andExpect(jsonPath("$.active").value(false))
				.andExpect(jsonPath("$.locked").value(false));

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", user.getId()).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(false));

		mockMvc.perform(put("/api/admin/users/{userId}/activate", user.getId()).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(true))
				.andExpect(jsonPath("$.locked").value(false));

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getActive()).isTrue();
		assertThat(reloadedUser.getLocked()).isFalse();
	}

	@Test
	@WithMockUser
	void userAdministrationLocksAndUnlocksUserIdempotently() throws Exception {
		UserAccount user = saveUser("task0538.lock@example.com", TENANT_ADMIN_USER_TYPE_ID, null);
		user.setFailedLoginAttempts(4);
		userAccountRepository.saveAndFlush(user);

		mockMvc.perform(put("/api/admin/users/{userId}/lock", user.getId()).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(user.getId().toString()))
				.andExpect(jsonPath("$.active").value(true))
				.andExpect(jsonPath("$.locked").value(true))
				.andExpect(jsonPath("$.failedLoginAttempts").value(4));

		mockMvc.perform(put("/api/admin/users/{userId}/lock", user.getId()).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.locked").value(true));

		mockMvc.perform(put("/api/admin/users/{userId}/unlock", user.getId()).with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.locked").value(false))
				.andExpect(jsonPath("$.failedLoginAttempts").value(4));

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getActive()).isTrue();
		assertThat(reloadedUser.getLocked()).isFalse();
		assertThat(reloadedUser.getFailedLoginAttempts()).isEqualTo(4);
	}

	@Test
	@WithMockUser
	void userAdministrationLifecycleReturnsNotFoundForMissingUser() throws Exception {
		mockMvc.perform(put("/api/admin/users/{userId}/activate", MISSING_ID).with(userAdminCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("User account not found: " + MISSING_ID));
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
						.with(userAdminCaller())
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
						.with(userAdminCaller())
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
						.with(userAdminCaller())
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

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(FOUNDATION_TENANT_ID, role.getId())).with(userAdminCaller()))
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

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(FOUNDATION_TENANT_ID, role.getId())).with(userAdminCaller()))
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

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(FOUNDATION_TENANT_ID, otherTenantRole.getId())).with(userAdminCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Role does not belong to tenant: " + otherTenantRole.getId()));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsCrossTenantRoleAssignmentForTenantCaller() throws Exception {
		UserAccount user = saveUser("task0535.noaccess@example.com", EMPLOYEE_USER_TYPE_ID, null);
		Tenant otherTenant = saveTenant("TASK0535_NO_ACCESS_TENANT");
		Role role = saveRole(otherTenant.getId(), "TASK0535_NO_ACCESS_ROLE", "Task 053.5 No Access Role", true);

		mockMvc.perform(postJson("/api/admin/users/" + user.getId() + "/roles", roleAssignmentRequest(otherTenant.getId(), role.getId())).with(userAdminCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant user administration is not allowed for caller"));
	}

	@Test
	@WithMockUser
	void userAdministrationRemovesTenantRoleFromUser() throws Exception {
		UserAccount user = saveUser("task0535.remove@example.com", EMPLOYEE_USER_TYPE_ID, null);
		saveUserTenantAccess(user, "TENANT_USER");
		Role role = saveRole("TASK0535_REMOVE_ROLE", "Task 053.5 Remove Role");
		saveUserRole(role, user);

		mockMvc.perform(delete("/api/admin/users/{userId}/roles/{roleId}", user.getId(), role.getId())
						.with(userAdminCaller())
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
		MvcResult result = mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(FOUNDATION_TENANT_ID, rawPassword)).with(userAdminCaller()))
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

		mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(otherTenant.getId(), "TenantAccess1!")).with(platformUserAdminCaller("PLATFORM.USER.UPDATE")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tenantId").value(otherTenant.getId().toString()));

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(passwordEncoder.matches("TenantAccess1!", reloadedUser.getPasswordHash())).isTrue();
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsPasswordResetWhenPasswordDoesNotSatisfyPolicy() throws Exception {
		UserAccount user = saveUser("task0536.weak@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(FOUNDATION_TENANT_ID, "weak")).with(userAdminCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Password does not satisfy the current password policy."));
	}

	@Test
	@WithMockUser
	void userAdministrationRejectsCrossTenantPasswordResetForTenantCaller() throws Exception {
		UserAccount user = saveUser("task0536.noaccess@example.com", EMPLOYEE_USER_TYPE_ID, null);
		Tenant otherTenant = saveTenant("TASK0536_NO_ACCESS_TENANT");

		mockMvc.perform(putJson("/api/admin/users/" + user.getId() + "/password", passwordResetRequest(otherTenant.getId(), "OtherTenant1!")).with(userAdminCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant user administration is not allowed for caller"));
	}

	@Test
	void userAdministrationRejectsCallerWithoutReadPermission() throws Exception {
		mockMvc.perform(get("/api/admin/users/form-options")
						.with(userAdminCaller("TENANT.USER.UPDATE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void userAdministrationRejectsCrossTenantListForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK055_USERS_LIST_OTHER_TENANT");

		mockMvc.perform(get("/api/admin/users")
						.with(userAdminCaller())
						.param("tenantId", otherTenant.getId().toString()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant user administration is not allowed for caller"));
	}

	@Test
	void userAdministrationRejectsDeleteWithoutDeletePermission() throws Exception {
		UserAccount user = saveUser("task055.delete.permission@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(delete("/api/admin/users/{userId}", user.getId())
						.with(userAdminCaller("TENANT.USER.READ", "TENANT.USER.UPDATE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void userAdministrationRejectsDeactivateWithoutUpdatePermission() throws Exception {
		UserAccount user = saveUser("task055.deactivate.permission@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", user.getId())
						.with(userAdminCaller("TENANT.USER.READ", "TENANT.USER.DELETE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void userAdministrationRejectsDeleteWithoutToken() throws Exception {
		UserAccount user = saveUser("task055.delete.without-token@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(delete("/api/admin/users/{userId}", user.getId()))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void userAdministrationRejectsDeactivateWithoutToken() throws Exception {
		UserAccount user = saveUser("task055.deactivate.without-token@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", user.getId()))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void userAdministrationDeleteReturnsNotFoundForMissingUser() throws Exception {
		mockMvc.perform(delete("/api/admin/users/{userId}", MISSING_ID)
						.with(userAdminCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("User account not found: " + MISSING_ID));
	}

	@Test
	void userAdministrationDeactivateReturnsNotFoundForMissingUser() throws Exception {
		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", MISSING_ID)
						.with(userAdminCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("User account not found: " + MISSING_ID));
	}

	@Test
	void userAdministrationRejectsDeleteAcrossTenantForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK055_USERS_DELETE_OTHER_TENANT");
		UserAccount user = saveUser(otherTenant, "task055.delete.other-tenant@example.com");

		mockMvc.perform(delete("/api/admin/users/{userId}", user.getId())
						.with(userAdminCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant user administration is not allowed for caller"));
	}

	@Test
	void userAdministrationRejectsDeactivateAcrossTenantForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK055_USERS_DEACTIVATE_OTHER_TENANT");
		UserAccount user = saveUser(otherTenant, "task055.deactivate.other-tenant@example.com");

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", user.getId())
						.with(userAdminCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant user administration is not allowed for caller"));
	}

	@Test
	void userAdministrationRejectsDeleteOfPlatformUserForTenantCaller() throws Exception {
		UserAccount user = saveUser("task055.delete.platform@example.com", PLATFORM_SUPER_ADMIN_USER_TYPE_ID, null);

		mockMvc.perform(delete("/api/admin/users/{userId}", user.getId())
						.with(userAdminCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Tenant administrators cannot manage platform users"));
	}

	@Test
	void userAdministrationRejectsDeactivateOfPlatformUserForTenantCaller() throws Exception {
		UserAccount user = saveUser("task055.deactivate.platform@example.com", PLATFORM_SUPER_ADMIN_USER_TYPE_ID, null);

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", user.getId())
						.with(userAdminCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Tenant administrators cannot manage platform users"));
	}

	@Test
	void userAdministrationRejectsSelfDelete() throws Exception {
		UserAccount callerAccount = saveUser("task055.self-delete@example.com", TENANT_ADMIN_USER_TYPE_ID, null);

		mockMvc.perform(delete("/api/admin/users/{userId}", callerAccount.getId())
						.with(userAdminCallerForUser(callerAccount.getId())))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Caller cannot delete its own user account"));
	}

	@Test
	void userAdministrationRejectsSelfDeactivate() throws Exception {
		UserAccount callerAccount = saveUser("task055.self-deactivate@example.com", TENANT_ADMIN_USER_TYPE_ID, null);

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", callerAccount.getId())
						.with(userAdminCallerForUser(callerAccount.getId())))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Caller cannot deactivate its own user account"));
	}

	@Test
	void userAdministrationDeletesUserPhysicallyWhenUnreferenced() throws Exception {
		UserAccount user = saveUser("task055.delete.success@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(delete("/api/admin/users/{userId}", user.getId())
						.with(userAdminCaller()))
				.andExpect(status().isNoContent());

		assertThat(userAccountRepository.findById(user.getId())).isEmpty();
	}

	@Test
	void userAdministrationReturnsConflictWhenDeletingReferencedUser() throws Exception {
		UserAccount user = saveUser("task055.delete.referenced@example.com", EMPLOYEE_USER_TYPE_ID, null);
		Role role = saveRole("TASK055_DELETE_REFERENCED_ROLE", "Task 055 Delete Referenced Role");
		saveUserRole(role, user);

		mockMvc.perform(delete("/api/admin/users/{userId}", user.getId())
						.with(userAdminCaller()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Utente non cancellabile perche gia referenziato."));

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getActive()).isTrue();
		assertThat(userRoleRepository.existsByUserAccount_Id(user.getId())).isTrue();
	}

	@Test
	void userAdministrationDeactivatesUserSuccessfully() throws Exception {
		UserAccount user = saveUser("task055.deactivate.success@example.com", EMPLOYEE_USER_TYPE_ID, null);

		mockMvc.perform(patch("/api/admin/users/{userId}/deactivate", user.getId())
						.with(userAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(user.getId().toString()))
				.andExpect(jsonPath("$.active").value(false));

		UserAccount reloadedUser = userAccountRepository.findById(user.getId()).orElseThrow();
		assertThat(reloadedUser.getActive()).isFalse();
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
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/activate']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/activate'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/deactivate']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/deactivate'].patch").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/lock']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/lock'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/unlock']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/unlock'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles/{roleId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/roles/{roleId}'].delete").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/available-roles']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/available-roles'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/password']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}/password'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/users/{userId}'].delete").exists());
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

	private RequestPostProcessor userAdminCaller(String... authorities) {
		return userAdminCallerForUser(TENANT_CALLER_USER_ID, authorities);
	}

	private RequestPostProcessor userAdminCallerForUser(UUID userId, String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {"TENANT.USER.READ", "TENANT.USER.CREATE", "TENANT.USER.UPDATE", "TENANT.USER.DELETE"}
				: authorities;
		java.util.List<GrantedAuthority> grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_TENANT_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("user.admin@example.com")
						.claim("userId", userId.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "TENANT_ADMIN"))
				.authorities(grantedAuthorities);
	}

	private RequestPostProcessor platformUserAdminCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {"PLATFORM.USER.READ", "PLATFORM.USER.CREATE", "PLATFORM.USER.UPDATE", "PLATFORM.USER.DELETE"}
				: authorities;
		java.util.List<GrantedAuthority> grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_PLATFORM_SUPER_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("platform.admin@example.com")
						.claim("userId", PLATFORM_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "PLATFORM_SUPER_ADMIN"))
				.authorities(grantedAuthorities);
	}
}
