package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.leave.LeaveRequest;
import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import com.odsoftware.hrm.entity.master.LeaveRequestType;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.leave.LeaveRequestRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.LeaveRequestTypeRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
class LeaveRequestAdministrationControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_PROFILE_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000003");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000051");
	private static final UUID PLATFORM_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000052");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");
	private static final String VALID_PASSWORD = "Secret1!";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private CompanyProfileRepository companyProfileRepository;

	@Autowired
	private CompanyProfileTypeRepository companyProfileTypeRepository;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private CurrencyRepository currencyRepository;

	@Autowired
	private LeaveRequestRepository leaveRequestRepository;

	@Autowired
	private LeaveRequestTypeRepository leaveRequestTypeRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private AuthenticationMethodRepository authenticationMethodRepository;

	@Autowired
	private PermissionRepository permissionRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private RolePermissionRepository rolePermissionRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private UserTenantAccessRepository userTenantAccessRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	@WithMockUser
	void leaveRequestAdministrationReturnsDetail() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_1",
				"Ada",
				"Lovelace",
				true);
		Employee approver = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_APPROVER_1",
				"Grace",
				"Hopper",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_1",
				"Task 068.3 Vacation",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);
		leaveRequest.setApprover(approver);
		leaveRequest.setComments("Reviewed by admin");
		leaveRequest.setUrgent(true);
		leaveRequest.setUrgentReason("Urgent family matter");
		leaveRequestRepository.saveAndFlush(leaveRequest);

		mockMvc.perform(get("/api/admin/leave-requests/{leaveRequestId}", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(leaveRequest.getId().toString()))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.companyProfile.id").value(FOUNDATION_COMPANY_PROFILE_ID.toString()))
				.andExpect(jsonPath("$.employee.id").value(employee.getId().toString()))
				.andExpect(jsonPath("$.leaveRequestType.id").value(leaveRequestType.getId().toString()))
				.andExpect(jsonPath("$.status").value("SUBMITTED"))
				.andExpect(jsonPath("$.comments").value("Reviewed by admin"))
				.andExpect(jsonPath("$.urgent").value(true))
				.andExpect(jsonPath("$.urgentReason").value("Urgent family matter"))
				.andExpect(jsonPath("$.approver.id").value(approver.getId().toString()));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationCreatesDraftWhenStatusIsNull() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_2",
				"Katherine",
				"Johnson",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_2",
				"Task 068.3 Personal Leave",
				true);

		MvcResult result = mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						leaveRequestType.getId(),
						null))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("DRAFT"))
				.andExpect(jsonPath("$.employee.id").value(employee.getId().toString()))
				.andExpect(jsonPath("$.companyProfile.id").value(FOUNDATION_COMPANY_PROFILE_ID.toString()))
				.andExpect(jsonPath("$.leaveRequestType.id").value(leaveRequestType.getId().toString()))
				.andReturn();

		UUID leaveRequestId = UUID.fromString(objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText());
		assertThat(leaveRequestRepository.findById(leaveRequestId)).isPresent();
		assertThat(leaveRequestRepository.findById(leaveRequestId).orElseThrow().getStatus()).isEqualTo(LeaveRequestStatus.DRAFT);
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationCreatesSubmittedRequest() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_3",
				"Dorothy",
				"Vaughan",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_3",
				"Task 068.3 Sick Leave",
				true);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						leaveRequestType.getId(),
						"SUBMITTED"))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("SUBMITTED"))
				.andExpect(jsonPath("$.reason").value("Planned leave"))
				.andExpect(jsonPath("$.urgent").value(false));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationUpdatesMutableRequest() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_4",
				"Barbara",
				"Liskov",
				true);
		LeaveRequestType initialType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_4A",
				"Task 068.3 Initial Type",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, initialType, LeaveRequestStatus.DRAFT);
		Employee updatedEmployee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_5",
				"Frances",
				"Allen",
				true);
		LeaveRequestType updatedType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_4B",
				"Task 068.3 Updated Type",
				true);

		mockMvc.perform(putJson("/api/admin/leave-requests/" + leaveRequest.getId(), updateRequest(
						updatedEmployee.getId(),
						updatedType.getId(),
						"SUBMITTED"))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.employee.id").value(updatedEmployee.getId().toString()))
				.andExpect(jsonPath("$.leaveRequestType.id").value(updatedType.getId().toString()))
				.andExpect(jsonPath("$.status").value("SUBMITTED"))
				.andExpect(jsonPath("$.reason").value("Updated leave reason"))
				.andExpect(jsonPath("$.urgent").value(true))
				.andExpect(jsonPath("$.urgentReason").value("Urgent schedule change"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationCancelsMutableRequestOnDelete() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_6",
				"Margaret",
				"Hamilton",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_5",
				"Task 068.3 Cancel Type",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);

		mockMvc.perform(delete("/api/admin/leave-requests/{leaveRequestId}", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isNoContent());

		assertThat(leaveRequestRepository.findById(leaveRequest.getId())).isPresent();
		assertThat(leaveRequestRepository.findById(leaveRequest.getId()).orElseThrow().getStatus()).isEqualTo(LeaveRequestStatus.CANCELLED);
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationApprovesSubmittedRequest() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0688_EMPLOYEE_1",
				"Adele",
				"Goldberg",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0688_TYPE_1",
				"Task 068.8 Approve",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);

		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(leaveRequest.getId().toString()))
				.andExpect(jsonPath("$.status").value("APPROVED"));

		assertThat(leaveRequestRepository.findById(leaveRequest.getId()).orElseThrow().getStatus()).isEqualTo(LeaveRequestStatus.APPROVED);
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsSubmittedRequest() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0688_EMPLOYEE_2",
				"Mary",
				"Keller",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0688_TYPE_2",
				"Task 068.8 Reject",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);

		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/reject", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(leaveRequest.getId().toString()))
				.andExpect(jsonPath("$.status").value("REJECTED"));

		assertThat(leaveRequestRepository.findById(leaveRequest.getId()).orElseThrow().getStatus()).isEqualTo(LeaveRequestStatus.REJECTED);
	}

	@ParameterizedTest
	@EnumSource(value = LeaveRequestStatus.class, names = { "DRAFT", "APPROVED", "REJECTED", "CANCELLED" })
	@WithMockUser
	void leaveRequestAdministrationRejectsApproveWhenRequestIsNotSubmitted(LeaveRequestStatus initialStatus) throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0688_EMPLOYEE_APPROVE_" + initialStatus.name(),
				"Approve",
				initialStatus.name(),
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0688_TYPE_APPROVE_" + initialStatus.name(),
				"Task 068.8 Approve " + initialStatus.name(),
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, initialStatus);

		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value(
						"Leave request can be approved only from status: SUBMITTED. Current status: " + initialStatus));
	}

	@ParameterizedTest
	@EnumSource(value = LeaveRequestStatus.class, names = { "DRAFT", "APPROVED", "REJECTED", "CANCELLED" })
	@WithMockUser
	void leaveRequestAdministrationRejectsRejectWhenRequestIsNotSubmitted(LeaveRequestStatus initialStatus) throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0688_EMPLOYEE_REJECT_" + initialStatus.name(),
				"Reject",
				initialStatus.name(),
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0688_TYPE_REJECT_" + initialStatus.name(),
				"Task 068.8 Reject " + initialStatus.name(),
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, initialStatus);

		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/reject", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value(
						"Leave request can be rejected only from status: SUBMITTED. Current status: " + initialStatus));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsApproveForMissingRequest() throws Exception {
		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", MISSING_ID).with(leaveRequestTenantCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Leave request not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsRejectForMissingRequest() throws Exception {
		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/reject", MISSING_ID).with(leaveRequestTenantCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Leave request not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsCrossTenantApproveForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK0688_OTHER_TENANT_APPROVE");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0688_OTHER_COMPANY_APPROVE");
		Employee otherEmployee = saveEmployee(otherTenant, otherCompanyProfile, "TASK0688_EMPLOYEE_3", "Cross", "TenantApprove", true);
		LeaveRequestType otherType = saveLeaveRequestType(otherTenant, "TASK0688_TYPE_3", "Task 068.8 Cross Tenant Approve", true);
		LeaveRequest leaveRequest = saveLeaveRequest(otherEmployee, otherType, LeaveRequestStatus.SUBMITTED);

		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant leave request administration is not allowed for caller"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsDateRangeValidation() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_7",
				"Edsger",
				"Dijkstra",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_6",
				"Task 068.3 Invalid Dates",
				true);
		Map<String, Object> request = createRequest(FOUNDATION_TENANT_ID, employee.getId(), leaveRequestType.getId(), null);
		request.put("startDate", "2026-08-05");
		request.put("endDate", "2026-08-01");

		mockMvc.perform(postJson("/api/admin/leave-requests", request).with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Leave request end date must be on or after start date"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsMissingDatesAtValidationLayer() throws Exception {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", FOUNDATION_TENANT_ID);
		request.put("employeeId", MISSING_ID);
		request.put("leaveRequestTypeId", MISSING_ID);
		request.put("deductFromBalance", true);
		request.put("urgent", false);

		mockMvc.perform(postJson("/api/admin/leave-requests", request).with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.validationErrors.startDate").exists())
				.andExpect(jsonPath("$.validationErrors.endDate").exists());
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsMissingEmployee() throws Exception {
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_7",
				"Task 068.3 Missing Employee",
				true);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						MISSING_ID,
						leaveRequestType.getId(),
						null))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Employee not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsCrossTenantEmployeeForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK0683_OTHER_TENANT_A");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0683_OTHER_COMPANY_A");
		Employee otherEmployee = saveEmployee(otherTenant, otherCompanyProfile, "TASK0683_EMPLOYEE_8", "Ken", "Thompson", true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_8",
				"Task 068.3 Cross Tenant Employee",
				true);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						otherEmployee.getId(),
						leaveRequestType.getId(),
						null))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Employee does not belong to tenant: " + otherEmployee.getId()));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsInactiveEmployee() throws Exception {
		Employee inactiveEmployee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_9",
				"Inactive",
				"Employee",
				false);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_9",
				"Task 068.3 Inactive Employee",
				true);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						inactiveEmployee.getId(),
						leaveRequestType.getId(),
						null))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Employee is inactive and cannot be used for leave requests: " + inactiveEmployee.getId()));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsMissingLeaveRequestType() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_10",
				"Donald",
				"Knuth",
				true);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						MISSING_ID,
						null))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Leave request type not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsInactiveLeaveRequestType() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_11",
				"Leslie",
				"Lamport",
				true);
		LeaveRequestType inactiveType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_10",
				"Task 068.3 Inactive Type",
				false);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						inactiveType.getId(),
						null))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Leave request type is inactive and cannot be used: " + inactiveType.getId()));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsCrossTenantLeaveRequestType() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_12",
				"John",
				"McCarthy",
				true);
		Tenant otherTenant = saveTenant("TASK0683_OTHER_TENANT_B");
		LeaveRequestType otherTenantType = saveLeaveRequestType(otherTenant, "TASK0683_TYPE_11", "Task 068.3 Other Tenant Type", true);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						otherTenantType.getId(),
						null))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Leave request type does not belong to tenant: " + otherTenantType.getId()));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsClosedStatusInCreate() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_13",
				"Robert",
				"Tarjan",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_12",
				"Task 068.3 Closed Status",
				true);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						leaveRequestType.getId(),
						"APPROVED"))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Leave request status is not allowed for administration CRUD: APPROVED"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsClosedStatusUpdate() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_14",
				"Alan",
				"Kay",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_13",
				"Task 068.3 Update Closed Status",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.DRAFT);

		Map<String, Object> request = updateRequest(employee.getId(), leaveRequestType.getId(), "APPROVED");
		mockMvc.perform(putJson("/api/admin/leave-requests/" + leaveRequest.getId(), request).with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Leave request status is not allowed for administration CRUD: APPROVED"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsUpdateWhenRecordAlreadyClosed() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_15",
				"Niklaus",
				"Wirth",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_14",
				"Task 068.3 Closed Record",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.APPROVED);

		mockMvc.perform(putJson("/api/admin/leave-requests/" + leaveRequest.getId(), updateRequest(
						employee.getId(),
						leaveRequestType.getId(),
						"DRAFT"))
						.with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Leave request is not editable from status: APPROVED"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsDeleteWhenRecordAlreadyClosed() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_16",
				"Tony",
				"Hoare",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_15",
				"Task 068.3 Closed Delete",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.CANCELLED);

		mockMvc.perform(delete("/api/admin/leave-requests/{leaveRequestId}", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Leave request is not editable from status: CANCELLED"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationRejectsCrossTenantDetailForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK0683_OTHER_TENANT_C");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0683_OTHER_COMPANY_C");
		Employee otherEmployee = saveEmployee(otherTenant, otherCompanyProfile, "TASK0683_EMPLOYEE_17", "Linus", "Torvalds", true);
		LeaveRequestType otherType = saveLeaveRequestType(otherTenant, "TASK0683_TYPE_16", "Task 068.3 Cross Tenant Detail", true);
		LeaveRequest leaveRequest = saveLeaveRequest(otherEmployee, otherType, LeaveRequestStatus.DRAFT);

		mockMvc.perform(get("/api/admin/leave-requests/{leaveRequestId}", leaveRequest.getId()).with(leaveRequestTenantCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant leave request administration is not allowed for caller"));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationAllowsPlatformCrossTenantDetail() throws Exception {
		Tenant otherTenant = saveTenant("TASK0683_OTHER_TENANT_D");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0683_OTHER_COMPANY_D");
		Employee otherEmployee = saveEmployee(otherTenant, otherCompanyProfile, "TASK0683_EMPLOYEE_18", "Dennis", "Ritchie", true);
		LeaveRequestType otherType = saveLeaveRequestType(otherTenant, "TASK0683_TYPE_17", "Task 068.3 Platform Detail", true);
		LeaveRequest leaveRequest = saveLeaveRequest(otherEmployee, otherType, LeaveRequestStatus.DRAFT);

		mockMvc.perform(get("/api/admin/leave-requests/{leaveRequestId}", leaveRequest.getId()).with(leaveRequestPlatformCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tenant.id").value(otherTenant.getId().toString()));
	}

	@Test
	@WithMockUser
	void leaveRequestAdministrationProtectsCrudEndpointsWithAuthorities() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_19",
				"Tim",
				"Berners-Lee",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_18",
				"Task 068.3 RBAC Type",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.DRAFT);

		mockMvc.perform(get("/api/admin/leave-requests/{leaveRequestId}", leaveRequest.getId())
						.with(leaveRequestTenantCaller("TENANT.LEAVE_REQUEST.READ")))
				.andExpect(status().isOk());

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						leaveRequestType.getId(),
						null))
						.with(leaveRequestTenantCaller("TENANT.LEAVE_REQUEST.READ")))
				.andExpect(status().isForbidden());

		LeaveRequest submittedForApprove = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);
		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", submittedForApprove.getId())
						.with(leaveRequestTenantCaller("TENANT.LEAVE_REQUEST.READ")))
				.andExpect(status().isForbidden());

		LeaveRequest submittedForUpdate = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);
		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", submittedForUpdate.getId())
						.with(leaveRequestTenantCaller("TENANT.LEAVE_REQUEST.UPDATE")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("APPROVED"));

		mockMvc.perform(delete("/api/admin/leave-requests/{leaveRequestId}", leaveRequest.getId())
						.with(leaveRequestPlatformCaller("PLATFORM.LEAVE_REQUEST.DELETE")))
				.andExpect(status().isNoContent());

		LeaveRequest submittedForManage = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);
		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/reject", submittedForManage.getId())
						.with(leaveRequestPlatformCaller("PLATFORM.LEAVE_REQUEST.MANAGE")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("REJECTED"));
	}

	@Test
	void leaveRequestAdministrationAllowsCreateWithTenantJwtAndCreatePermission() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_20",
				"Claude",
				"Shannon",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_19",
				"Task 068.3 JWT Create",
				true);
		UserAccount userAccount = saveTenantAdminUser(
				"task0683.leave.create@example.com",
				VALID_PASSWORD,
				"TENANT.LEAVE_REQUEST.CREATE");
		String accessToken = loginAndReadToken(userAccount.getEmail(), VALID_PASSWORD);

		mockMvc.perform(get("/api/auth/me")
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.authorities[?(@=='TENANT.LEAVE_REQUEST.CREATE')]").exists());

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						leaveRequestType.getId(),
						null))
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("DRAFT"));
	}

	@Test
	void leaveRequestAdministrationRejectsCreateWithTenantJwtWhenCallerHasOnlyReadPermission() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0683_EMPLOYEE_21",
				"John",
				"Backus",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0683_TYPE_20",
				"Task 068.3 JWT Read Only",
				true);
		UserAccount userAccount = saveTenantAdminUser(
				"task0683.leave.read@example.com",
				VALID_PASSWORD,
				"TENANT.LEAVE_REQUEST.READ");
		String accessToken = loginAndReadToken(userAccount.getEmail(), VALID_PASSWORD);

		mockMvc.perform(postJson("/api/admin/leave-requests", createRequest(
						FOUNDATION_TENANT_ID,
						employee.getId(),
						leaveRequestType.getId(),
						null))
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void leaveRequestAdministrationAllowsApproveWithTenantJwtAndUpdatePermission() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0688_EMPLOYEE_4",
				"Update",
				"JwtApprove",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0688_TYPE_4",
				"Task 068.8 JWT Update Approve",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);
		UserAccount userAccount = saveTenantAdminUser(
				"task0688.leave.update@example.com",
				VALID_PASSWORD,
				"TENANT.LEAVE_REQUEST.UPDATE");
		String accessToken = loginAndReadToken(userAccount.getEmail(), VALID_PASSWORD);

		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", leaveRequest.getId())
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("APPROVED"));
	}

	@Test
	void leaveRequestAdministrationRejectsApproveWithTenantJwtWhenCallerHasOnlyCreatePermission() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0688_EMPLOYEE_5",
				"Create",
				"JwtApprove",
				true);
		LeaveRequestType leaveRequestType = saveLeaveRequestType(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				"TASK0688_TYPE_5",
				"Task 068.8 JWT Create Approve",
				true);
		LeaveRequest leaveRequest = saveLeaveRequest(employee, leaveRequestType, LeaveRequestStatus.SUBMITTED);
		UserAccount userAccount = saveTenantAdminUser(
				"task0688.leave.create-only@example.com",
				VALID_PASSWORD,
				"TENANT.LEAVE_REQUEST.CREATE");
		String accessToken = loginAndReadToken(userAccount.getEmail(), VALID_PASSWORD);

		mockMvc.perform(post("/api/admin/leave-requests/{leaveRequestId}/approve", leaveRequest.getId())
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void openApiIncludesLeaveRequestAdministrationEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}'].delete").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}/approve']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}/reject']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}/approve'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/leave-requests/{leaveRequestId}/reject'].post").exists());
	}

	private String loginAndReadToken(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest(email, password))))
				.andExpect(status().isOk())
				.andReturn();
		return objectMapper.readTree(result.getResponse().getContentAsString()).get("accessToken").asText();
	}

	private Map<String, String> loginRequest(String email, String password) {
		Map<String, String> request = new LinkedHashMap<>();
		request.put("email", email);
		request.put("password", password);
		return request;
	}

	private UserAccount saveTenantAdminUser(String email, String password, String... permissionCodes) {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		UserAccount userAccount = new UserAccount();
		userAccount.setTenant(tenant);
		userAccount.setUserType(userTypeRepository.findById(TENANT_ADMIN_USER_TYPE_ID).orElseThrow());
		userAccount.setAuthenticationMethod(authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID).orElseThrow());
		userAccount.setEmail(email);
		userAccount.setPasswordHash(passwordEncoder.encode(password));
		userAccount.setActive(true);
		userAccount.setLocked(false);
		UserAccount savedUserAccount = userAccountRepository.saveAndFlush(userAccount);
		assignPermissions(savedUserAccount, permissionCodes);
		return savedUserAccount;
	}

	private void assignPermissions(UserAccount userAccount, String... permissionCodes) {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		UserTenantAccess tenantAccess = new UserTenantAccess();
		tenantAccess.setUserAccount(userAccount);
		tenantAccess.setTenant(tenant);
		tenantAccess.setAccessRole("TENANT_ADMIN");
		tenantAccess.setActive(true);
		userTenantAccessRepository.saveAndFlush(tenantAccess);

		Role role = new Role();
		role.setTenantId(FOUNDATION_TENANT_ID);
		role.setCode("LEAVE_TEST_" + userAccount.getId().toString().replace("-", "").substring(0, 12).toUpperCase(Locale.ROOT));
		role.setName("Leave request test role");
		role.setSystemRole(false);
		role.setActive(true);
		role = roleRepository.saveAndFlush(role);

		UserRole userRole = new UserRole();
		userRole.setTenant(tenant);
		userRole.setUserAccount(userAccount);
		userRole.setRole(role);
		userRoleRepository.saveAndFlush(userRole);

		for (String permissionCode : permissionCodes) {
			Permission permission = permissionRepository.findAll().stream()
					.filter(candidate -> FOUNDATION_TENANT_ID.equals(candidate.getTenantId()))
					.filter(candidate -> permissionCode.equals(candidate.getCode()))
					.findFirst()
					.orElseThrow();
			RolePermission rolePermission = new RolePermission();
			rolePermission.setTenant(tenant);
			rolePermission.setRole(role);
			rolePermission.setPermission(permission);
			rolePermissionRepository.saveAndFlush(rolePermission);
		}
	}

	private Tenant saveTenant(String code) {
		Tenant foundationTenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		Tenant tenant = new Tenant();
		tenant.setCode(code);
		tenant.setName(code);
		tenant.setLegalName(code + " Legal");
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
		companyProfile.setLegalName(code + " Legal");
		companyProfile.setTradeName(code);
		companyProfile.setCountry(baseCompanyProfile.getCountry());
		companyProfile.setStreet("Task 068.3 Street");
		companyProfile.setStreetNumber("1");
		companyProfile.setActive(true);
		return companyProfileRepository.saveAndFlush(companyProfile);
	}

	private LeaveRequestType saveLeaveRequestType(Tenant tenant, String code, String name, boolean active) {
		LeaveRequestType leaveRequestType = new LeaveRequestType();
		leaveRequestType.setTenantId(tenant.getId());
		leaveRequestType.setCode(code);
		leaveRequestType.setName(name);
		leaveRequestType.setRequiresApproval(true);
		leaveRequestType.setActive(active);
		return leaveRequestTypeRepository.saveAndFlush(leaveRequestType);
	}

	private Employee saveEmployee(
			Tenant tenant,
			CompanyProfile companyProfile,
			String employeeCode,
			String firstName,
			String lastName,
			boolean active) {
		Employee employee = new Employee();
		employee.setTenant(tenant);
		employee.setCompany(companyProfile);
		employee.setEmployeeCode(employeeCode);
		employee.setFirstName(firstName);
		employee.setLastName(lastName);
		employee.setEmail(employeeCode.toLowerCase(Locale.ROOT) + "@example.com");
		employee.setEmploymentStatus("ACTIVE");
		employee.setActive(active);
		return employeeRepository.saveAndFlush(employee);
	}

	private LeaveRequest saveLeaveRequest(Employee employee, LeaveRequestType leaveRequestType, LeaveRequestStatus status) {
		LeaveRequest leaveRequest = new LeaveRequest();
		leaveRequest.setTenant(employee.getTenant());
		leaveRequest.setCompanyProfile(employee.getCompany());
		leaveRequest.setEmployee(employee);
		leaveRequest.setLeaveRequestType(leaveRequestType);
		leaveRequest.setStartDate(LocalDate.of(2026, 8, 1));
		leaveRequest.setEndDate(LocalDate.of(2026, 8, 3));
		leaveRequest.setDurationDays(new BigDecimal("3.00"));
		leaveRequest.setDeductFromBalance(true);
		leaveRequest.setDeductedDays(new BigDecimal("3.000"));
		leaveRequest.setReason("Initial leave request");
		leaveRequest.setStatus(status);
		leaveRequest.setUrgent(false);
		return leaveRequestRepository.saveAndFlush(leaveRequest);
	}

	private Map<String, Object> createRequest(
			UUID tenantId,
			UUID employeeId,
			UUID leaveRequestTypeId,
			String status) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", tenantId);
		request.put("employeeId", employeeId);
		request.put("leaveRequestTypeId", leaveRequestTypeId);
		request.put("startDate", "2026-08-10");
		request.put("endDate", "2026-08-12");
		request.put("durationDays", "3.00");
		request.put("deductFromBalance", true);
		request.put("deductedDays", "3.000");
		request.put("reason", " Planned leave ");
		request.put("comments", " Admin created ");
		request.put("urgent", false);
		request.put("urgentReason", null);
		if (status != null) {
			request.put("status", status);
		}
		return request;
	}

	private Map<String, Object> updateRequest(UUID employeeId, UUID leaveRequestTypeId, String status) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("employeeId", employeeId);
		request.put("leaveRequestTypeId", leaveRequestTypeId);
		request.put("startDate", "2026-09-01");
		request.put("endDate", "2026-09-02");
		request.put("durationDays", "2.00");
		request.put("deductFromBalance", true);
		request.put("deductedDays", "2.000");
		request.put("reason", " Updated leave reason ");
		request.put("status", status);
		request.put("comments", " Updated by admin ");
		request.put("urgent", true);
		request.put("urgentReason", " Urgent schedule change ");
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

	private RequestPostProcessor leaveRequestTenantCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {
						"TENANT.LEAVE_REQUEST.READ",
						"TENANT.LEAVE_REQUEST.CREATE",
						"TENANT.LEAVE_REQUEST.UPDATE",
						"TENANT.LEAVE_REQUEST.DELETE"
				}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_TENANT_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("tenant.leave.admin@example.com")
						.claim("userId", TENANT_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "TENANT_ADMIN"))
				.authorities(grantedAuthorities);
	}

	private RequestPostProcessor leaveRequestPlatformCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {
						"PLATFORM.LEAVE_REQUEST.READ",
						"PLATFORM.LEAVE_REQUEST.CREATE",
						"PLATFORM.LEAVE_REQUEST.UPDATE",
						"PLATFORM.LEAVE_REQUEST.DELETE"
				}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_PLATFORM_SUPER_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("platform.leave.admin@example.com")
						.claim("userId", PLATFORM_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "PLATFORM_SUPER_ADMIN"))
				.authorities(grantedAuthorities);
	}
}
