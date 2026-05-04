package com.odsoftware.hrm;

import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
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
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class MasterDataGovernanceSecurityControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Test
	@WithMockUser
	void masterDataGovernanceSecurityCrudFlowSupportsAllResources() throws Exception {
		UUID userTypeId = null;
		UUID roleId = null;

		List<ResourceCase> resources = List.of(
				new ResourceCase("/api/master-data/governance-security/user-types", globalRequest("task032_user_type", " Task 032 User Type "), globalRequest("TASK032_USER_TYPE", "Task 032 User Type Updated")),
				new ResourceCase("/api/master-data/governance-security/authentication-methods", authenticationMethodRequest("task032_auth", " Task 032 Auth ", true), authenticationMethodRequest("TASK032_AUTH", "Task 032 Auth Updated", false)),
				new ResourceCase("/api/master-data/governance-security/audit-action-types", severityRequest("task032_audit", " Task 032 Audit ", "medium"), severityRequest("TASK032_AUDIT", "Task 032 Audit Updated", "high")),
				new ResourceCase("/api/master-data/governance-security/disciplinary-action-types", severityRequest("task032_disciplinary", " Task 032 Disciplinary ", "low"), severityRequest("TASK032_DISCIPLINARY", "Task 032 Disciplinary Updated", "medium")),
				new ResourceCase("/api/master-data/governance-security/smtp-encryption-types", globalRequest("task032_smtp", " Task 032 SMTP "), globalRequest("TASK032_SMTP", "Task 032 SMTP Updated")),
				new ResourceCase("/api/master-data/governance-security/roles", roleRequest("task032_role", " Task 032 Role ", true), roleRequest("TASK032_ROLE", "Task 032 Role Updated", false)),
				new ResourceCase("/api/master-data/governance-security/permissions", permissionRequest("task032_permission", " Task 032 Permission ", true), permissionRequest("TASK032_PERMISSION", "Task 032 Permission Updated", false)),
				new ResourceCase("/api/master-data/governance-security/company-profile-types", tenantRequest("task032_company_profile", " Task 032 Company Profile "), tenantRequest("TASK032_COMPANY_PROFILE", "Task 032 Company Profile Updated")),
				new ResourceCase("/api/master-data/governance-security/office-location-types", tenantRequest("task032_office_location", " Task 032 Office Location "), tenantRequest("TASK032_OFFICE_LOCATION", "Task 032 Office Location Updated")));

		for (ResourceCase resource : resources) {
			String expectedCode = ((String) resource.createRequest().get("code")).trim().toUpperCase();
			MvcResult result = mockMvc.perform(postJson(resource.path(), resource.createRequest()))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.code").value(expectedCode))
					.andExpect(jsonPath("$.active").value(true))
					.andReturn();

			UUID id = responseId(result);
			if (resource.path().endsWith("/user-types")) {
				userTypeId = id;
			}
			if (resource.path().endsWith("/roles")) {
				roleId = id;
			}

			mockMvc.perform(get(resource.path()))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$").isArray());
			mockMvc.perform(get(resource.path() + "/{id}", id))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(expectedCode));
			mockMvc.perform(putJson(resource.path() + "/" + id, resource.updateRequest()))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.name").value(resource.updateRequest().get("name")));
			mockMvc.perform(delete(resource.path() + "/{id}", id).with(csrf()))
					.andExpect(status().isNoContent());
		}

		assertThat(userTypeRepository.findById(userTypeId).orElseThrow().getActive()).isFalse();
		assertThat(roleRepository.findById(roleId).orElseThrow().getActive()).isFalse();
	}

	@Test
	@WithMockUser
	void masterDataGovernanceSecurityApiReturnsValidationErrorForInvalidPayload() throws Exception {
		mockMvc.perform(postJson("/api/master-data/governance-security/audit-action-types", Map.of("code", "", "name", "")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.validationErrors.code").exists())
				.andExpect(jsonPath("$.validationErrors.name").exists())
				.andExpect(jsonPath("$.validationErrors.severityLevel").exists());
	}

	@Test
	@WithMockUser
	void masterDataGovernanceSecurityApiReturnsNotFoundForMissingRecord() throws Exception {
		mockMvc.perform(get("/api/master-data/governance-security/user-types/{id}", MISSING_ID))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("User type not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void masterDataGovernanceSecurityApiReturnsConflictForGlobalCodeDuplicates() throws Exception {
		createMaster("/api/master-data/governance-security/user-types", globalRequest("TASK032_DUPLICATE_USER_TYPE", "Task 032 Duplicate"));

		mockMvc.perform(postJson("/api/master-data/governance-security/user-types", globalRequest(" task032_duplicate_user_type ", "Task 032 Duplicate 2")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("User type code already exists: TASK032_DUPLICATE_USER_TYPE"));
	}

	@Test
	@WithMockUser
	void masterDataGovernanceSecurityApiReturnsConflictForTenantCodeDuplicates() throws Exception {
		createMaster("/api/master-data/governance-security/roles", roleRequest("TASK032_DUPLICATE_ROLE", "Task 032 Duplicate Role", false));

		mockMvc.perform(postJson("/api/master-data/governance-security/roles", roleRequest(" task032_duplicate_role ", "Task 032 Duplicate Role 2", false)))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Role code already exists for tenant: TASK032_DUPLICATE_ROLE"));
	}

	@Test
	@WithMockUser
	void masterDataGovernanceSecurityApiReturnsNotFoundForMissingTenant() throws Exception {
		UUID missingTenantId = UUID.fromString("00000000-0000-0000-0000-000000000098");

		mockMvc.perform(postJson("/api/master-data/governance-security/roles", roleRequest(missingTenantId, "TASK032_MISSING_TENANT", "Task 032 Missing Tenant", false)))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Tenant not found: " + missingTenantId));
	}

	@Test
	void openApiIncludesMasterDataGovernanceSecurityCrudEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/user-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/user-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/authentication-methods']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/authentication-methods/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/audit-action-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/audit-action-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/disciplinary-action-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/disciplinary-action-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/smtp-encryption-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/smtp-encryption-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/roles']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/roles/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/permissions']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/permissions/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/company-profile-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/company-profile-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/office-location-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/office-location-types/{id}']").exists());
	}

	private UUID createMaster(String path, Map<String, Object> request) throws Exception {
		MvcResult result = mockMvc.perform(postJson(path, request))
				.andExpect(status().isCreated())
				.andReturn();
		return responseId(result);
	}

	private Map<String, Object> globalRequest(String code, String name) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("code", code);
		request.put("name", name);
		return request;
	}

	private Map<String, Object> authenticationMethodRequest(String code, String name, Boolean strongAuthRequired) {
		Map<String, Object> request = globalRequest(code, name);
		request.put("strongAuthRequired", strongAuthRequired);
		return request;
	}

	private Map<String, Object> severityRequest(String code, String name, String severityLevel) {
		Map<String, Object> request = globalRequest(code, name);
		request.put("severityLevel", severityLevel);
		return request;
	}

	private Map<String, Object> tenantRequest(String code, String name) {
		Map<String, Object> request = globalRequest(code, name);
		request.put("tenantId", FOUNDATION_TENANT_ID);
		return request;
	}

	private Map<String, Object> roleRequest(String code, String name, Boolean systemRole) {
		return roleRequest(FOUNDATION_TENANT_ID, code, name, systemRole);
	}

	private Map<String, Object> roleRequest(UUID tenantId, String code, String name, Boolean systemRole) {
		Map<String, Object> request = tenantRequest(code, name);
		request.put("tenantId", tenantId);
		request.put("systemRole", systemRole);
		return request;
	}

	private Map<String, Object> permissionRequest(String code, String name, Boolean systemPermission) {
		Map<String, Object> request = tenantRequest(code, name);
		request.put("systemPermission", systemPermission);
		return request;
	}

	private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder postJson(String path, Object request) throws Exception {
		return post(path)
				.with(csrf())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request));
	}

	private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder putJson(String path, Object request) throws Exception {
		return put(path)
				.with(csrf())
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request));
	}

	private UUID responseId(MvcResult result) throws Exception {
		return UUID.fromString(objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText());
	}

	private record ResourceCase(String path, Map<String, Object> createRequest, Map<String, Object> updateRequest) {
	}
}
