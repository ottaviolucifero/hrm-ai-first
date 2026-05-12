package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.disciplinary.EmployeeDisciplinaryAction;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.disciplinary.EmployeeDisciplinaryActionRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.DisciplinaryActionTypeRepository;
import com.odsoftware.hrm.repository.master.OfficeLocationTypeRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import java.time.LocalDate;
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
	private static final UUID FOUNDATION_COMPANY_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_PROFILE_TYPE_ID = UUID.fromString("77000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_HEADQUARTER_OFFICE_LOCATION_TYPE_ID = UUID.fromString("78000000-0000-0000-0000-000000000001");
	private static final UUID WARNING_DISCIPLINARY_ACTION_TYPE_ID = UUID.fromString("73000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private CompanyProfileTypeRepository companyProfileTypeRepository;

	@Autowired
	private OfficeLocationTypeRepository officeLocationTypeRepository;

	@Autowired
	private DisciplinaryActionTypeRepository disciplinaryActionTypeRepository;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private CompanyProfileRepository companyProfileRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private EmployeeDisciplinaryActionRepository employeeDisciplinaryActionRepository;

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityCrudFlowSupportsAllResources() throws Exception {
		UUID userTypeId = null;

		List<ResourceCase> resources = List.of(
				new ResourceCase("/api/master-data/governance-security/user-types", globalRequest("task032_user_type", " Task 032 User Type "), globalRequest("TASK032_USER_TYPE", "Task 032 User Type Updated")),
				new ResourceCase("/api/master-data/governance-security/authentication-methods", authenticationMethodRequest("task032_auth", " Task 032 Auth ", true), authenticationMethodRequest("TASK032_AUTH", "Task 032 Auth Updated", false)),
				new ResourceCase("/api/master-data/governance-security/audit-action-types", severityRequest("task032_audit", " Task 032 Audit ", "medium"), severityRequest("TASK032_AUDIT", "Task 032 Audit Updated", "high")),
				new ResourceCase("/api/master-data/governance-security/disciplinary-action-types", severityAutoCodeRequest(" Task 032 Disciplinary ", "low"), severityAutoCodeRequest("Task 032 Disciplinary Updated", "medium")),
				new ResourceCase("/api/master-data/governance-security/smtp-encryption-types", globalRequest("task032_smtp", " Task 032 SMTP "), globalRequest("TASK032_SMTP", "Task 032 SMTP Updated")),
				new ResourceCase("/api/master-data/governance-security/permissions", permissionRequest("task032_permission", " Task 032 Permission ", true), permissionRequest("TASK032_PERMISSION", "Task 032 Permission Updated", false)),
				new ResourceCase("/api/master-data/governance-security/company-profile-types", tenantAutoCodeRequest(" Task 032 Company Profile "), tenantAutoCodeRequest("Task 032 Company Profile Updated")),
				new ResourceCase("/api/master-data/governance-security/office-location-types", tenantAutoCodeRequest(" Task 032 Office Location "), tenantAutoCodeRequest("Task 032 Office Location Updated")));

		for (ResourceCase resource : resources) {
			String expectedCode = expectedCreateCode(resource.path(), resource.createRequest());
			MvcResult result = mockMvc.perform(postJson(resource.path(), resource.createRequest()))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.active").value(true))
					.andReturn();
			assertCodeMatches(responseCode(result), expectedCode);

			UUID id = responseId(result);
			if (resource.path().endsWith("/user-types")) {
				userTypeId = id;
			}

			mockMvc.perform(get(resource.path()))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.content").isArray());
			mockMvc.perform(get(resource.path() + "/{id}", id))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(responseCode(result)));
			mockMvc.perform(putJson(resource.path() + "/" + id, resource.updateRequest()))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(responseCode(result)))
					.andExpect(jsonPath("$.name").value(resource.updateRequest().get("name")));
			mockMvc.perform(delete(resource.path() + "/{id}", id).with(csrf()))
					.andExpect(status().isNoContent());
		}

		assertThat(userTypeRepository.findById(userTypeId).orElseThrow().getActive()).isFalse();
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityListEndpointsSupportPaginationAndSearch() throws Exception {
		saveRole("TASK043_ROLE_A", "Task 043 Role A");
		saveRole("TASK043_ROLE_B", "Task 043 Role B");
		saveRole("TASK043_ROLE_C", "Task 043 Role C");

		mockMvc.perform(get("/api/master-data/governance-security/roles"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray())
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(25))
				.andExpect(jsonPath("$.first").value(true));

		mockMvc.perform(get("/api/master-data/governance-security/roles?page=0&size=2"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(2))
				.andExpect(jsonPath("$.content.length()").value(2))
				.andExpect(jsonPath("$.first").value(true));

		mockMvc.perform(get("/api/master-data/governance-security/roles?search=TASK043_ROLE_B"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].code").value("TASK043_ROLE_B"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityListsNewestRecordsFirstByDefault() throws Exception {
		saveRole("TASK0465_ROLE_A", "Task 0465 Role A");
		Thread.sleep(20L);
		saveRole("TASK0465_ROLE_B", "Task 0465 Role B");

		mockMvc.perform(get("/api/master-data/governance-security/roles?search=TASK0465_ROLE"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content[0].code").value("TASK0465_ROLE_B"))
				.andExpect(jsonPath("$.content[1].code").value("TASK0465_ROLE_A"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
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
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityApiReturnsNotFoundForMissingRecord() throws Exception {
		mockMvc.perform(get("/api/master-data/governance-security/user-types/{id}", MISSING_ID))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("User type not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityApiIgnoresManualCodeForSelectiveAutoCodeResources() throws Exception {
		MvcResult companyProfileTypeResult = mockMvc.perform(postJson(
				"/api/master-data/governance-security/company-profile-types",
				Map.of(
						"tenantId", FOUNDATION_TENANT_ID,
						"code", "MANUAL_COMPANY_PROFILE_TYPE",
						"name", "Task 059.4 Company Profile Type")))
				.andExpect(status().isCreated())
				.andReturn();
		MvcResult officeLocationTypeResult = mockMvc.perform(postJson(
				"/api/master-data/governance-security/office-location-types",
				Map.of(
						"tenantId", FOUNDATION_TENANT_ID,
						"code", "MANUAL_OFFICE_LOCATION_TYPE",
						"name", "Task 059.4 Office Location Type")))
				.andExpect(status().isCreated())
				.andReturn();
		MvcResult disciplinaryActionTypeResult = mockMvc.perform(postJson(
				"/api/master-data/governance-security/disciplinary-action-types",
				Map.of(
						"code", "MANUAL_DISCIPLINARY_ACTION_TYPE",
						"name", "Task 059.4 Disciplinary Action Type",
						"severityLevel", "LOW")))
				.andExpect(status().isCreated())
				.andReturn();

		assertThat(responseCode(companyProfileTypeResult)).startsWith("CP").isNotEqualTo("MANUAL_COMPANY_PROFILE_TYPE");
		assertThat(responseCode(officeLocationTypeResult)).startsWith("OL").isNotEqualTo("MANUAL_OFFICE_LOCATION_TYPE");
		assertThat(responseCode(disciplinaryActionTypeResult)).startsWith("DA").isNotEqualTo("MANUAL_DISCIPLINARY_ACTION_TYPE");
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityApiReturnsConflictForGlobalCodeDuplicates() throws Exception {
		createMaster("/api/master-data/governance-security/user-types", globalRequest("TASK032_DUPLICATE_USER_TYPE", "Task 032 Duplicate"));

		mockMvc.perform(postJson("/api/master-data/governance-security/user-types", globalRequest(" task032_duplicate_user_type ", "Task 032 Duplicate 2")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("User type code already exists: TASK032_DUPLICATE_USER_TYPE"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityRejectsRoleCreateBypass() throws Exception {
		mockMvc.perform(postJson("/api/master-data/governance-security/roles", roleRequest("TASK0533_MASTERDATA_ROLE", "Task 053.3 Master Data Role", false)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Role lifecycle writes are managed under /api/admin/roles"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityRejectsRoleUpdateAndDeleteBypass() throws Exception {
		Role role = saveRole("TASK0533_MASTERDATA_UPDATE_ROLE", "Task 053.3 Master Data Update Role");

		mockMvc.perform(putJson("/api/master-data/governance-security/roles/" + role.getId(), roleRequest("TASK0533_MASTERDATA_UPDATE_ROLE", "Task 053.3 Updated", false)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Role lifecycle writes are managed under /api/admin/roles"));

		mockMvc.perform(delete("/api/master-data/governance-security/roles/{id}", role.getId()).with(csrf()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Role lifecycle writes are managed under /api/admin/roles"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityPhysicalDeleteRemovesUnreferencedSelectiveAutoCodeRecords() throws Exception {
		UUID disciplinaryActionTypeId = createMaster(
				"/api/master-data/governance-security/disciplinary-action-types",
				severityAutoCodeRequest("Task 059.4 Physical Disciplinary", "LOW"));
		UUID companyProfileTypeId = createMaster(
				"/api/master-data/governance-security/company-profile-types",
				tenantAutoCodeRequest("Task 059.4 Physical Company Profile"));
		UUID officeLocationTypeId = createMaster(
				"/api/master-data/governance-security/office-location-types",
				tenantAutoCodeRequest("Task 059.4 Physical Office Location"));

		mockMvc.perform(delete("/api/master-data/governance-security/disciplinary-action-types/{id}/physical", disciplinaryActionTypeId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/governance-security/company-profile-types/{id}/physical", companyProfileTypeId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/governance-security/office-location-types/{id}/physical", officeLocationTypeId).with(csrf()))
				.andExpect(status().isNoContent());

		assertThat(disciplinaryActionTypeRepository.findById(disciplinaryActionTypeId)).isEmpty();
		assertThat(companyProfileTypeRepository.findById(companyProfileTypeId)).isEmpty();
		assertThat(officeLocationTypeRepository.findById(officeLocationTypeId)).isEmpty();
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityPhysicalDeleteReturnsNotFoundForMissingRecord() throws Exception {
		mockMvc.perform(delete("/api/master-data/governance-security/disciplinary-action-types/{id}/physical", MISSING_ID).with(csrf()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Disciplinary action type not found: " + MISSING_ID));
		mockMvc.perform(delete("/api/master-data/governance-security/company-profile-types/{id}/physical", MISSING_ID).with(csrf()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Company profile type not found: " + MISSING_ID));
		mockMvc.perform(delete("/api/master-data/governance-security/office-location-types/{id}/physical", MISSING_ID).with(csrf()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Office location type not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataGovernanceSecurityPhysicalDeleteReturnsConflictForReferencedRecord() throws Exception {
		mockMvc.perform(delete("/api/master-data/governance-security/company-profile-types/{id}/physical", FOUNDATION_COMPANY_PROFILE_TYPE_ID).with(csrf()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Company profile type cannot be physically deleted because it is referenced by other data"));
		mockMvc.perform(delete("/api/master-data/governance-security/office-location-types/{id}/physical", FOUNDATION_HEADQUARTER_OFFICE_LOCATION_TYPE_ID).with(csrf()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Office location type cannot be physically deleted because it is referenced by other data"));

		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfile companyProfile = companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow();
		UserAccount issuedBy = userAccountRepository.findAll().stream().findFirst().orElseThrow();
		Employee employee = employeeRepository.saveAndFlush(newEmployee(tenant, companyProfile, "EMP-TASK0594-001"));
		EmployeeDisciplinaryAction action = new EmployeeDisciplinaryAction();
		action.setTenant(tenant);
		action.setCompanyProfile(companyProfile);
		action.setEmployee(employee);
		action.setDisciplinaryActionType(disciplinaryActionTypeRepository.findById(WARNING_DISCIPLINARY_ACTION_TYPE_ID).orElseThrow());
		action.setActionDate(LocalDate.of(2026, 5, 12));
		action.setTitle("Task 059.4 referenced disciplinary action");
		action.setDescription("Task 059.4 referenced disciplinary action description");
		action.setIssuedBy(issuedBy);
		action.setActive(true);
		employeeDisciplinaryActionRepository.saveAndFlush(action);

		mockMvc.perform(delete("/api/master-data/governance-security/disciplinary-action-types/{id}/physical", WARNING_DISCIPLINARY_ACTION_TYPE_ID).with(csrf()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Disciplinary action type cannot be physically deleted because it is referenced by other data"));
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
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/disciplinary-action-types/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/smtp-encryption-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/smtp-encryption-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/roles']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/roles/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/permissions']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/permissions/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/company-profile-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/company-profile-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/company-profile-types/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/office-location-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/office-location-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/governance-security/office-location-types/{id}/physical']").exists());
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

	private Map<String, Object> severityAutoCodeRequest(String name, String severityLevel) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", name);
		request.put("severityLevel", severityLevel);
		return request;
	}

	private Map<String, Object> tenantRequest(String code, String name) {
		Map<String, Object> request = globalRequest(code, name);
		request.put("tenantId", FOUNDATION_TENANT_ID);
		return request;
	}

	private Map<String, Object> tenantAutoCodeRequest(String name) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", FOUNDATION_TENANT_ID);
		request.put("name", name);
		return request;
	}

	private Map<String, Object> roleRequest(String code, String name, Boolean systemRole) {
		return roleRequest(FOUNDATION_TENANT_ID, code, name, systemRole);
	}

	private Map<String, Object> roleRequest(UUID tenantId, String code, String name, Boolean systemRole) {
		Map<String, Object> request = tenantRequest(code, name);
		request.put("tenantId", tenantId);
		request.put("description", "Role description");
		request.put("systemRole", systemRole);
		return request;
	}

	private Role saveRole(String code, String name) {
		Role role = new Role();
		role.setTenantId(FOUNDATION_TENANT_ID);
		role.setCode(code);
		role.setName(name);
		role.setDescription(name + " description");
		role.setSystemRole(false);
		role.setActive(true);
		return roleRepository.saveAndFlush(role);
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

	private String responseCode(MvcResult result) throws Exception {
		return objectMapper.readTree(result.getResponse().getContentAsString()).get("code").asText();
	}

	private String expectedCreateCode(String path, Map<String, Object> request) {
		Object explicitCode = request.get("code");
		if (explicitCode instanceof String explicitCodeString) {
			return explicitCodeString.trim().toUpperCase();
		}

		return switch (path) {
			case "/api/master-data/governance-security/company-profile-types" -> "^CP\\d{3}$";
			case "/api/master-data/governance-security/office-location-types" -> "^OL\\d{3}$";
			case "/api/master-data/governance-security/disciplinary-action-types" -> "^DA\\d{3}$";
			default -> throw new IllegalArgumentException("Unexpected auto-code resource path: " + path);
		};
	}

	private void assertCodeMatches(String actualCode, String expectedCode) {
		if (expectedCode.startsWith("^")) {
			assertThat(actualCode).matches(expectedCode);
			return;
		}

		assertThat(actualCode).isEqualTo(expectedCode);
	}

	private Employee newEmployee(Tenant tenant, CompanyProfile companyProfile, String employeeCode) {
		Employee employee = new Employee();
		employee.setTenant(tenant);
		employee.setCompany(companyProfile);
		employee.setOffice(null);
		employee.setEmployeeCode(employeeCode);
		employee.setFirstName("Task");
		employee.setLastName("0594 Employee");
		employee.setFiscalCode("FISCAL-" + employeeCode);
		employee.setEmail(employeeCode.toLowerCase() + "@example.com");
		employee.setResidenceCountry("IT");
		employee.setResidenceRegion("LAZIO");
		employee.setResidenceArea("ROMA");
		employee.setResidenceGlobalZipCode("00100");
		employee.setResidenceCity("Rome");
		employee.setResidenceAddressLine1("Foundation Street");
		employee.setResidenceStreetNumber("1");
		employee.setResidenceAddressLine2("Floor 1");
		employee.setResidencePostalCode("00100");
		employee.setNationalIdentifier("NID-" + employeeCode);
		employee.setNationalIdentifierType("FISCAL_CODE");
		employee.setBirthDate(LocalDate.of(1990, 1, 1));
		employee.setBirthCountry("IT");
		employee.setBirthRegion("LAZIO");
		employee.setBirthArea("ROMA");
		employee.setBirthCity("Rome");
		employee.setGender("OTHER");
		employee.setMaritalStatus("SINGLE");
		employee.setInternationalPhonePrefix("+39");
		employee.setPhoneNumber("0000000001");
		employee.setEmergencyContactName("Emergency Contact");
		employee.setEmergencyContactPhonePrefix("+39");
		employee.setEmergencyContactPhoneNumber("0000000002");
		employee.setHasChildren(false);
		employee.setChildrenCount(0);
		employee.setDepartment("DE001");
		employee.setJobTitle("JO001");
		employee.setContractType("CO001");
		employee.setEmploymentStatus("ACTIVE");
		employee.setWorkMode("WO001");
		employee.setHireDate(LocalDate.of(2026, 5, 2));
		return employee;
	}

	private record ResourceCase(String path, Map<String, Object> createRequest, Map<String, Object> updateRequest) {
	}
}
