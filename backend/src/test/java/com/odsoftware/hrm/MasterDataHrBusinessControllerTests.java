package com.odsoftware.hrm;

import com.odsoftware.hrm.repository.master.DepartmentRepository;
import java.util.LinkedHashMap;
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
class MasterDataHrBusinessControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");

	private static final String[] RESOURCE_PATHS = {
			"/api/master-data/hr-business/departments",
			"/api/master-data/hr-business/job-titles",
			"/api/master-data/hr-business/contract-types",
			"/api/master-data/hr-business/employment-statuses",
			"/api/master-data/hr-business/work-modes",
			"/api/master-data/hr-business/leave-request-types",
			"/api/master-data/hr-business/document-types",
			"/api/master-data/hr-business/device-types",
			"/api/master-data/hr-business/device-brands",
			"/api/master-data/hr-business/device-statuses"
	};

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private DepartmentRepository departmentRepository;

	@Test
	@WithMockUser
	void masterDataHrBusinessCrudFlowSupportsAllResources() throws Exception {
		UUID departmentId = null;

		for (int index = 0; index < RESOURCE_PATHS.length; index++) {
			String path = RESOURCE_PATHS[index];
			String code = "task031_resource_" + index;
			String expectedCode = "TASK031_RESOURCE_" + index;
			MvcResult result = mockMvc.perform(postJson(path, tenantMasterRequest(code, " Task 031 Resource " + index + " ")))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.tenantId").value(FOUNDATION_TENANT_ID.toString()))
					.andExpect(jsonPath("$.code").value(expectedCode))
					.andExpect(jsonPath("$.name").value("Task 031 Resource " + index))
					.andExpect(jsonPath("$.active").value(true))
					.andReturn();

			UUID id = responseId(result);
			if (index == 0) {
				departmentId = id;
			}

			mockMvc.perform(get(path))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.content").isArray());
			mockMvc.perform(get(path + "/{id}", id))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(expectedCode));
			mockMvc.perform(putJson(path + "/" + id, tenantMasterRequest(expectedCode, "Task 031 Resource Updated " + index)))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.name").value("Task 031 Resource Updated " + index));
			mockMvc.perform(delete(path + "/{id}", id).with(csrf()))
					.andExpect(status().isNoContent());
		}

		assertThat(departmentRepository.findById(departmentId).orElseThrow().getActive()).isFalse();
	}

	@Test
	@WithMockUser
	void masterDataHrBusinessListEndpointsSupportPaginationAndSearch() throws Exception {
		createTenantMaster("/api/master-data/hr-business/departments", "TASK043_PAGE_A", "Task 043 Page A");
		createTenantMaster("/api/master-data/hr-business/departments", "TASK043_PAGE_B", "Task 043 Page B");
		createTenantMaster("/api/master-data/hr-business/departments", "TASK043_PAGE_C", "Task 043 Page C");

		mockMvc.perform(get("/api/master-data/hr-business/departments"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray())
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(25))
				.andExpect(jsonPath("$.first").value(true));

		mockMvc.perform(get("/api/master-data/hr-business/departments?page=0&size=2"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(2))
				.andExpect(jsonPath("$.content.length()").value(2))
				.andExpect(jsonPath("$.first").value(true));

		mockMvc.perform(get("/api/master-data/hr-business/departments?search=TASK043_PAGE_B"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].code").value("TASK043_PAGE_B"));
	}

	@Test
	@WithMockUser
	void masterDataHrBusinessListsNewestRecordsFirstByDefault() throws Exception {
		createTenantMaster("/api/master-data/hr-business/departments", "TASK0465_SORT_A", "Task 0465 Sort A");
		createTenantMaster("/api/master-data/hr-business/departments", "TASK0465_SORT_B", "Task 0465 Sort B");

		mockMvc.perform(get("/api/master-data/hr-business/departments?search=TASK0465_SORT"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content[0].code").value("TASK0465_SORT_B"))
				.andExpect(jsonPath("$.content[1].code").value("TASK0465_SORT_A"));
	}

	@Test
	@WithMockUser
	void masterDataHrBusinessApiReturnsValidationErrorForInvalidPayload() throws Exception {
		mockMvc.perform(postJson("/api/master-data/hr-business/departments", Map.of("code", "", "name", "")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.validationErrors.tenantId").exists())
				.andExpect(jsonPath("$.validationErrors.code").exists())
				.andExpect(jsonPath("$.validationErrors.name").exists());
	}

	@Test
	@WithMockUser
	void masterDataHrBusinessApiReturnsNotFoundForMissingRecord() throws Exception {
		mockMvc.perform(get("/api/master-data/hr-business/departments/{id}", MISSING_ID))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Department not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void masterDataHrBusinessApiReturnsConflictForTenantCodeDuplicates() throws Exception {
		createTenantMaster("/api/master-data/hr-business/departments", "TASK031_DUPLICATE", "Task 031 Duplicate");

		mockMvc.perform(postJson("/api/master-data/hr-business/departments", tenantMasterRequest(" task031_duplicate ", "Task 031 Duplicate 2")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Department code already exists for tenant: TASK031_DUPLICATE"));
	}

	@Test
	@WithMockUser
	void masterDataHrBusinessApiReturnsNotFoundForMissingTenant() throws Exception {
		UUID missingTenantId = UUID.fromString("00000000-0000-0000-0000-000000000098");

		mockMvc.perform(postJson("/api/master-data/hr-business/departments", tenantMasterRequest(missingTenantId, "TASK031_MISSING_TENANT", "Task 031 Missing Tenant")))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Tenant not found: " + missingTenantId));
	}

	@Test
	void openApiIncludesMasterDataHrBusinessCrudEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/departments']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/departments/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/job-titles']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/job-titles/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/contract-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/contract-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/employment-statuses']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/employment-statuses/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/leave-request-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/leave-request-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/document-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/document-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-brands']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-brands/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-statuses']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-statuses/{id}']").exists());
	}

	private UUID createTenantMaster(String path, String code, String name) throws Exception {
		MvcResult result = mockMvc.perform(postJson(path, tenantMasterRequest(code, name)))
				.andExpect(status().isCreated())
				.andReturn();
		return responseId(result);
	}

	private Map<String, Object> tenantMasterRequest(String code, String name) {
		return tenantMasterRequest(FOUNDATION_TENANT_ID, code, name);
	}

	private Map<String, Object> tenantMasterRequest(UUID tenantId, String code, String name) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", tenantId);
		request.put("code", code);
		request.put("name", name);
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
}
