package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.master.UserType;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
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
class RoleAdministrationControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");
	private static final UUID TENANT_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000003");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PermissionRepository permissionRepository;

	@Autowired
	private RolePermissionRepository rolePermissionRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private AuthenticationMethodRepository authenticationMethodRepository;

	@Test
	@WithMockUser
	void roleAdministrationListsRolesWithTenantFilterAndSearch() throws Exception {
		Role role = saveRole("TASK0531_LIST_ROLE", "Task 053.1 List Role", "Task 053.1 List Description");
		Tenant otherTenant = saveTenant("TASK0531_LIST_OTHER_TENANT");
		saveRole(otherTenant.getId(), "TASK0531_LIST_OTHER_ROLE", "Task 053.1 Other Role", null, false, true);

		mockMvc.perform(get("/api/admin/roles")
						.param("tenantId", FOUNDATION_TENANT_ID.toString())
						.param("search", "TASK0531_LIST_ROLE"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(role.getId().toString()))
				.andExpect(jsonPath("$.content[0].tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.content[0].code").value("TASK0531_LIST_ROLE"))
				.andExpect(jsonPath("$.content[0].description").value("Task 053.1 List Description"))
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(25));
	}

	@Test
	@WithMockUser
	void roleAdministrationReturnsRoleDetailWithTenantReference() throws Exception {
		Role role = saveRole("TASK0531_DETAIL_ROLE", "Task 053.1 Detail Role", "Task 053.1 Detail Description");

		mockMvc.perform(get("/api/admin/roles/{roleId}", role.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(role.getId().toString()))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.tenant.code").value("FOUNDATION_TENANT"))
				.andExpect(jsonPath("$.code").value("TASK0531_DETAIL_ROLE"))
				.andExpect(jsonPath("$.description").value("Task 053.1 Detail Description"))
				.andExpect(jsonPath("$.systemRole").value(false))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void roleAdministrationReadsPermissionsAssignedToRole() throws Exception {
		Role role = saveRole("TASK0531_READ_PERMISSIONS_ROLE", "Task 053.1 Read Permissions Role", null);
		Permission permission = savePermission("TASK0531_READ_PERMISSION", "Task 053.1 Read Permission");
		saveRolePermission(role, permission);

		mockMvc.perform(get("/api/admin/roles/{roleId}/permissions", role.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].id").value(permission.getId().toString()))
				.andExpect(jsonPath("$[0].tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$[0].code").value("TASK0531_READ_PERMISSION"));
	}

	@Test
	@WithMockUser
	void roleAdministrationUpdatesRolePermissionAssignmentsWithReplaceSemantics() throws Exception {
		Role role = saveRole("TASK0531_UPDATE_ROLE", "Task 053.1 Update Role", null);
		Permission oldPermission = savePermission("TASK0531_UPDATE_OLD_PERMISSION", "Task 053.1 Update Old Permission");
		Permission newPermissionA = savePermission("TASK0531_UPDATE_NEW_PERMISSION_A", "Task 053.1 Update New Permission A");
		Permission newPermissionB = savePermission("TASK0531_UPDATE_NEW_PERMISSION_B", "Task 053.1 Update New Permission B");
		saveRolePermission(role, oldPermission);

		mockMvc.perform(putJson("/api/admin/roles/" + role.getId() + "/permissions", permissionUpdateRequest(newPermissionB.getId(), newPermissionA.getId())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.roleId").value(role.getId().toString()))
				.andExpect(jsonPath("$.tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.permissions.length()").value(2))
				.andExpect(jsonPath("$.permissions[0].code").value("TASK0531_UPDATE_NEW_PERMISSION_A"))
				.andExpect(jsonPath("$.permissions[1].code").value("TASK0531_UPDATE_NEW_PERMISSION_B"));

		List<RolePermission> assignments = rolePermissionRepository.findByTenant_IdAndRole_IdOrderByPermission_CodeAsc(FOUNDATION_TENANT_ID, role.getId());
		assertThat(assignments).extracting(assignment -> assignment.getPermission().getId())
				.containsExactly(newPermissionA.getId(), newPermissionB.getId());
	}

	@Test
	@WithMockUser
	void roleAdministrationUpdateDeduplicatesPermissionIds() throws Exception {
		Role role = saveRole("TASK0531_DEDUP_ROLE", "Task 053.1 Dedup Role", null);
		Permission permission = savePermission("TASK0531_DEDUP_PERMISSION", "Task 053.1 Dedup Permission");

		mockMvc.perform(putJson("/api/admin/roles/" + role.getId() + "/permissions", permissionUpdateRequest(permission.getId(), permission.getId())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.permissions.length()").value(1))
				.andExpect(jsonPath("$.permissions[0].id").value(permission.getId().toString()));

		assertThat(rolePermissionRepository.findByTenant_IdAndRole_Id(FOUNDATION_TENANT_ID, role.getId())).hasSize(1);
	}

	@Test
	@WithMockUser
	void roleAdministrationReturnsNotFoundForMissingRole() throws Exception {
		mockMvc.perform(get("/api/admin/roles/{roleId}", MISSING_ID))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Role not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void roleAdministrationReturnsNotFoundForMissingPermissionOnUpdate() throws Exception {
		Role role = saveRole("TASK0531_MISSING_PERMISSION_ROLE", "Task 053.1 Missing Permission Role", null);

		mockMvc.perform(putJson("/api/admin/roles/" + role.getId() + "/permissions", permissionUpdateRequest(MISSING_ID)))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Permission not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void roleAdministrationRejectsPermissionFromDifferentTenant() throws Exception {
		Role role = saveRole("TASK0531_TENANT_VALIDATION_ROLE", "Task 053.1 Tenant Validation Role", null);
		Tenant otherTenant = saveTenant("TASK0531_PERMISSION_OTHER_TENANT");
		Permission otherTenantPermission = savePermission(otherTenant.getId(), "TASK0531_OTHER_TENANT_PERMISSION", "Task 053.1 Other Tenant Permission");

		mockMvc.perform(putJson("/api/admin/roles/" + role.getId() + "/permissions", permissionUpdateRequest(otherTenantPermission.getId())))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Permission does not belong to role tenant: " + otherTenantPermission.getId()));
	}

	@Test
	@WithMockUser
	void roleAdministrationValidationRejectsNullPermissionIds() throws Exception {
		Role role = saveRole("TASK0531_VALIDATION_ROLE", "Task 053.1 Validation Role", null);

		mockMvc.perform(put("/api/admin/roles/{roleId}/permissions", role.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.validationErrors.permissionIds").exists());
	}

	@Test
	@WithMockUser
	void roleAdministrationCreatesCustomRole() throws Exception {
		mockMvc.perform(postJson("/api/admin/roles", createRoleRequest(FOUNDATION_TENANT_ID, " task0533_create_role ", " Task 053.3 Create Role ", " Task 053.3 Description ", false)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.code").value("TASK0533_CREATE_ROLE"))
				.andExpect(jsonPath("$.name").value("Task 053.3 Create Role"))
				.andExpect(jsonPath("$.description").value("Task 053.3 Description"))
				.andExpect(jsonPath("$.systemRole").value(false))
				.andExpect(jsonPath("$.active").value(false));
	}

	@Test
	@WithMockUser
	void roleAdministrationRejectsDuplicateRoleCodeOnCreate() throws Exception {
		saveRole("TASK0533_DUPLICATE_ROLE", "Task 053.3 Duplicate Role", null);

		mockMvc.perform(postJson("/api/admin/roles", createRoleRequest(FOUNDATION_TENANT_ID, " task0533_duplicate_role ", "Task 053.3 Duplicate Role 2", null, true)))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Role code already exists for tenant: TASK0533_DUPLICATE_ROLE"));
	}

	@Test
	@WithMockUser
	void roleAdministrationReturnsNotFoundForMissingTenantOnCreate() throws Exception {
		UUID missingTenantId = UUID.fromString("00000000-0000-0000-0000-000000000098");

		mockMvc.perform(postJson("/api/admin/roles", createRoleRequest(missingTenantId, "TASK0533_MISSING_TENANT", "Task 053.3 Missing Tenant", null, true)))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Tenant not found: " + missingTenantId));
	}

	@Test
	@WithMockUser
	void roleAdministrationUpdatesCustomRoleNameAndDescription() throws Exception {
		Role role = saveRole("TASK0533_UPDATE_ROLE", "Task 053.3 Update Role", "Old description");

		mockMvc.perform(putJson("/api/admin/roles/" + role.getId(), updateRoleRequest(" Task 053.3 Updated Role ", " Updated description ")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("TASK0533_UPDATE_ROLE"))
				.andExpect(jsonPath("$.name").value("Task 053.3 Updated Role"))
				.andExpect(jsonPath("$.description").value("Updated description"));
	}

	@Test
	@WithMockUser
	void roleAdministrationActivatesAndDeactivatesCustomRole() throws Exception {
		Role role = saveRole(FOUNDATION_TENANT_ID, "TASK0533_TOGGLE_ROLE", "Task 053.3 Toggle Role", null, false, false);

		mockMvc.perform(put("/api/admin/roles/{roleId}/activate", role.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(true));

		mockMvc.perform(put("/api/admin/roles/{roleId}/deactivate", role.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(false));
	}

	@Test
	@WithMockUser
	void roleAdministrationDeletesCustomRoleAndAssignedPermissions() throws Exception {
		Role role = saveRole("TASK0533_DELETE_ROLE", "Task 053.3 Delete Role", null);
		Permission permission = savePermission("TASK0533_DELETE_PERMISSION", "Task 053.3 Delete Permission");
		saveRolePermission(role, permission);

		mockMvc.perform(delete("/api/admin/roles/{roleId}", role.getId()))
				.andExpect(status().isNoContent());

		assertThat(roleRepository.findById(role.getId())).isEmpty();
		assertThat(rolePermissionRepository.findByTenant_IdAndRole_Id(FOUNDATION_TENANT_ID, role.getId())).isEmpty();
	}

	@Test
	@WithMockUser
	void roleAdministrationRejectsDeleteWhenRoleIsAssignedToUser() throws Exception {
		Role role = saveRole("TASK0533_ASSIGNED_ROLE", "Task 053.3 Assigned Role", null);
		saveUserRole(role, saveUser("task0533.assigned@example.com"));

		mockMvc.perform(delete("/api/admin/roles/{roleId}", role.getId()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Role cannot be deleted because it is assigned to one or more users"));
	}

	@Test
	@WithMockUser
	void roleAdministrationProtectsSystemRolesAcrossLifecycleEndpoints() throws Exception {
		Role role = saveRole(FOUNDATION_TENANT_ID, "TASK0533_SYSTEM_ROLE", "Task 053.3 System Role", null, true, true);
		Permission permission = savePermission("TASK0533_SYSTEM_PERMISSION", "Task 053.3 System Permission");

		mockMvc.perform(putJson("/api/admin/roles/" + role.getId(), updateRoleRequest("System role updated", "Description")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("System roles cannot be modified through tenant role administration"));
		mockMvc.perform(put("/api/admin/roles/{roleId}/activate", role.getId()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("System roles cannot be modified through tenant role administration"));
		mockMvc.perform(put("/api/admin/roles/{roleId}/deactivate", role.getId()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("System roles cannot be modified through tenant role administration"));
		mockMvc.perform(delete("/api/admin/roles/{roleId}", role.getId()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("System roles cannot be modified through tenant role administration"));
		mockMvc.perform(putJson("/api/admin/roles/" + role.getId() + "/permissions", permissionUpdateRequest(permission.getId())))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("System roles cannot be modified through tenant role administration"));
	}

	@Test
	void openApiIncludesRoleAdministrationEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/roles']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles/{roleId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles/{roleId}'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles/{roleId}'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles/{roleId}/activate']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles/{roleId}/deactivate']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles/{roleId}/permissions']").exists());
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

	private Role saveRole(String code, String name, String description) {
		return saveRole(FOUNDATION_TENANT_ID, code, name, description, false, true);
	}

	private Role saveRole(UUID tenantId, String code, String name, String description, boolean systemRole, boolean active) {
		Role role = new Role();
		role.setTenantId(tenantId);
		role.setCode(code);
		role.setName(name);
		role.setDescription(description);
		role.setSystemRole(systemRole);
		role.setActive(active);
		return roleRepository.saveAndFlush(role);
	}

	private Permission savePermission(String code, String name) {
		return savePermission(FOUNDATION_TENANT_ID, code, name);
	}

	private Permission savePermission(UUID tenantId, String code, String name) {
		Permission permission = new Permission();
		permission.setTenantId(tenantId);
		permission.setCode(code);
		permission.setName(name);
		permission.setSystemPermission(false);
		permission.setActive(true);
		return permissionRepository.saveAndFlush(permission);
	}

	private RolePermission saveRolePermission(Role role, Permission permission) {
		RolePermission rolePermission = new RolePermission();
		rolePermission.setTenant(tenantRepository.findById(role.getTenantId()).orElseThrow());
		rolePermission.setRole(role);
		rolePermission.setPermission(permission);
		return rolePermissionRepository.saveAndFlush(rolePermission);
	}

	private UserRole saveUserRole(Role role, UserAccount userAccount) {
		UserRole userRole = new UserRole();
		userRole.setTenant(tenantRepository.findById(role.getTenantId()).orElseThrow());
		userRole.setUserAccount(userAccount);
		userRole.setRole(role);
		return userRoleRepository.saveAndFlush(userRole);
	}

	private UserAccount saveUser(String email) {
		UserType userType = userTypeRepository.findById(TENANT_ADMIN_USER_TYPE_ID).orElseThrow();
		AuthenticationMethod authenticationMethod = authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID).orElseThrow();

		UserAccount userAccount = new UserAccount();
		userAccount.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		userAccount.setUserType(userType);
		userAccount.setAuthenticationMethod(authenticationMethod);
		userAccount.setEmail(email);
		userAccount.setActive(true);
		userAccount.setLocked(false);
		return userAccountRepository.saveAndFlush(userAccount);
	}

	private Map<String, Object> permissionUpdateRequest(UUID... permissionIds) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("permissionIds", List.of(permissionIds));
		return request;
	}

	private Map<String, Object> createRoleRequest(UUID tenantId, String code, String name, String description, Boolean active) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", tenantId);
		request.put("code", code);
		request.put("name", name);
		request.put("description", description);
		request.put("active", active);
		return request;
	}

	private Map<String, Object> updateRoleRequest(String name, String description) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", name);
		request.put("description", description);
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
