package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.OfficeLocationRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.ContractTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.DepartmentRepository;
import com.odsoftware.hrm.repository.master.JobTitleRepository;
import com.odsoftware.hrm.repository.master.WorkModeRepository;
import java.time.LocalDate;
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
	private static final UUID FOUNDATION_COMPANY_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_OFFICE_ID = UUID.fromString("81000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_CURRENCY_ID = UUID.fromString("10000000-0000-0000-0000-000000000001");
	private static final UUID ITALY_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_PROFILE_TYPE_ID = UUID.fromString("77000000-0000-0000-0000-000000000001");
	private static final UUID SECONDARY_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000201");
	private static final UUID SECONDARY_COMPANY_ID = UUID.fromString("80000000-0000-0000-0000-000000000201");
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

	@Autowired
	private JobTitleRepository jobTitleRepository;

	@Autowired
	private ContractTypeRepository contractTypeRepository;

	@Autowired
	private WorkModeRepository workModeRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private CompanyProfileRepository companyProfileRepository;

	@Autowired
	private OfficeLocationRepository officeLocationRepository;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private CurrencyRepository currencyRepository;

	@Autowired
	private CompanyProfileTypeRepository companyProfileTypeRepository;

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
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
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessPhysicalDeleteRemovesUnreferencedCrudCandidateRecords() throws Exception {
		UUID departmentId = createTenantMaster("/api/master-data/hr-business/departments", "TASK0471_PHYSICAL_DEPARTMENT", "Task 047.1 Physical Department");
		UUID jobTitleId = createTenantMaster("/api/master-data/hr-business/job-titles", "TASK0471_PHYSICAL_JOB_TITLE", "Task 047.1 Physical Job Title");
		UUID contractTypeId = createTenantMaster("/api/master-data/hr-business/contract-types", "TASK0471_PHYSICAL_CONTRACT_TYPE", "Task 047.1 Physical Contract Type");
		UUID workModeId = createTenantMaster("/api/master-data/hr-business/work-modes", "TASK0471_PHYSICAL_WORK_MODE", "Task 047.1 Physical Work Mode");

		mockMvc.perform(delete("/api/master-data/hr-business/departments/{id}/physical", departmentId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/job-titles/{id}/physical", jobTitleId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/contract-types/{id}/physical", contractTypeId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/work-modes/{id}/physical", workModeId).with(csrf()))
				.andExpect(status().isNoContent());

		assertThat(departmentRepository.findById(departmentId)).isEmpty();
		assertThat(jobTitleRepository.findById(jobTitleId)).isEmpty();
		assertThat(contractTypeRepository.findById(contractTypeId)).isEmpty();
		assertThat(workModeRepository.findById(workModeId)).isEmpty();
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
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
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessListsNewestRecordsFirstByDefault() throws Exception {
		createTenantMaster("/api/master-data/hr-business/departments", "TASK0465_SORT_A", "Task 0465 Sort A");
		createTenantMaster("/api/master-data/hr-business/departments", "TASK0465_SORT_B", "Task 0465 Sort B");

		mockMvc.perform(get("/api/master-data/hr-business/departments?search=TASK0465_SORT"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content[0].code").value("TASK0465_SORT_B"))
				.andExpect(jsonPath("$.content[1].code").value("TASK0465_SORT_A"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
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
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessApiReturnsNotFoundForMissingRecord() throws Exception {
		mockMvc.perform(get("/api/master-data/hr-business/departments/{id}", MISSING_ID))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Department not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessPhysicalDeleteReturnsNotFoundForMissingRecord() throws Exception {
		mockMvc.perform(delete("/api/master-data/hr-business/departments/{id}/physical", MISSING_ID).with(csrf()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Department not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessApiReturnsConflictForTenantCodeDuplicates() throws Exception {
		createTenantMaster("/api/master-data/hr-business/departments", "TASK031_DUPLICATE", "Task 031 Duplicate");

		mockMvc.perform(postJson("/api/master-data/hr-business/departments", tenantMasterRequest(" task031_duplicate ", "Task 031 Duplicate 2")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Department code already exists for tenant: TASK031_DUPLICATE"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessPhysicalDeleteReturnsConflictForReferencedRecord() throws Exception {
		UUID departmentId = createTenantMaster("/api/master-data/hr-business/departments", "TASK0471_REFERENCED_DEPARTMENT", "Task 047.1 Referenced Department");
		employeeRepository.saveAndFlush(newEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow(),
				"EMP-T0471-001",
				"TASK0471_REFERENCED_DEPARTMENT",
				"HR_SPECIALIST",
				"FULL_TIME",
				"HYBRID"));

		mockMvc.perform(delete("/api/master-data/hr-business/departments/{id}/physical", departmentId).with(csrf()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Department cannot be physically deleted because it is referenced by other data"));

		assertThat(departmentRepository.findById(departmentId)).isPresent();
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessPhysicalDeleteIgnoresSameCodeReferencesFromAnotherTenant() throws Exception {
		Tenant secondaryTenant = ensureSecondaryTenant();
		CompanyProfile secondaryCompany = ensureSecondaryCompany(secondaryTenant);

		UUID departmentId = createTenantMaster("/api/master-data/hr-business/departments", "TASK0471_MULTI_DEPARTMENT", "Task 047.1 Multi Department");
		UUID jobTitleId = createTenantMaster("/api/master-data/hr-business/job-titles", "TASK0471_MULTI_JOB_TITLE", "Task 047.1 Multi Job Title");
		UUID contractTypeId = createTenantMaster("/api/master-data/hr-business/contract-types", "TASK0471_MULTI_CONTRACT_TYPE", "Task 047.1 Multi Contract Type");
		UUID workModeId = createTenantMaster("/api/master-data/hr-business/work-modes", "TASK0471_MULTI_WORK_MODE", "Task 047.1 Multi Work Mode");

		employeeRepository.saveAndFlush(newEmployee(
				secondaryTenant,
				secondaryCompany,
				"EMP-T0471-201",
				"TASK0471_MULTI_DEPARTMENT",
				"TASK0471_MULTI_JOB_TITLE",
				"TASK0471_MULTI_CONTRACT_TYPE",
				"TASK0471_MULTI_WORK_MODE"));

		mockMvc.perform(delete("/api/master-data/hr-business/departments/{id}/physical", departmentId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/job-titles/{id}/physical", jobTitleId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/contract-types/{id}/physical", contractTypeId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/work-modes/{id}/physical", workModeId).with(csrf()))
				.andExpect(status().isNoContent());

		assertThat(departmentRepository.findById(departmentId)).isEmpty();
		assertThat(jobTitleRepository.findById(jobTitleId)).isEmpty();
		assertThat(contractTypeRepository.findById(contractTypeId)).isEmpty();
		assertThat(workModeRepository.findById(workModeId)).isEmpty();
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
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
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/departments/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/job-titles']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/job-titles/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/job-titles/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/contract-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/contract-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/contract-types/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/employment-statuses']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/employment-statuses/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes/{id}/physical']").exists())
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

	private Employee newEmployee(
			Tenant tenant,
			CompanyProfile company,
			String employeeCode,
			String department,
			String jobTitle,
			String contractType,
			String workMode) {
		Employee employee = new Employee();
		employee.setTenant(tenant);
		employee.setCompany(company);
		employee.setOffice(null);
		employee.setEmployeeCode(employeeCode);
		employee.setFirstName("Task");
		employee.setLastName("0471 Employee");
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
		employee.setNationalIdentifier("FISCAL-" + employeeCode);
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
		employee.setDepartment(department);
		employee.setJobTitle(jobTitle);
		employee.setContractType(contractType);
		employee.setEmploymentStatus("ACTIVE");
		employee.setWorkMode(workMode);
		employee.setHireDate(LocalDate.of(2026, 5, 2));
		return employee;
	}

	private Tenant ensureSecondaryTenant() {
		return tenantRepository.findById(SECONDARY_TENANT_ID).orElseGet(() -> {
			Tenant tenant = new Tenant();
			tenant.setCode("TASK0471_TENANT_2");
			tenant.setName("Task 047.1 Tenant 2");
			tenant.setLegalName("Task 047.1 Tenant 2 Legal");
			tenant.setDefaultCountry(countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow());
			tenant.setDefaultCurrency(currencyRepository.findById(FOUNDATION_CURRENCY_ID).orElseThrow());
			return tenantRepository.saveAndFlush(tenant);
		});
	}

	private CompanyProfile ensureSecondaryCompany(Tenant tenant) {
		return companyProfileRepository.findById(SECONDARY_COMPANY_ID).orElseGet(() -> {
			CompanyProfile company = new CompanyProfile();
			company.setTenant(tenant);
			company.setCompanyProfileType(companyProfileTypeRepository.findById(FOUNDATION_COMPANY_PROFILE_TYPE_ID).orElseThrow());
			company.setCode("TASK0471_COMPANY_2");
			company.setLegalName("Task 047.1 Company 2 Legal");
			company.setTradeName("Task 047.1 Company 2");
			company.setEmail("task0471-company2@example.com");
			company.setPhone("+390000000200");
			company.setCountry(countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow());
			company.setStreet("Second Foundation Street");
			company.setStreetNumber("2");
			return companyProfileRepository.saveAndFlush(company);
		});
	}
}
