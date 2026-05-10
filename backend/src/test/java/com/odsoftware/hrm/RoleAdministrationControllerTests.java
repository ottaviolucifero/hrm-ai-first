package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class RoleAdministrationControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");

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

	@Test
	@WithMockUser
	void roleAdministrationListsRolesWithTenantFilterAndSearch() throws Exception {
		Role role = saveRole("TASK0531_LIST_ROLE", "Task 053.1 List Role");
		Tenant otherTenant = saveTenant("TASK0531_LIST_OTHER_TENANT");
		saveRole(otherTenant.getId(), "TASK0531_LIST_OTHER_ROLE", "Task 053.1 Other Role");

		mockMvc.perform(get("/api/admin/roles")
						.param("tenantId", FOUNDATION_TENANT_ID.toString())
						.param("search", "TASK0531_LIST_ROLE"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(role.getId().toString()))
				.andExpect(jsonPath("$.content[0].tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.content[0].code").value("TASK0531_LIST_ROLE"))
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(25));
	}

	@Test
	@WithMockUser
	void roleAdministrationReturnsRoleDetailWithTenantReference() throws Exception {
		Role role = saveRole("TASK0531_DETAIL_ROLE", "Task 053.1 Detail Role");

		mockMvc.perform(get("/api/admin/roles/{roleId}", role.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(role.getId().toString()))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.tenant.code").value("FOUNDATION_TENANT"))
				.andExpect(jsonPath("$.code").value("TASK0531_DETAIL_ROLE"))
				.andExpect(jsonPath("$.systemRole").value(false))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void roleAdministrationReadsPermissionsAssignedToRole() throws Exception {
		Role role = saveRole("TASK0531_READ_PERMISSIONS_ROLE", "Task 053.1 Read Permissions Role");
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
		Role role = saveRole("TASK0531_UPDATE_ROLE", "Task 053.1 Update Role");
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
		Role role = saveRole("TASK0531_DEDUP_ROLE", "Task 053.1 Dedup Role");
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
		Role role = saveRole("TASK0531_MISSING_PERMISSION_ROLE", "Task 053.1 Missing Permission Role");

		mockMvc.perform(putJson("/api/admin/roles/" + role.getId() + "/permissions", permissionUpdateRequest(MISSING_ID)))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Permission not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void roleAdministrationRejectsPermissionFromDifferentTenant() throws Exception {
		Role role = saveRole("TASK0531_TENANT_VALIDATION_ROLE", "Task 053.1 Tenant Validation Role");
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
		Role role = saveRole("TASK0531_VALIDATION_ROLE", "Task 053.1 Validation Role");

		mockMvc.perform(put("/api/admin/roles/{roleId}/permissions", role.getId())
						.contentType(MediaType.APPLICATION_JSON)
						.content("{}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.validationErrors.permissionIds").exists());
	}

	@Test
	void openApiIncludesRoleAdministrationEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/roles']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/roles/{roleId}']").exists())
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

	private Role saveRole(String code, String name) {
		return saveRole(FOUNDATION_TENANT_ID, code, name);
	}

	private Role saveRole(UUID tenantId, String code, String name) {
		Role role = new Role();
		role.setTenantId(tenantId);
		role.setCode(code);
		role.setName(name);
		role.setSystemRole(false);
		role.setActive(true);
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

	private Map<String, Object> permissionUpdateRequest(UUID... permissionIds) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("permissionIds", List.of(permissionIds));
		return request;
	}

	private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder putJson(String path, Object request) throws Exception {
		return put(path)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request));
	}
}
