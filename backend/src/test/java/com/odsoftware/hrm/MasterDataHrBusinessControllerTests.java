package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.contract.Contract;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.device.Device;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.leave.LeaveRequest;
import com.odsoftware.hrm.entity.master.DeviceBrand;
import com.odsoftware.hrm.entity.master.DeviceStatus;
import com.odsoftware.hrm.entity.master.DeviceType;
import com.odsoftware.hrm.entity.master.DocumentType;
import com.odsoftware.hrm.entity.master.LeaveRequestType;
import com.odsoftware.hrm.entity.payroll.PayrollDocument;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.OfficeLocationRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.contract.ContractRepository;
import com.odsoftware.hrm.repository.device.DeviceRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.leave.LeaveRequestRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.ContractTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.DepartmentRepository;
import com.odsoftware.hrm.repository.master.DeviceBrandRepository;
import com.odsoftware.hrm.repository.master.DeviceStatusRepository;
import com.odsoftware.hrm.repository.master.DeviceTypeRepository;
import com.odsoftware.hrm.repository.master.DocumentTypeRepository;
import com.odsoftware.hrm.repository.master.EmploymentStatusRepository;
import com.odsoftware.hrm.repository.master.JobTitleRepository;
import com.odsoftware.hrm.repository.master.LeaveRequestTypeRepository;
import com.odsoftware.hrm.repository.master.WorkModeRepository;
import com.odsoftware.hrm.repository.payroll.PayrollDocumentRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;
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
	private EmploymentStatusRepository employmentStatusRepository;

	@Autowired
	private LeaveRequestTypeRepository leaveRequestTypeRepository;

	@Autowired
	private DocumentTypeRepository documentTypeRepository;

	@Autowired
	private DeviceTypeRepository deviceTypeRepository;

	@Autowired
	private DeviceBrandRepository deviceBrandRepository;

	@Autowired
	private DeviceStatusRepository deviceStatusRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private LeaveRequestRepository leaveRequestRepository;

	@Autowired
	private PayrollDocumentRepository payrollDocumentRepository;

	@Autowired
	private DeviceRepository deviceRepository;

	@Autowired
	private ContractRepository contractRepository;

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
			MvcResult result = mockMvc.perform(postJson(path, tenantMasterRequestForResource(path, code, " Task 031 Resource " + index + " ")))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.tenantId").value(FOUNDATION_TENANT_ID.toString()))
					.andExpect(jsonPath("$.name").value("Task 031 Resource " + index))
					.andExpect(jsonPath("$.active").value(true))
					.andReturn();

			String createdCode = responseCode(result);
			if (isAutoCodeResource(path)) {
				String prefix = expectedAutoCodePrefix(path);
				assertThat(Pattern.matches("^" + prefix + "\\d{3}$", createdCode)).isTrue();
			}
			else {
				assertThat(createdCode).isEqualTo(expectedCode);
			}

			UUID id = responseId(result);
			if (index == 0) {
				departmentId = id;
			}

			mockMvc.perform(get(path))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.content").isArray());
			mockMvc.perform(get(path + "/{id}", id))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(createdCode));
			mockMvc.perform(putJson(path + "/" + id, tenantMasterRequestForResource(path, createdCode, "Task 031 Resource Updated " + index)))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(createdCode))
					.andExpect(jsonPath("$.name").value("Task 031 Resource Updated " + index));
			mockMvc.perform(delete(path + "/{id}", id).with(csrf()))
					.andExpect(status().isNoContent());
		}

		assertThat(departmentRepository.findById(departmentId).orElseThrow().getActive()).isFalse();
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void task059RequestedMasterDataResourcesSupportSoftCrudFlow() throws Exception {
		String[] task059ResourcePaths = {
				"/api/master-data/hr-business/employment-statuses",
				"/api/master-data/hr-business/leave-request-types",
				"/api/master-data/hr-business/document-types",
				"/api/master-data/hr-business/device-types",
				"/api/master-data/hr-business/device-brands",
				"/api/master-data/hr-business/device-statuses"
		};

		for (int index = 0; index < task059ResourcePaths.length; index++) {
			String path = task059ResourcePaths[index];
			MvcResult result = mockMvc.perform(postJson(path, tenantMasterRequestForResource(path, "task059_resource_" + index, " Task 059 Resource " + index + " ")))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.tenantId").value(FOUNDATION_TENANT_ID.toString()))
					.andExpect(jsonPath("$.name").value("Task 059 Resource " + index))
					.andExpect(jsonPath("$.active").value(true))
					.andReturn();

			String createdCode = responseCode(result);
			assertThat(Pattern.matches("^" + expectedAutoCodePrefix(path) + "\\d{3}$", createdCode)).isTrue();

			UUID id = responseId(result);

			mockMvc.perform(get(path))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.content").isArray());
			mockMvc.perform(get(path + "/{id}", id))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(createdCode));
			mockMvc.perform(putJson(path + "/" + id, tenantMasterRequestForResource(path, "IGNORED", "Task 059 Resource Updated " + index)))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.code").value(createdCode))
					.andExpect(jsonPath("$.name").value("Task 059 Resource Updated " + index));
			mockMvc.perform(delete(path + "/{id}", id).with(csrf()))
					.andExpect(status().isNoContent());
			mockMvc.perform(get(path + "/{id}", id))
					.andExpect(status().isOk())
					.andExpect(jsonPath("$.active").value(false));
		}
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void task059PhysicalDeleteRemovesUnreferencedRecords() throws Exception {
		Map<String, UUID> createdResources = new LinkedHashMap<>();
		createdResources.put("/api/master-data/hr-business/employment-statuses", createTenantMaster(
				"/api/master-data/hr-business/employment-statuses",
				"TASK059_PHYSICAL_EMPLOYMENT_STATUS",
				"Task 059 Physical Employment Status"));
		createdResources.put("/api/master-data/hr-business/leave-request-types", createTenantMaster(
				"/api/master-data/hr-business/leave-request-types",
				"TASK059_PHYSICAL_LEAVE_REQUEST_TYPE",
				"Task 059 Physical Leave Request Type"));
		createdResources.put("/api/master-data/hr-business/document-types", createTenantMaster(
				"/api/master-data/hr-business/document-types",
				"TASK059_PHYSICAL_DOCUMENT_TYPE",
				"Task 059 Physical Document Type"));
		createdResources.put("/api/master-data/hr-business/device-types", createTenantMaster(
				"/api/master-data/hr-business/device-types",
				"TASK059_PHYSICAL_DEVICE_TYPE",
				"Task 059 Physical Device Type"));
		createdResources.put("/api/master-data/hr-business/device-brands", createTenantMaster(
				"/api/master-data/hr-business/device-brands",
				"TASK059_PHYSICAL_DEVICE_BRAND",
				"Task 059 Physical Device Brand"));
		createdResources.put("/api/master-data/hr-business/device-statuses", createTenantMaster(
				"/api/master-data/hr-business/device-statuses",
				"TASK059_PHYSICAL_DEVICE_STATUS",
				"Task 059 Physical Device Status"));

		for (Map.Entry<String, UUID> entry : createdResources.entrySet()) {
			mockMvc.perform(delete(entry.getKey() + "/{id}/physical", entry.getValue()).with(csrf()))
					.andExpect(status().isNoContent());
			mockMvc.perform(get(entry.getKey() + "/{id}", entry.getValue()))
					.andExpect(status().isNotFound());
		}
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
		CreatedTenantMaster searchedDepartment = createTenantMasterWithCode(
				"/api/master-data/hr-business/departments",
				"TASK043_PAGE_B",
				"Task 043 Page B");
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

		mockMvc.perform(get("/api/master-data/hr-business/departments?search=Task 043 Page B"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].code").value(searchedDepartment.code()));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessListsNewestRecordsFirstByDefault() throws Exception {
		CreatedTenantMaster firstDepartment = createTenantMasterWithCode(
				"/api/master-data/hr-business/departments",
				"TASK0465_SORT_A",
				"Task 0465 Sort A");
		CreatedTenantMaster secondDepartment = createTenantMasterWithCode(
				"/api/master-data/hr-business/departments",
				"TASK0465_SORT_B",
				"Task 0465 Sort B");

		mockMvc.perform(get("/api/master-data/hr-business/departments?search=0465"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content[0].code").value(secondDepartment.code()))
				.andExpect(jsonPath("$.content[1].code").value(firstDepartment.code()));
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessApiReturnsValidationErrorForInvalidPayload() throws Exception {
		mockMvc.perform(postJson("/api/master-data/hr-business/departments", Map.of("name", "")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.validationErrors.tenantId").exists())
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
	void task059PhysicalDeleteReturnsNotFoundForMissingRecord() throws Exception {
		Map<String, String> task059PhysicalPaths = Map.of(
				"/api/master-data/hr-business/employment-statuses", "Employment status",
				"/api/master-data/hr-business/leave-request-types", "Leave request type",
				"/api/master-data/hr-business/document-types", "Document type",
				"/api/master-data/hr-business/device-types", "Device type",
				"/api/master-data/hr-business/device-brands", "Device brand",
				"/api/master-data/hr-business/device-statuses", "Device status");

		for (Map.Entry<String, String> entry : task059PhysicalPaths.entrySet()) {
			mockMvc.perform(delete(entry.getKey() + "/{id}/physical", MISSING_ID).with(csrf()))
					.andExpect(status().isNotFound())
					.andExpect(jsonPath("$.status").value(404))
					.andExpect(jsonPath("$.message").value(entry.getValue() + " not found: " + MISSING_ID));
		}
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessApiIgnoresManualCodeForAutoCodeResources() throws Exception {
		MvcResult result = mockMvc.perform(postJson(
				"/api/master-data/hr-business/departments",
				Map.of(
						"tenantId", FOUNDATION_TENANT_ID,
						"code", "MANUAL_DEPARTMENT",
						"name", "Task 031 Auto Department")))
				.andExpect(status().isCreated())
				.andReturn();

		assertThat(responseCode(result)).startsWith("DE").isNotEqualTo("MANUAL_DEPARTMENT");
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessPhysicalDeleteReturnsConflictForReferencedRecord() throws Exception {
		CreatedTenantMaster department = createTenantMasterWithCode(
				"/api/master-data/hr-business/departments",
				"TASK0471_REFERENCED_DEPARTMENT",
				"Task 047.1 Referenced Department");
		employeeRepository.saveAndFlush(newEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow(),
				"EMP-T0471-001",
				department.code(),
				"HR_SPECIALIST",
				"FULL_TIME",
				"HYBRID"));

		mockMvc.perform(delete("/api/master-data/hr-business/departments/{id}/physical", department.id()).with(csrf()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Department cannot be physically deleted because it is referenced by other data"));

		assertThat(departmentRepository.findById(department.id())).isPresent();
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void task059PhysicalDeleteReturnsConflictForReferencedRecords() throws Exception {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfile company = companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow();

		UUID employmentStatusId = createTenantMaster(
				"/api/master-data/hr-business/employment-statuses",
				"TASK059_REFERENCED_EMPLOYMENT_STATUS",
				"Task 059 Referenced Employment Status");
		String referencedEmploymentStatusCode = employmentStatusRepository.findById(employmentStatusId).orElseThrow().getCode();
		String defaultEmploymentStatusCode = employmentStatusRepository.findAll().stream()
				.filter(status -> FOUNDATION_TENANT_ID.equals(status.getTenantId()))
				.map(status -> status.getCode())
				.findFirst()
				.orElse(referencedEmploymentStatusCode);
		employeeRepository.saveAndFlush(newEmployee(
				tenant,
				company,
				"EMP-T059-EMPLOYMENT-001",
				"HR",
				"HR_SPECIALIST",
				"FULL_TIME",
				referencedEmploymentStatusCode,
				"HYBRID"));

		UUID leaveRequestTypeId = createTenantMaster(
				"/api/master-data/hr-business/leave-request-types",
				"TASK059_REFERENCED_LEAVE_REQUEST_TYPE",
				"Task 059 Referenced Leave Request Type");
		Employee leaveEmployee = employeeRepository.saveAndFlush(newEmployee(
				tenant,
				company,
				"EMP-T059-LEAVE-001",
				"HR",
				"HR_SPECIALIST",
				"FULL_TIME",
				defaultEmploymentStatusCode,
				"HYBRID"));
		LeaveRequestType leaveRequestType = leaveRequestTypeRepository.findById(leaveRequestTypeId).orElseThrow();
		leaveRequestRepository.saveAndFlush(newLeaveRequest(leaveEmployee, leaveRequestType));

		UUID documentTypeId = createTenantMaster(
				"/api/master-data/hr-business/document-types",
				"TASK059_REFERENCED_DOCUMENT_TYPE",
				"Task 059 Referenced Document Type");
		CreatedTenantMaster task059ContractType = createTenantMasterWithCode(
				"/api/master-data/hr-business/contract-types",
				"TASK059_REFERENCED_CONTRACT_TYPE",
				"Task 059 Referenced Contract Type");
		Employee payrollEmployee = employeeRepository.saveAndFlush(newEmployee(
				tenant,
				company,
				"EMP-T059-PAYROLL-001",
				"FINANCE",
				"PAYROLL_SPECIALIST",
				task059ContractType.code(),
				defaultEmploymentStatusCode,
				"ONSITE"));
		Contract payrollContract = contractRepository.saveAndFlush(newContract(
				payrollEmployee,
				contractTypeRepository.findById(task059ContractType.id()).orElseThrow()));
		DocumentType documentType = documentTypeRepository.findById(documentTypeId).orElseThrow();
		payrollDocumentRepository.saveAndFlush(newPayrollDocument(payrollEmployee, payrollContract, documentType));

		UUID deviceTypeId = createTenantMaster(
				"/api/master-data/hr-business/device-types",
				"TASK059_REFERENCED_DEVICE_TYPE",
				"Task 059 Referenced Device Type");
		UUID deviceBrandId = createTenantMaster(
				"/api/master-data/hr-business/device-brands",
				"TASK059_REFERENCED_DEVICE_BRAND",
				"Task 059 Referenced Device Brand");
		UUID deviceStatusId = createTenantMaster(
				"/api/master-data/hr-business/device-statuses",
				"TASK059_REFERENCED_DEVICE_STATUS",
				"Task 059 Referenced Device Status");
		deviceRepository.saveAndFlush(newDevice(
				"Task 059 Referenced Device",
				"TASK059-SERIAL-001",
				deviceTypeRepository.findById(deviceTypeId).orElseThrow(),
				deviceBrandRepository.findById(deviceBrandId).orElseThrow(),
				deviceStatusRepository.findById(deviceStatusId).orElseThrow()));

		assertTask059PhysicalDeleteConflict(
				"/api/master-data/hr-business/employment-statuses",
				employmentStatusId,
				"Employment status");
		assertTask059PhysicalDeleteConflict(
				"/api/master-data/hr-business/leave-request-types",
				leaveRequestTypeId,
				"Leave request type");
		assertTask059PhysicalDeleteConflict(
				"/api/master-data/hr-business/document-types",
				documentTypeId,
				"Document type");
		assertTask059PhysicalDeleteConflict(
				"/api/master-data/hr-business/device-types",
				deviceTypeId,
				"Device type");
		assertTask059PhysicalDeleteConflict(
				"/api/master-data/hr-business/device-brands",
				deviceBrandId,
				"Device brand");
		assertTask059PhysicalDeleteConflict(
				"/api/master-data/hr-business/device-statuses",
				deviceStatusId,
				"Device status");
	}

	@Test
	@WithMockUser(authorities = "TENANT.MASTER_DATA.MANAGE")
	void masterDataHrBusinessPhysicalDeleteIgnoresSameCodeReferencesFromAnotherTenant() throws Exception {
		Tenant secondaryTenant = ensureSecondaryTenant();
		CompanyProfile secondaryCompany = ensureSecondaryCompany(secondaryTenant);

		CreatedTenantMaster department = createTenantMasterWithCode(
				"/api/master-data/hr-business/departments",
				"TASK0471_MULTI_DEPARTMENT",
				"Task 047.1 Multi Department");
		CreatedTenantMaster jobTitle = createTenantMasterWithCode(
				"/api/master-data/hr-business/job-titles",
				"TASK0471_MULTI_JOB_TITLE",
				"Task 047.1 Multi Job Title");
		CreatedTenantMaster contractType = createTenantMasterWithCode(
				"/api/master-data/hr-business/contract-types",
				"TASK0471_MULTI_CONTRACT_TYPE",
				"Task 047.1 Multi Contract Type");
		CreatedTenantMaster workMode = createTenantMasterWithCode(
				"/api/master-data/hr-business/work-modes",
				"TASK0471_MULTI_WORK_MODE",
				"Task 047.1 Multi Work Mode");

		employeeRepository.saveAndFlush(newEmployee(
				secondaryTenant,
				secondaryCompany,
				"EMP-T0471-201",
				department.code(),
				jobTitle.code(),
				contractType.code(),
				workMode.code()));

		mockMvc.perform(delete("/api/master-data/hr-business/departments/{id}/physical", department.id()).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/job-titles/{id}/physical", jobTitle.id()).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/contract-types/{id}/physical", contractType.id()).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/hr-business/work-modes/{id}/physical", workMode.id()).with(csrf()))
				.andExpect(status().isNoContent());

		assertThat(departmentRepository.findById(department.id())).isEmpty();
		assertThat(jobTitleRepository.findById(jobTitle.id())).isEmpty();
		assertThat(contractTypeRepository.findById(contractType.id())).isEmpty();
		assertThat(workModeRepository.findById(workMode.id())).isEmpty();
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
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/employment-statuses/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/work-modes/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/leave-request-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/leave-request-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/leave-request-types/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/document-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/document-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/document-types/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-types/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-types/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-brands']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-brands/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-brands/{id}/physical']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-statuses']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-statuses/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/hr-business/device-statuses/{id}/physical']").exists());
	}

	private UUID createTenantMaster(String path, String code, String name) throws Exception {
		return createTenantMasterWithCode(path, code, name).id();
	}

	private CreatedTenantMaster createTenantMasterWithCode(String path, String code, String name) throws Exception {
		MvcResult result = mockMvc.perform(postJson(path, tenantMasterRequestForResource(path, code, name)))
				.andExpect(status().isCreated())
				.andReturn();
		return new CreatedTenantMaster(responseId(result), responseCode(result));
	}

	private Map<String, Object> tenantMasterRequestForResource(String path, String code, String name) {
		if (isAutoCodeResource(path)) {
			return tenantMasterAutoCodeRequest(FOUNDATION_TENANT_ID, name);
		}
		return tenantMasterRequest(code, name);
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

	private Map<String, Object> tenantMasterAutoCodeRequest(UUID tenantId, String name) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", tenantId);
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

	private String responseCode(MvcResult result) throws Exception {
		return objectMapper.readTree(result.getResponse().getContentAsString()).get("code").asText();
	}

	private boolean isAutoCodeResource(String path) {
		return expectedAutoCodePrefix(path) != null;
	}

	private String expectedAutoCodePrefix(String path) {
		return switch (path) {
			case "/api/master-data/hr-business/departments" -> "DE";
			case "/api/master-data/hr-business/job-titles" -> "JO";
			case "/api/master-data/hr-business/contract-types" -> "CO";
			case "/api/master-data/hr-business/employment-statuses" -> "ES";
			case "/api/master-data/hr-business/work-modes" -> "WO";
			case "/api/master-data/hr-business/leave-request-types" -> "LR";
			case "/api/master-data/hr-business/document-types" -> "DT";
			case "/api/master-data/hr-business/device-types" -> "DV";
			case "/api/master-data/hr-business/device-brands" -> "DB";
			case "/api/master-data/hr-business/device-statuses" -> "DS";
			default -> null;
		};
	}

	private void assertTask059PhysicalDeleteConflict(String path, UUID id, String label) throws Exception {
		mockMvc.perform(delete(path + "/{id}/physical", id).with(csrf()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value(label + " cannot be physically deleted because it is referenced by other data"));
		mockMvc.perform(get(path + "/{id}", id))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(id.toString()));
	}

	private Employee newEmployee(
			Tenant tenant,
			CompanyProfile company,
			String employeeCode,
			String department,
			String jobTitle,
			String contractType,
			String employmentStatus,
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
		employee.setEmploymentStatus(employmentStatus);
		employee.setWorkMode(workMode);
		employee.setHireDate(LocalDate.of(2026, 5, 2));
		return employee;
	}

	private Employee newEmployee(
			Tenant tenant,
			CompanyProfile company,
			String employeeCode,
			String department,
			String jobTitle,
			String contractType,
			String workMode) {
		return newEmployee(tenant, company, employeeCode, department, jobTitle, contractType, "ACTIVE", workMode);
	}

	private Contract newContract(Employee employee, com.odsoftware.hrm.entity.master.ContractType contractType) {
		Contract contract = new Contract();
		contract.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		contract.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		contract.setEmployee(employee);
		contract.setContractType(contractType);
		contract.setCurrency(currencyRepository.findById(FOUNDATION_CURRENCY_ID).orElseThrow());
		contract.setStartDate(LocalDate.of(2026, 1, 1));
		contract.setBaseSalary(new BigDecimal("42000.00"));
		contract.setWeeklyHours(new BigDecimal("40.00"));
		return contract;
	}

	private LeaveRequest newLeaveRequest(Employee employee, LeaveRequestType leaveRequestType) {
		LeaveRequest leaveRequest = new LeaveRequest();
		leaveRequest.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		leaveRequest.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		leaveRequest.setEmployee(employee);
		leaveRequest.setLeaveRequestType(leaveRequestType);
		leaveRequest.setStartDate(LocalDate.of(2026, 6, 1));
		leaveRequest.setEndDate(LocalDate.of(2026, 6, 3));
		leaveRequest.setDurationDays(new BigDecimal("3.00"));
		leaveRequest.setDeductFromBalance(true);
		leaveRequest.setDeductedDays(new BigDecimal("3.000"));
		leaveRequest.setReason("Task 059 referenced leave request");
		return leaveRequest;
	}

	private PayrollDocument newPayrollDocument(Employee employee, Contract contract, DocumentType documentType) {
		PayrollDocument payrollDocument = new PayrollDocument();
		payrollDocument.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		payrollDocument.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		payrollDocument.setEmployee(employee);
		payrollDocument.setContract(contract);
		payrollDocument.setDocumentType(documentType);
		payrollDocument.setOriginalFilename("task059-payroll.pdf");
		payrollDocument.setStoredFilename("task059-payroll.pdf");
		payrollDocument.setContentType("application/pdf");
		payrollDocument.setFileSizeBytes(128000L);
		payrollDocument.setChecksum("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
		payrollDocument.setStoragePath("payroll/2026/05/task059-payroll.pdf");
		payrollDocument.setPeriodYear(2026);
		payrollDocument.setPeriodMonth(5);
		return payrollDocument;
	}

	private Device newDevice(String name, String serialNumber, DeviceType type, DeviceBrand brand, DeviceStatus deviceStatus) {
		Device device = new Device();
		device.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		device.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		device.setName(name);
		device.setType(type);
		device.setBrand(brand);
		device.setModel("Task 059 Model");
		device.setSerialNumber(serialNumber);
		device.setPurchaseDate(LocalDate.of(2026, 5, 2));
		device.setWarrantyEndDate(LocalDate.of(2029, 5, 2));
		device.setDeviceStatus(deviceStatus);
		return device;
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

	private record CreatedTenantMaster(UUID id, String code) {
	}
}
