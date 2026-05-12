package com.odsoftware.hrm;

import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.OfficeLocationRepository;
import com.odsoftware.hrm.repository.core.SmtpConfigurationRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.entity.audit.AuditLog;
import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import com.odsoftware.hrm.entity.contract.Contract;
import com.odsoftware.hrm.entity.device.Device;
import com.odsoftware.hrm.entity.disciplinary.EmployeeDisciplinaryAction;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.leave.LeaveRequest;
import com.odsoftware.hrm.entity.leave.LeaveRequestStatus;
import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.AuditActionType;
import com.odsoftware.hrm.entity.master.ContractType;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.LeaveRequestType;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.payroll.PayrollDocument;
import com.odsoftware.hrm.entity.payroll.PayrollDocumentStatus;
import com.odsoftware.hrm.entity.master.Region;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import com.odsoftware.hrm.entity.master.TimeZone;
import com.odsoftware.hrm.repository.audit.AuditLogRepository;
import com.odsoftware.hrm.repository.calendar.HolidayCalendarRepository;
import com.odsoftware.hrm.repository.contract.ContractRepository;
import com.odsoftware.hrm.repository.device.DeviceRepository;
import com.odsoftware.hrm.repository.disciplinary.EmployeeDisciplinaryActionRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.leave.LeaveRequestRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import com.odsoftware.hrm.repository.payroll.PayrollDocumentRepository;
import com.odsoftware.hrm.repository.master.ApprovalStatusRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.AuditActionTypeRepository;
import com.odsoftware.hrm.repository.master.AreaRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.ContractTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.DeviceBrandRepository;
import com.odsoftware.hrm.repository.master.DeviceStatusRepository;
import com.odsoftware.hrm.repository.master.DeviceTypeRepository;
import com.odsoftware.hrm.repository.master.DisciplinaryActionTypeRepository;
import com.odsoftware.hrm.repository.master.DocumentTypeRepository;
import com.odsoftware.hrm.repository.master.GenderRepository;
import com.odsoftware.hrm.repository.master.LeaveRequestTypeRepository;
import com.odsoftware.hrm.repository.master.MaritalStatusRepository;
import com.odsoftware.hrm.repository.master.OfficeLocationTypeRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RegionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.SmtpEncryptionTypeRepository;
import com.odsoftware.hrm.repository.master.TimeZoneRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.master.WorkModeRepository;
import com.odsoftware.hrm.security.permission.PermissionAction;
import com.odsoftware.hrm.security.permission.PermissionCode;
import com.odsoftware.hrm.security.permission.PermissionResource;
import com.odsoftware.hrm.security.permission.PermissionScope;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class HrmBackendApplicationTests {

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private RegionRepository regionRepository;

	@Autowired
	private AreaRepository areaRepository;

	@Autowired
	private CurrencyRepository currencyRepository;

	@Autowired
	private GenderRepository genderRepository;

	@Autowired
	private MaritalStatusRepository maritalStatusRepository;

	@Autowired
	private ApprovalStatusRepository approvalStatusRepository;

	@Autowired
	private WorkModeRepository workModeRepository;

	@Autowired
	private DocumentTypeRepository documentTypeRepository;

	@Autowired
	private LeaveRequestTypeRepository leaveRequestTypeRepository;

	@Autowired
	private DeviceTypeRepository deviceTypeRepository;

	@Autowired
	private DeviceBrandRepository deviceBrandRepository;

	@Autowired
	private DeviceStatusRepository deviceStatusRepository;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private AuthenticationMethodRepository authenticationMethodRepository;

	@Autowired
	private AuditActionTypeRepository auditActionTypeRepository;

	@Autowired
	private DisciplinaryActionTypeRepository disciplinaryActionTypeRepository;

	@Autowired
	private SmtpEncryptionTypeRepository smtpEncryptionTypeRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PermissionRepository permissionRepository;

	@Autowired
	private CompanyProfileTypeRepository companyProfileTypeRepository;

	@Autowired
	private OfficeLocationTypeRepository officeLocationTypeRepository;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private CompanyProfileRepository companyProfileRepository;

	@Autowired
	private OfficeLocationRepository officeLocationRepository;

	@Autowired
	private SmtpConfigurationRepository smtpConfigurationRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private ContractTypeRepository contractTypeRepository;

	@Autowired
	private ContractRepository contractRepository;

	@Autowired
	private TimeZoneRepository timeZoneRepository;

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RolePermissionRepository rolePermissionRepository;

	@Autowired
	private UserTenantAccessRepository userTenantAccessRepository;

	@Autowired
	private DeviceRepository deviceRepository;

	@Autowired
	private PayrollDocumentRepository payrollDocumentRepository;

	@Autowired
	private LeaveRequestRepository leaveRequestRepository;

	@Autowired
	private HolidayCalendarRepository holidayCalendarRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private EmployeeDisciplinaryActionRepository employeeDisciplinaryActionRepository;

	@Autowired
	private MockMvc mockMvc;

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_OFFICE_ID = UUID.fromString("81000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_CURRENCY_ID = UUID.fromString("10000000-0000-0000-0000-000000000001");
	private static final UUID ITALY_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000003");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");
	private static final UUID CREATE_AUDIT_ACTION_TYPE_ID = UUID.fromString("72000000-0000-0000-0000-000000000001");
	private static final UUID UPDATE_AUDIT_ACTION_TYPE_ID = UUID.fromString("72000000-0000-0000-0000-000000000002");
	private static final UUID WARNING_DISCIPLINARY_ACTION_TYPE_ID = UUID.fromString("73000000-0000-0000-0000-000000000001");
	private static final UUID SUSPENSION_DISCIPLINARY_ACTION_TYPE_ID = UUID.fromString("73000000-0000-0000-0000-000000000002");
	private static final UUID TENANT_ADMIN_ROLE_ID = UUID.fromString("75000000-0000-0000-0000-000000000001");
	private static final UUID EMPLOYEE_READ_PERMISSION_ID = UUID.fromString("76000000-0000-0000-0000-000000000001");
	private static final UUID EMPLOYEE_WRITE_PERMISSION_ID = UUID.fromString("76000000-0000-0000-0000-000000000002");
	private static final UUID LAPTOP_DEVICE_TYPE_ID = UUID.fromString("62000000-0000-0000-0000-000000000001");
	private static final UUID DELL_DEVICE_BRAND_ID = UUID.fromString("63000000-0000-0000-0000-000000000001");
	private static final UUID AVAILABLE_DEVICE_STATUS_ID = UUID.fromString("64000000-0000-0000-0000-000000000001");
	private static final UUID ASSIGNED_DEVICE_STATUS_ID = UUID.fromString("64000000-0000-0000-0000-000000000002");
	private static final UUID PAYSLIP_DOCUMENT_TYPE_ID = UUID.fromString("61000000-0000-0000-0000-000000000001");

	@Test
	void contextLoads() {
	}

	@Test
	void flywayMigrationSeedsGlobalMasterTables() {
		assertThat(currencyRepository.count()).isEqualTo(2);
		assertThat(countryRepository.count()).isEqualTo(249);
		assertThat(genderRepository.count()).isEqualTo(3);
		assertThat(maritalStatusRepository.count()).isEqualTo(4);
		assertThat(approvalStatusRepository.count()).isEqualTo(4);
	}

	@Test
	void flywayMigrationSeedsTenantHrBusinessMasterTables() {
		assertThat(workModeRepository.count()).isEqualTo(3);
		assertThat(documentTypeRepository.count()).isEqualTo(5);
		assertThat(deviceTypeRepository.count()).isEqualTo(4);
		assertThat(deviceBrandRepository.count()).isEqualTo(5);
		assertThat(deviceStatusRepository.count()).isEqualTo(4);
	}

	@Test
	void flywayMigrationSeedsGovernanceSecurityMasterTables() {
		assertThat(userTypeRepository.count()).isEqualTo(4);
		assertThat(authenticationMethodRepository.count()).isEqualTo(4);
		assertThat(auditActionTypeRepository.count()).isEqualTo(6);
		assertThat(disciplinaryActionTypeRepository.count()).isEqualTo(3);
		assertThat(smtpEncryptionTypeRepository.count()).isEqualTo(3);
		assertThat(roleRepository.findAll())
				.extracting(role -> role.getCode())
				.contains("TENANT_ADMIN", "HR_MANAGER", "SUPERVISOR");
		assertThat(permissionRepository.count()).isEqualTo(100);
		assertThat(companyProfileTypeRepository.count()).isEqualTo(2);
		assertThat(officeLocationTypeRepository.count()).isEqualTo(3);
	}

	@Test
	void flywayMigrationSeedsPermissionCodeMatrixByScopeResourceAction() {
		assertThat(permissionRepository.findAll())
				.extracting(Permission::getCode)
				.contains(
						PermissionCode.of(PermissionScope.PLATFORM, PermissionResource.TENANT, PermissionAction.MANAGE),
						PermissionCode.of(PermissionScope.TENANT, PermissionResource.USER, PermissionAction.READ),
						PermissionCode.of(PermissionScope.TENANT, PermissionResource.MASTER_DATA, PermissionAction.MANAGE),
						PermissionCode.of(PermissionScope.TENANT, PermissionResource.PAYROLL_DOCUMENT, PermissionAction.READ))
				.allMatch(PermissionCode::isValid)
				.noneMatch(code -> code.startsWith("TENANT.MASTER_DATA.") && code.split("\\.").length > 3);

		assertThat(permissionRepository.findAll())
				.allMatch(permission -> Boolean.TRUE.equals(permission.getSystemPermission()));
	}

	@Test
	void flywayMigrationCreatesTenantCompanyOfficeAndSmtpFoundation() {
		assertThat(tenantRepository.count()).isEqualTo(1);
		assertThat(companyProfileRepository.count()).isEqualTo(1);
		assertThat(officeLocationRepository.count()).isEqualTo(1);
		assertThat(smtpConfigurationRepository.count()).isEqualTo(1);
	}

	@Test
	void flywayMigrationCreatesEmployeeCoreFoundation() {
		assertThatCode(() -> employeeRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesContractGovernanceFoundation() {
		assertThatCode(() -> contractRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesUserAccountIdentitySecurityFoundation() {
		assertThatCode(() -> userAccountRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesRbacBridgeFoundation() {
		assertThatCode(() -> userRoleRepository.count()).doesNotThrowAnyException();
		assertThatCode(() -> rolePermissionRepository.count()).doesNotThrowAnyException();
		assertThatCode(() -> userTenantAccessRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationBootstrapsTenantAdminCrudPermissionsForProtectedModules() {
		assertThat(rolePermissionRepository.findPermissionCodesByTenantIdAndRoleId(FOUNDATION_TENANT_ID, TENANT_ADMIN_ROLE_ID))
				.contains(
						"TENANT.MASTER_DATA.READ",
						"TENANT.MASTER_DATA.CREATE",
						"TENANT.MASTER_DATA.UPDATE",
						"TENANT.MASTER_DATA.DELETE",
						"TENANT.USER.READ",
						"TENANT.USER.CREATE",
						"TENANT.USER.UPDATE",
						"TENANT.USER.DELETE",
						"TENANT.ROLE.READ",
						"TENANT.ROLE.CREATE",
						"TENANT.ROLE.UPDATE",
						"TENANT.ROLE.DELETE",
						"TENANT.PERMISSION.READ",
						"TENANT.PERMISSION.CREATE",
						"TENANT.PERMISSION.UPDATE",
						"TENANT.PERMISSION.DELETE");
	}

	@Test
	void flywayMigrationCreatesDeviceBackendFoundation() {
		assertThatCode(() -> deviceRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesPayrollDocumentBackendFoundation() {
		assertThatCode(() -> payrollDocumentRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesLeaveRequestBackendFoundation() {
		assertThatCode(() -> leaveRequestRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesHolidayCalendarBackendFoundation() {
		assertThatCode(() -> holidayCalendarRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesAuditLogBackendFoundation() {
		assertThatCode(() -> auditLogRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void flywayMigrationCreatesEmployeeDisciplinaryActionBackendFoundation() {
		assertThatCode(() -> employeeDisciplinaryActionRepository.count()).doesNotThrowAnyException();
	}

	@Test
	void employeeRepositoryPersistsEmployee() {
		Employee employee = newEmployee("EMP-001");

		Employee saved = employeeRepository.saveAndFlush(employee);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getUpdatedAt()).isNotNull();
		assertThat(saved.getHireDate()).isEqualTo(LocalDate.of(2026, 5, 2));
		assertThat(saved.getResidenceCity()).isEqualTo("Rome");
		assertThat(saved.getNationalIdentifierType()).isEqualTo("FISCAL_CODE");
		assertThat(saved.getActive()).isTrue();
		assertThat(employeeRepository.findByTenant_IdAndEmployeeCode(FOUNDATION_TENANT_ID, "EMP-001")).isPresent();
	}

	@Test
	void employeeRepositoryEnforcesUniqueTenantEmployeeCode() {
		employeeRepository.saveAndFlush(newEmployee("EMP-DUP"));

		assertThatThrownBy(() -> employeeRepository.saveAndFlush(newEmployee("EMP-DUP")))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void contractRepositoryPersistsContract() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-CONTRACT"));
		ContractType contractType = contractTypeRepository.saveAndFlush(newContractType("TASK_018_CONTRACT"));

		Contract contract = new Contract();
		contract.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		contract.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		contract.setEmployee(employee);
		contract.setContractType(contractType);
		contract.setCurrency(currencyRepository.findById(FOUNDATION_CURRENCY_ID).orElseThrow());
		contract.setStartDate(LocalDate.of(2026, 5, 2));
		contract.setEndDate(LocalDate.of(2027, 5, 1));
		contract.setBaseSalary(new BigDecimal("42000.00"));
		contract.setWeeklyHours(new BigDecimal("40.00"));

		Contract saved = contractRepository.saveAndFlush(contract);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getUpdatedAt()).isNotNull();
		assertThat(saved.getStartDate()).isEqualTo(LocalDate.of(2026, 5, 2));
		assertThat(saved.getEndDate()).isEqualTo(LocalDate.of(2027, 5, 1));
		assertThat(saved.getBaseSalary()).isEqualByComparingTo("42000.00");
		assertThat(saved.getWeeklyHours()).isEqualByComparingTo("40.00");
		assertThat(saved.getActive()).isTrue();
		assertThat(contractRepository.findByTenant_IdAndEmployee_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
	}

	@Test
	void userAccountRepositoryPersistsTenantLevelAccountWithNullableCompanyAndEmployee() {
		TimeZone timeZone = timeZoneRepository.saveAndFlush(newTimeZone("Europe/Rome"));

		UserAccount userAccount = newUserAccount("tenant.admin@example.com");
		userAccount.setPasswordHash(null);
		userAccount.setCompanyProfile(null);
		userAccount.setEmployee(null);
		userAccount.setPrimaryTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		userAccount.setTimeZone(timeZone);
		userAccount.setPreferredLanguage("it");
		userAccount.setStrongAuthenticationRequired(true);
		userAccount.setEmailOtpEnabled(true);
		userAccount.setFailedLoginAttempts(2);

		UserAccount saved = userAccountRepository.saveAndFlush(userAccount);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getUpdatedAt()).isNotNull();
		assertThat(saved.getCompanyProfile()).isNull();
		assertThat(saved.getEmployee()).isNull();
		assertThat(saved.getPasswordHash()).isNull();
		assertThat(saved.getStrongAuthenticationRequired()).isTrue();
		assertThat(saved.getEmailOtpEnabled()).isTrue();
		assertThat(saved.getAppOtpEnabled()).isFalse();
		assertThat(saved.getFailedLoginAttempts()).isEqualTo(2);
		assertThat(saved.getLocked()).isFalse();
		assertThat(saved.getActive()).isTrue();
		assertThat(userAccountRepository.findByTenant_IdAndEmail(FOUNDATION_TENANT_ID, "tenant.admin@example.com")).isPresent();
	}

	@Test
	void userAccountRepositoryEnforcesUniqueTenantEmail() {
		userAccountRepository.saveAndFlush(newUserAccount("duplicate.user@example.com"));

		assertThatThrownBy(() -> userAccountRepository.saveAndFlush(newUserAccount("duplicate.user@example.com")))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void rbacBridgeRepositoriesPersistBridgeRows() {
		UserAccount userAccount = userAccountRepository.saveAndFlush(newUserAccount("rbac.user@example.com"));

		UserRole userRole = userRoleRepository.saveAndFlush(newUserRole(userAccount));
		RolePermission rolePermission = rolePermissionRepository.saveAndFlush(newRolePermission(EMPLOYEE_READ_PERMISSION_ID));
		UserTenantAccess userTenantAccess = userTenantAccessRepository.saveAndFlush(newUserTenantAccess(userAccount));

		assertThat(userRole.getId()).isNotNull();
		assertThat(rolePermission.getId()).isNotNull();
		assertThat(userTenantAccess.getId()).isNotNull();
		assertThat(userTenantAccess.getAccessRole()).isEqualTo("TENANT_ADMIN");
		assertThat(userTenantAccess.getCreatedAt()).isNotNull();
		assertThat(userTenantAccess.getUpdatedAt()).isNotNull();
		assertThat(userRoleRepository.findByTenant_IdAndUserAccount_Id(FOUNDATION_TENANT_ID, userAccount.getId())).hasSize(1);
		assertThat(rolePermissionRepository.findByTenant_IdAndRole_Id(FOUNDATION_TENANT_ID, TENANT_ADMIN_ROLE_ID))
				.extracting((RolePermission assignment) -> assignment.getPermission().getId())
				.contains(EMPLOYEE_READ_PERMISSION_ID);
		assertThat(userTenantAccessRepository.findByUserAccount_IdAndTenant_Id(userAccount.getId(), FOUNDATION_TENANT_ID)).isPresent();
	}

	@Test
	void rbacBridgeRepositoriesEnforceUniqueConstraints() {
		UserAccount userAccount = userAccountRepository.saveAndFlush(newUserAccount("rbac.unique@example.com"));

		userRoleRepository.saveAndFlush(newUserRole(userAccount));
		assertThatThrownBy(() -> userRoleRepository.saveAndFlush(newUserRole(userAccount)))
				.isInstanceOf(DataIntegrityViolationException.class);

		rolePermissionRepository.saveAndFlush(newRolePermission(EMPLOYEE_WRITE_PERMISSION_ID));
		assertThatThrownBy(() -> rolePermissionRepository.saveAndFlush(newRolePermission(EMPLOYEE_WRITE_PERMISSION_ID)))
				.isInstanceOf(DataIntegrityViolationException.class);

		userTenantAccessRepository.saveAndFlush(newUserTenantAccess(userAccount));
		assertThatThrownBy(() -> userTenantAccessRepository.saveAndFlush(newUserTenantAccess(userAccount)))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void deviceRepositoryPersistsAssignedDevice() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-DEVICE"));

		Device device = newDevice("Foundation Laptop", "SN-DEVICE-001");
		device.setAssignedTo(employee);
		device.setAssignedAt(OffsetDateTime.now());
		device.setDeviceStatus(deviceStatusRepository.findById(ASSIGNED_DEVICE_STATUS_ID).orElseThrow());

		Device saved = deviceRepository.saveAndFlush(device);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getUpdatedAt()).isNotNull();
		assertThat(saved.getAssignedTo().getId()).isEqualTo(employee.getId());
		assertThat(saved.getAssignedAt()).isNotNull();
		assertThat(saved.getActive()).isTrue();
		assertThat(deviceRepository.findByTenant_IdAndCompanyProfile_Id(FOUNDATION_TENANT_ID, FOUNDATION_COMPANY_ID)).hasSize(1);
		assertThat(deviceRepository.findByTenant_IdAndAssignedTo_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
	}

	@Test
	void deviceRepositoryPersistsUnassignedDevice() {
		Device device = newDevice("Foundation Spare Laptop", "SN-DEVICE-002");

		Device saved = deviceRepository.saveAndFlush(device);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getAssignedTo()).isNull();
		assertThat(saved.getAssignedAt()).isNull();
		assertThat(saved.getDeviceStatus().getId()).isEqualTo(AVAILABLE_DEVICE_STATUS_ID);
	}

	@Test
	void payrollDocumentRepositoryPersistsDraftDocument() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-PAYROLL-DRAFT"));
		Contract contract = contractRepository.saveAndFlush(newContract(employee, "TASK_023_DRAFT_CONTRACT"));

		PayrollDocument payrollDocument = newPayrollDocument(employee, contract, 2026, 4);

		PayrollDocument saved = payrollDocumentRepository.saveAndFlush(payrollDocument);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getUpdatedAt()).isNotNull();
		assertThat(saved.getUploadedAt()).isNotNull();
		assertThat(saved.getEmployee().getId()).isEqualTo(employee.getId());
		assertThat(saved.getContract().getId()).isEqualTo(contract.getId());
		assertThat(saved.getDocumentType().getId()).isEqualTo(PAYSLIP_DOCUMENT_TYPE_ID);
		assertThat(saved.getStatus()).isEqualTo(PayrollDocumentStatus.DRAFT);
		assertThat(saved.getPublishedAt()).isNull();
		assertThat(saved.getOriginalFilename()).isEqualTo("payslip-april-2026.pdf");
		assertThat(saved.getStoredFilename()).isEqualTo("payroll-2026-04-anonymized.pdf");
		assertThat(saved.getFileSizeBytes()).isEqualTo(128000L);
		assertThat(saved.getChecksum()).isEqualTo("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
		assertThat(payrollDocumentRepository.findByTenant_IdAndEmployee_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
		assertThat(payrollDocumentRepository.findByTenant_IdAndEmployee_IdAndPeriodYearAndPeriodMonth(FOUNDATION_TENANT_ID, employee.getId(), 2026, 4)).hasSize(1);
		assertThat(payrollDocumentRepository.findByTenant_IdAndEmployee_IdAndDocumentType_IdAndPeriodYearAndPeriodMonth(FOUNDATION_TENANT_ID, employee.getId(), PAYSLIP_DOCUMENT_TYPE_ID, 2026, 4)).isPresent();
	}

	@Test
	void payrollDocumentRepositoryPersistsPublishedDocumentWithPublishedAt() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-PAYROLL-PUBLISHED"));
		Contract contract = contractRepository.saveAndFlush(newContract(employee, "TASK_023_PUBLISHED_CONTRACT"));

		PayrollDocument payrollDocument = newPayrollDocument(employee, contract, 2026, 5);
		OffsetDateTime publishedAt = OffsetDateTime.now();
		payrollDocument.setStatus(PayrollDocumentStatus.PUBLISHED);
		payrollDocument.setPublishedAt(publishedAt);
		payrollDocument.setIssuerName("HR Payroll Office");
		payrollDocument.setUploadedBy(userAccountRepository.saveAndFlush(newUserAccount("payroll.publisher@example.com")));

		PayrollDocument saved = payrollDocumentRepository.saveAndFlush(payrollDocument);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getStatus()).isEqualTo(PayrollDocumentStatus.PUBLISHED);
		assertThat(saved.getPublishedAt()).isEqualTo(publishedAt);
		assertThat(saved.getIssuerName()).isEqualTo("HR Payroll Office");
		assertThat(saved.getUploadedBy().getEmail()).isEqualTo("payroll.publisher@example.com");
		assertThat(payrollDocumentRepository.findByTenant_IdAndEmployee_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
		assertThat(payrollDocumentRepository.findByTenant_IdAndEmployee_IdAndPeriodYearAndPeriodMonth(FOUNDATION_TENANT_ID, employee.getId(), 2026, 5)).hasSize(1);
		assertThat(payrollDocumentRepository.findByTenant_IdAndEmployee_IdAndDocumentType_IdAndPeriodYearAndPeriodMonth(FOUNDATION_TENANT_ID, employee.getId(), PAYSLIP_DOCUMENT_TYPE_ID, 2026, 5)).isPresent();
	}

	@Test
	void leaveRequestRepositoryPersistsDraftRequest() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-LEAVE-DRAFT"));
		LeaveRequestType leaveRequestType = leaveRequestTypeRepository.saveAndFlush(newLeaveRequestType("TASK_024_VACATION"));

		LeaveRequest leaveRequest = newLeaveRequest(employee, leaveRequestType);

		LeaveRequest saved = leaveRequestRepository.saveAndFlush(leaveRequest);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getUpdatedAt()).isNotNull();
		assertThat(saved.getEmployee().getId()).isEqualTo(employee.getId());
		assertThat(saved.getLeaveRequestType().getId()).isEqualTo(leaveRequestType.getId());
		assertThat(saved.getStatus()).isEqualTo(LeaveRequestStatus.DRAFT);
		assertThat(saved.getStartDate()).isEqualTo(LocalDate.of(2026, 6, 1));
		assertThat(saved.getEndDate()).isEqualTo(LocalDate.of(2026, 6, 3));
		assertThat(saved.getDurationDays()).isEqualByComparingTo("3.00");
		assertThat(saved.getDeductFromBalance()).isTrue();
		assertThat(saved.getDeductedDays()).isEqualByComparingTo("3.000");
		assertThat(saved.getUrgent()).isFalse();
		assertThat(leaveRequestRepository.findByTenant_IdAndEmployee_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
		assertThat(leaveRequestRepository.findByTenant_IdAndEmployee_IdAndStatus(FOUNDATION_TENANT_ID, employee.getId(), LeaveRequestStatus.DRAFT)).hasSize(1);
		assertThat(leaveRequestRepository.findByTenant_IdAndCompanyProfile_Id(FOUNDATION_TENANT_ID, FOUNDATION_COMPANY_ID)).hasSize(1);
	}

	@Test
	void leaveRequestRepositoryPersistsApprovedRequestWithApprover() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-LEAVE-APPROVED"));
		Employee approver = employeeRepository.saveAndFlush(newEmployee("EMP-LEAVE-APPROVER"));
		LeaveRequestType leaveRequestType = leaveRequestTypeRepository.saveAndFlush(newLeaveRequestType("TASK_024_PERMISSION"));

		LeaveRequest leaveRequest = newLeaveRequest(employee, leaveRequestType);
		leaveRequest.setStatus(LeaveRequestStatus.APPROVED);
		leaveRequest.setApprover(approver);
		leaveRequest.setComments("Approved by manager");
		leaveRequest.setUrgent(true);
		leaveRequest.setUrgentReason("Family emergency");

		LeaveRequest saved = leaveRequestRepository.saveAndFlush(leaveRequest);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getStatus()).isEqualTo(LeaveRequestStatus.APPROVED);
		assertThat(saved.getApprover().getId()).isEqualTo(approver.getId());
		assertThat(saved.getComments()).isEqualTo("Approved by manager");
		assertThat(saved.getUrgent()).isTrue();
		assertThat(saved.getUrgentReason()).isEqualTo("Family emergency");
		assertThat(leaveRequestRepository.findByTenant_IdAndEmployee_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
		assertThat(leaveRequestRepository.findByTenant_IdAndEmployee_IdAndStatus(FOUNDATION_TENANT_ID, employee.getId(), LeaveRequestStatus.APPROVED)).hasSize(1);
	}

	@Test
	void leaveRequestRepositoryEnforcesDateRangeConstraint() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-LEAVE-DATE-RANGE"));
		LeaveRequestType leaveRequestType = leaveRequestTypeRepository.saveAndFlush(newLeaveRequestType("TASK_024_DATE_RANGE"));
		LeaveRequest leaveRequest = newLeaveRequest(employee, leaveRequestType);
		leaveRequest.setStartDate(LocalDate.of(2026, 6, 5));
		leaveRequest.setEndDate(LocalDate.of(2026, 6, 1));

		assertThatThrownBy(() -> leaveRequestRepository.saveAndFlush(leaveRequest))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void leaveRequestRepositoryRequiresReasonForUrgentRequest() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-LEAVE-URGENT"));
		LeaveRequestType leaveRequestType = leaveRequestTypeRepository.saveAndFlush(newLeaveRequestType("TASK_024_URGENT"));
		LeaveRequest leaveRequest = newLeaveRequest(employee, leaveRequestType);
		leaveRequest.setUrgent(true);
		leaveRequest.setUrgentReason(null);

		assertThatThrownBy(() -> leaveRequestRepository.saveAndFlush(leaveRequest))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void holidayCalendarRepositoryPersistsHolidayCalendar() {
		Country country = countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow();
		Region region = regionRepository.saveAndFlush(newRegion(country, "TASK_025_REGION_PERSIST"));
		Area area = areaRepository.saveAndFlush(newArea(country, region, "TASK_025_AREA_PERSIST"));

		HolidayCalendar holidayCalendar = newHolidayCalendar(country, region, area, "TASK 025 Calendar");

		HolidayCalendar saved = holidayCalendarRepository.saveAndFlush(holidayCalendar);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCountry().getId()).isEqualTo(country.getId());
		assertThat(saved.getRegion().getId()).isEqualTo(region.getId());
		assertThat(saved.getArea().getId()).isEqualTo(area.getId());
		assertThat(saved.getStartDate()).isEqualTo(LocalDate.of(2026, 1, 1));
		assertThat(saved.getEndDate()).isEqualTo(LocalDate.of(2026, 12, 31));
		assertThat(saved.getName()).isEqualTo("TASK 025 Calendar");
		assertThat(saved.getActive()).isTrue();
	}

	@Test
	void holidayCalendarRepositoryFindsByCountryRegionAndArea() {
		Country country = countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow();
		Region region = regionRepository.saveAndFlush(newRegion(country, "TASK_025_REGION_QUERY"));
		Area area = areaRepository.saveAndFlush(newArea(country, region, "TASK_025_AREA_QUERY"));
		holidayCalendarRepository.saveAndFlush(newHolidayCalendar(country, region, area, "TASK 025 Query Calendar"));

		assertThat(holidayCalendarRepository.findByCountry_Id(country.getId())).hasSize(1);
		assertThat(holidayCalendarRepository.findByCountry_IdAndRegion_Id(country.getId(), region.getId())).hasSize(1);
		assertThat(holidayCalendarRepository.findByCountry_IdAndRegion_IdAndArea_Id(country.getId(), region.getId(), area.getId())).hasSize(1);
		assertThat(holidayCalendarRepository.findByCountry_IdAndActiveTrue(country.getId())).hasSize(1);
	}

	@Test
	void holidayCalendarRepositoryEnforcesDateRangeConstraint() {
		Country country = countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow();
		HolidayCalendar holidayCalendar = newHolidayCalendar(country, null, null, "TASK 025 Invalid Range Calendar");
		holidayCalendar.setStartDate(LocalDate.of(2026, 12, 31));
		holidayCalendar.setEndDate(LocalDate.of(2026, 1, 1));

		assertThatThrownBy(() -> holidayCalendarRepository.saveAndFlush(holidayCalendar))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void holidayCalendarRepositoryRequiresName() {
		Country country = countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow();
		HolidayCalendar holidayCalendar = newHolidayCalendar(country, null, null, "TASK 025 Missing Name Calendar");
		holidayCalendar.setName(null);

		assertThatThrownBy(() -> holidayCalendarRepository.saveAndFlush(holidayCalendar))
				.isInstanceOf(jakarta.validation.ConstraintViolationException.class);
	}

	@Test
	void auditLogRepositoryPersistsSystemAuditLog() {
		AuditLog auditLog = newAuditLog("TENANT", FOUNDATION_TENANT_ID);

		AuditLog saved = auditLogRepository.saveAndFlush(auditLog);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getTenant().getId()).isEqualTo(FOUNDATION_TENANT_ID);
		assertThat(saved.getCompanyProfile()).isNull();
		assertThat(saved.getUserAccount()).isNull();
		assertThat(saved.getAuditActionType().getId()).isEqualTo(CREATE_AUDIT_ACTION_TYPE_ID);
		assertThat(saved.getEntityType()).isEqualTo("TENANT");
		assertThat(saved.getEntityId()).isEqualTo(FOUNDATION_TENANT_ID);
		assertThat(saved.getCreatedAt()).isNotNull();
		assertThat(saved.getSuccess()).isTrue();
		assertThat(saved.getSeverityLevel()).isEqualTo("LOW");
		assertThat(saved.getImpersonationMode()).isEqualTo("NONE");
		assertThat(auditLogRepository.findByTenant_Id(FOUNDATION_TENANT_ID)).extracting(AuditLog::getId).contains(saved.getId());
		assertThat(auditLogRepository.findByTenant_IdAndAuditActionType_Id(FOUNDATION_TENANT_ID, CREATE_AUDIT_ACTION_TYPE_ID)).extracting(AuditLog::getId).contains(saved.getId());
		assertThat(auditLogRepository.findByTenant_IdAndEntityTypeAndEntityId(FOUNDATION_TENANT_ID, "TENANT", FOUNDATION_TENANT_ID)).hasSize(1);
	}

	@Test
	void auditLogRepositoryPersistsUserAuditLogWithCompanyAndUser() {
		UserAccount userAccount = userAccountRepository.saveAndFlush(newUserAccount("audit.user@example.com"));
		AuditLog auditLog = newAuditLog("USER_ACCOUNT", userAccount.getId());
		auditLog.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		auditLog.setUserAccount(userAccount);
		auditLog.setAuditActionType(auditActionTypeRepository.findById(UPDATE_AUDIT_ACTION_TYPE_ID).orElseThrow());
		auditLog.setSeverityLevel("MEDIUM");
		auditLog.setSuccess(false);
		auditLog.setOldValueJson("{\"active\":true}");
		auditLog.setNewValueJson("{\"active\":false}");

		AuditLog saved = auditLogRepository.saveAndFlush(auditLog);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getCompanyProfile().getId()).isEqualTo(FOUNDATION_COMPANY_ID);
		assertThat(saved.getUserAccount().getId()).isEqualTo(userAccount.getId());
		assertThat(saved.getAuditActionType().getId()).isEqualTo(UPDATE_AUDIT_ACTION_TYPE_ID);
		assertThat(saved.getSeverityLevel()).isEqualTo("MEDIUM");
		assertThat(saved.getSuccess()).isFalse();
		assertThat(saved.getOldValueJson()).isEqualTo("{\"active\":true}");
		assertThat(saved.getNewValueJson()).isEqualTo("{\"active\":false}");
		assertThat(auditLogRepository.findByTenant_IdAndUserAccount_Id(FOUNDATION_TENANT_ID, userAccount.getId())).hasSize(1);
	}

	@Test
	void auditLogRepositoryPersistsTenantSwitchMetadata() {
		AuditLog auditLog = newAuditLog("TENANT_ACCESS", FOUNDATION_TENANT_ID);
		auditLog.setActingTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		auditLog.setTargetTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		auditLog.setImpersonationMode("TENANT_SWITCH");

		AuditLog saved = auditLogRepository.saveAndFlush(auditLog);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getActingTenant().getId()).isEqualTo(FOUNDATION_TENANT_ID);
		assertThat(saved.getTargetTenant().getId()).isEqualTo(FOUNDATION_TENANT_ID);
		assertThat(saved.getImpersonationMode()).isEqualTo("TENANT_SWITCH");
		assertThat(auditLogRepository.findByActingTenant_IdAndTargetTenant_Id(FOUNDATION_TENANT_ID, FOUNDATION_TENANT_ID)).hasSize(1);
	}

	@Test
	void auditLogRepositoryEnforcesSeverityLevelConstraint() {
		AuditLog auditLog = newAuditLog("TENANT", FOUNDATION_TENANT_ID);
		auditLog.setSeverityLevel("CRITICAL");

		assertThatThrownBy(() -> auditLogRepository.saveAndFlush(auditLog))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void auditLogRepositoryEnforcesImpersonationModeConstraint() {
		AuditLog auditLog = newAuditLog("TENANT", FOUNDATION_TENANT_ID);
		auditLog.setImpersonationMode("INVALID");

		assertThatThrownBy(() -> auditLogRepository.saveAndFlush(auditLog))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	@Test
	void employeeDisciplinaryActionRepositoryPersistsActionWithoutRelatedDocument() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-DISCIPLINARY-WARNING"));
		UserAccount issuer = userAccountRepository.saveAndFlush(newUserAccount("disciplinary.issuer@example.com"));
		EmployeeDisciplinaryAction action = newEmployeeDisciplinaryAction(employee, issuer, WARNING_DISCIPLINARY_ACTION_TYPE_ID);
		action.setDescription(null);

		EmployeeDisciplinaryAction saved = employeeDisciplinaryActionRepository.saveAndFlush(action);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getTenant().getId()).isEqualTo(FOUNDATION_TENANT_ID);
		assertThat(saved.getCompanyProfile().getId()).isEqualTo(FOUNDATION_COMPANY_ID);
		assertThat(saved.getEmployee().getId()).isEqualTo(employee.getId());
		assertThat(saved.getDisciplinaryActionType().getId()).isEqualTo(WARNING_DISCIPLINARY_ACTION_TYPE_ID);
		assertThat(saved.getActionDate()).isEqualTo(LocalDate.of(2026, 7, 1));
		assertThat(saved.getTitle()).isEqualTo("Task 027 disciplinary action");
		assertThat(saved.getDescription()).isNull();
		assertThat(saved.getIssuedBy().getId()).isEqualTo(issuer.getId());
		assertThat(saved.getRelatedDocument()).isNull();
		assertThat(saved.getActive()).isTrue();
		assertThat(employeeDisciplinaryActionRepository.findByTenant_IdAndEmployee_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
		assertThat(employeeDisciplinaryActionRepository.findByTenant_IdAndCompanyProfile_Id(FOUNDATION_TENANT_ID, FOUNDATION_COMPANY_ID)).extracting(EmployeeDisciplinaryAction::getId).contains(saved.getId());
		assertThat(employeeDisciplinaryActionRepository.findByTenant_IdAndEmployee_IdAndActiveTrue(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
		assertThat(employeeDisciplinaryActionRepository.findByTenant_IdAndDisciplinaryActionType_Id(FOUNDATION_TENANT_ID, WARNING_DISCIPLINARY_ACTION_TYPE_ID)).extracting(EmployeeDisciplinaryAction::getId).contains(saved.getId());
	}

	@Test
	void employeeDisciplinaryActionRepositoryPersistsActionWithRelatedDocument() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-DISCIPLINARY-DOCUMENT"));
		Contract contract = contractRepository.saveAndFlush(newContract(employee, "TASK_027_DISCIPLINARY_CONTRACT"));
		PayrollDocument relatedDocument = payrollDocumentRepository.saveAndFlush(newPayrollDocument(employee, contract, 2026, 7));
		UserAccount issuer = userAccountRepository.saveAndFlush(newUserAccount("disciplinary.document.issuer@example.com"));
		EmployeeDisciplinaryAction action = newEmployeeDisciplinaryAction(employee, issuer, SUSPENSION_DISCIPLINARY_ACTION_TYPE_ID);
		action.setDescription("Disciplinary action linked to a payroll document record.");
		action.setRelatedDocument(relatedDocument);

		EmployeeDisciplinaryAction saved = employeeDisciplinaryActionRepository.saveAndFlush(action);

		assertThat(saved.getId()).isNotNull();
		assertThat(saved.getDisciplinaryActionType().getId()).isEqualTo(SUSPENSION_DISCIPLINARY_ACTION_TYPE_ID);
		assertThat(saved.getDescription()).isEqualTo("Disciplinary action linked to a payroll document record.");
		assertThat(saved.getRelatedDocument().getId()).isEqualTo(relatedDocument.getId());
		assertThat(employeeDisciplinaryActionRepository.findByTenant_IdAndEmployee_Id(FOUNDATION_TENANT_ID, employee.getId())).hasSize(1);
		assertThat(employeeDisciplinaryActionRepository.findByTenant_IdAndDisciplinaryActionType_Id(FOUNDATION_TENANT_ID, SUSPENSION_DISCIPLINARY_ACTION_TYPE_ID)).extracting(EmployeeDisciplinaryAction::getId).contains(saved.getId());
	}

	@Test
	void employeeDisciplinaryActionRepositoryRequiresIssuedBy() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-DISCIPLINARY-ISSUER"));
		EmployeeDisciplinaryAction action = newEmployeeDisciplinaryAction(employee, null, WARNING_DISCIPLINARY_ACTION_TYPE_ID);

		assertThatThrownBy(() -> employeeDisciplinaryActionRepository.saveAndFlush(action))
				.isInstanceOf(jakarta.validation.ConstraintViolationException.class);
	}

	@Test
	void employeeDisciplinaryActionRepositoryRequiresTitle() {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-DISCIPLINARY-TITLE"));
		UserAccount issuer = userAccountRepository.saveAndFlush(newUserAccount("disciplinary.title.issuer@example.com"));
		EmployeeDisciplinaryAction action = newEmployeeDisciplinaryAction(employee, issuer, WARNING_DISCIPLINARY_ACTION_TYPE_ID);
		action.setTitle(null);

		assertThatThrownBy(() -> employeeDisciplinaryActionRepository.saveAndFlush(action))
				.isInstanceOf(jakarta.validation.ConstraintViolationException.class);
	}

	@Test
	@WithMockUser(authorities = "PLATFORM.TENANT.READ")
	void foundationReadApiReturnsSeedData() throws Exception {
		mockMvc.perform(get("/api/foundation/tenants"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));

		mockMvc.perform(get("/api/foundation/company-profiles"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));

		mockMvc.perform(get("/api/foundation/offices"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	@WithMockUser(authorities = "PLATFORM.TENANT.READ")
	void foundationSmtpApiDoesNotExposeEncryptedPassword() throws Exception {
		mockMvc.perform(get("/api/foundation/smtp-configurations"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	@WithMockUser(authorities = "PLATFORM.TENANT.READ")
	void foundationTenantApiReturnsNotFoundForMissingTenant() throws Exception {
		mockMvc.perform(get("/api/foundation/tenants/00000000-0000-0000-0000-000000000099"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	@WithMockUser(authorities = "PLATFORM.TENANT.READ")
	void foundationTenantApiReturnsValidationErrorForInvalidId() throws Exception {
		mockMvc.perform(get("/api/foundation/tenants/not-a-uuid"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void openApiIncludesFoundationReadEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/foundation/tenants']").exists())
				.andExpect(jsonPath("$.paths['/api/foundation/tenants/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/foundation/company-profiles']").exists())
				.andExpect(jsonPath("$.paths['/api/foundation/offices']").exists())
				.andExpect(jsonPath("$.paths['/api/foundation/smtp-configurations']").exists());
	}

	@Test
	@WithMockUser(authorities = {
			"TENANT.EMPLOYEE.READ",
			"TENANT.CONTRACT.READ",
			"TENANT.DEVICE.READ",
			"TENANT.PAYROLL_DOCUMENT.READ",
			"TENANT.LEAVE_REQUEST.READ"
	})
	void coreHrReadApiReturnsListsAndRecords() throws Exception {
		Employee employee = employeeRepository.saveAndFlush(newEmployee("EMP-CORE-HR-API"));
		Contract contract = contractRepository.saveAndFlush(newContract(employee, "TASK_028_CONTRACT"));
		Device device = newDevice("Task 028 API Device", "SN-TASK-028-001");
		device.setAssignedTo(employee);
		device.setAssignedAt(OffsetDateTime.now());
		device = deviceRepository.saveAndFlush(device);
		PayrollDocument payrollDocument = payrollDocumentRepository.saveAndFlush(newPayrollDocument(employee, contract, 2026, 8));
		LeaveRequestType leaveRequestType = leaveRequestTypeRepository.saveAndFlush(newLeaveRequestType("TASK_028_LEAVE"));
		LeaveRequest leaveRequest = leaveRequestRepository.saveAndFlush(newLeaveRequest(employee, leaveRequestType));
		Country country = countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow();
		Region region = regionRepository.saveAndFlush(newRegion(country, "TASK_028_REGION"));
		Area area = areaRepository.saveAndFlush(newArea(country, region, "TASK_028_AREA"));
		HolidayCalendar holidayCalendar = holidayCalendarRepository.saveAndFlush(newHolidayCalendar(country, region, area, "TASK 028 Calendar"));
		AuditLog auditLog = auditLogRepository.saveAndFlush(newAuditLog("EMPLOYEE", employee.getId()));
		UserAccount issuer = userAccountRepository.saveAndFlush(newUserAccount("core.hr.disciplinary.issuer@example.com"));
		EmployeeDisciplinaryAction disciplinaryAction = employeeDisciplinaryActionRepository.saveAndFlush(newEmployeeDisciplinaryAction(employee, issuer, WARNING_DISCIPLINARY_ACTION_TYPE_ID));

		mockMvc.perform(get("/api/core-hr/employees"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
		mockMvc.perform(get("/api/core-hr/employees/{id}", employee.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.employeeCode").value("EMP-CORE-HR-API"))
				.andExpect(jsonPath("$.companyProfile.code").value("FOUNDATION_LEGAL_ENTITY"));

		mockMvc.perform(get("/api/core-hr/contracts"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
		mockMvc.perform(get("/api/core-hr/contracts/{id}", contract.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.employee.code").value("EMP-CORE-HR-API"))
				.andExpect(jsonPath("$.currency.code").value("EUR"));

		mockMvc.perform(get("/api/core-hr/devices"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
		mockMvc.perform(get("/api/core-hr/devices/{id}", device.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 028 API Device"))
				.andExpect(jsonPath("$.assignedTo.code").value("EMP-CORE-HR-API"));

		mockMvc.perform(get("/api/core-hr/payroll-documents"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
		mockMvc.perform(get("/api/core-hr/payroll-documents/{id}", payrollDocument.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.originalFilename").value("payslip-april-2026.pdf"))
				.andExpect(jsonPath("$.storedFilename").doesNotExist())
				.andExpect(jsonPath("$.storagePath").doesNotExist())
				.andExpect(jsonPath("$.checksum").doesNotExist());

		mockMvc.perform(get("/api/core-hr/leave-requests"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
		mockMvc.perform(get("/api/core-hr/leave-requests/{id}", leaveRequest.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.employee.code").value("EMP-CORE-HR-API"))
				.andExpect(jsonPath("$.status").value("DRAFT"));

		mockMvc.perform(get("/api/core-hr/holiday-calendars"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
		mockMvc.perform(get("/api/core-hr/holiday-calendars/{id}", holidayCalendar.getId()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));

		mockMvc.perform(get("/api/core-hr/audit-logs"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
		mockMvc.perform(get("/api/core-hr/audit-logs/{id}", auditLog.getId()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));

		mockMvc.perform(get("/api/core-hr/employee-disciplinary-actions"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
		mockMvc.perform(get("/api/core-hr/employee-disciplinary-actions/{id}", disciplinaryAction.getId()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.EMPLOYEE.READ")
	void coreHrReadApiReturnsNotFoundForMissingEmployee() throws Exception {
		mockMvc.perform(get("/api/core-hr/employees/00000000-0000-0000-0000-000000000099"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Employee not found: 00000000-0000-0000-0000-000000000099"));
	}

	@Test
	@WithMockUser(authorities = "TENANT.EMPLOYEE.READ")
	void coreHrReadApiReturnsValidationErrorForInvalidId() throws Exception {
		mockMvc.perform(get("/api/core-hr/employees/not-a-uuid"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.validationErrors.id").value("Invalid value"));
	}

	@Test
	void openApiIncludesCoreHrReadEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/core-hr/employees']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/employees/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/contracts']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/contracts/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/devices']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/devices/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/payroll-documents']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/payroll-documents/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/leave-requests']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/leave-requests/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/holiday-calendars']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/holiday-calendars/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/audit-logs']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/audit-logs/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/employee-disciplinary-actions']").exists())
				.andExpect(jsonPath("$.paths['/api/core-hr/employee-disciplinary-actions/{id}']").exists());
	}

	private Employee newEmployee(String employeeCode) {
		Employee employee = new Employee();
		employee.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		employee.setCompany(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		employee.setOffice(officeLocationRepository.findById(FOUNDATION_OFFICE_ID).orElseThrow());
		employee.setEmployeeCode(employeeCode);
		employee.setFirstName("Foundation");
		employee.setLastName("Employee");
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
		employee.setDepartment("HR");
		employee.setJobTitle("HR_SPECIALIST");
		employee.setContractType("FULL_TIME");
		employee.setEmploymentStatus("ACTIVE");
		employee.setWorkMode("HYBRID");
		employee.setHireDate(LocalDate.of(2026, 5, 2));
		return employee;
	}

	private ContractType newContractType(String code) {
		ContractType contractType = new ContractType();
		contractType.setTenantId(FOUNDATION_TENANT_ID);
		contractType.setCode(code);
		contractType.setName("Task 018 Contract");
		return contractType;
	}

	private LeaveRequestType newLeaveRequestType(String code) {
		LeaveRequestType leaveRequestType = new LeaveRequestType();
		leaveRequestType.setTenantId(FOUNDATION_TENANT_ID);
		leaveRequestType.setCode(code);
		leaveRequestType.setName("Task 024 Leave Request Type");
		leaveRequestType.setRequiresApproval(true);
		return leaveRequestType;
	}

	private Contract newContract(Employee employee, String contractTypeCode) {
		Contract contract = new Contract();
		contract.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		contract.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		contract.setEmployee(employee);
		contract.setContractType(contractTypeRepository.saveAndFlush(newContractType(contractTypeCode)));
		contract.setCurrency(currencyRepository.findById(FOUNDATION_CURRENCY_ID).orElseThrow());
		contract.setStartDate(LocalDate.of(2026, 1, 1));
		contract.setBaseSalary(new BigDecimal("42000.00"));
		contract.setWeeklyHours(new BigDecimal("40.00"));
		return contract;
	}

	private TimeZone newTimeZone(String code) {
		TimeZone timeZone = new TimeZone();
		timeZone.setCode(code);
		timeZone.setName("Europe Rome");
		timeZone.setUtcOffset("+01:00");
		return timeZone;
	}

	private UserAccount newUserAccount(String email) {
		UserAccount userAccount = new UserAccount();
		userAccount.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		userAccount.setUserType(userTypeRepository.findById(TENANT_ADMIN_USER_TYPE_ID).orElseThrow());
		userAccount.setAuthenticationMethod(authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID).orElseThrow());
		userAccount.setEmail(email);
		userAccount.setPasswordHash("hashed-password-placeholder");
		return userAccount;
	}

	private UserRole newUserRole(UserAccount userAccount) {
		UserRole userRole = new UserRole();
		userRole.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		userRole.setUserAccount(userAccount);
		userRole.setRole(roleRepository.findById(TENANT_ADMIN_ROLE_ID).orElseThrow());
		return userRole;
	}

	private RolePermission newRolePermission(UUID permissionId) {
		RolePermission rolePermission = new RolePermission();
		rolePermission.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		rolePermission.setRole(roleRepository.findById(TENANT_ADMIN_ROLE_ID).orElseThrow());
		rolePermission.setPermission(permissionRepository.findById(permissionId).orElseThrow());
		return rolePermission;
	}

	private UserTenantAccess newUserTenantAccess(UserAccount userAccount) {
		UserTenantAccess userTenantAccess = new UserTenantAccess();
		userTenantAccess.setUserAccount(userAccount);
		userTenantAccess.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		userTenantAccess.setAccessRole("TENANT_ADMIN");
		return userTenantAccess;
	}

	private Device newDevice(String name, String serialNumber) {
		Device device = new Device();
		device.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		device.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		device.setName(name);
		device.setType(deviceTypeRepository.findById(LAPTOP_DEVICE_TYPE_ID).orElseThrow());
		device.setBrand(deviceBrandRepository.findById(DELL_DEVICE_BRAND_ID).orElseThrow());
		device.setModel("Latitude 7450");
		device.setSerialNumber(serialNumber);
		device.setPurchaseDate(LocalDate.of(2026, 5, 2));
		device.setWarrantyEndDate(LocalDate.of(2029, 5, 2));
		device.setDeviceStatus(deviceStatusRepository.findById(AVAILABLE_DEVICE_STATUS_ID).orElseThrow());
		return device;
	}

	private PayrollDocument newPayrollDocument(Employee employee, Contract contract, Integer periodYear, Integer periodMonth) {
		PayrollDocument payrollDocument = new PayrollDocument();
		payrollDocument.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		payrollDocument.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		payrollDocument.setEmployee(employee);
		payrollDocument.setContract(contract);
		payrollDocument.setDocumentType(documentTypeRepository.findById(PAYSLIP_DOCUMENT_TYPE_ID).orElseThrow());
		payrollDocument.setOriginalFilename("payslip-april-2026.pdf");
		payrollDocument.setStoredFilename("payroll-2026-04-anonymized.pdf");
		payrollDocument.setContentType("application/pdf");
		payrollDocument.setFileSizeBytes(128000L);
		payrollDocument.setChecksum("0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
		payrollDocument.setStoragePath("payroll/2026/04/payroll-2026-04-anonymized.pdf");
		payrollDocument.setPeriodYear(periodYear);
		payrollDocument.setPeriodMonth(periodMonth);
		return payrollDocument;
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
		leaveRequest.setReason("Planned leave request");
		return leaveRequest;
	}

	private Region newRegion(Country country, String code) {
		Region region = new Region();
		region.setCountry(country);
		region.setCode(code);
		region.setName("Task 025 Region");
		return region;
	}

	private Area newArea(Country country, Region region, String code) {
		Area area = new Area();
		area.setCountry(country);
		area.setRegion(region);
		area.setCode(code);
		area.setName("Task 025 Area");
		return area;
	}

	private HolidayCalendar newHolidayCalendar(Country country, Region region, Area area, String name) {
		HolidayCalendar holidayCalendar = new HolidayCalendar();
		holidayCalendar.setCountry(country);
		holidayCalendar.setRegion(region);
		holidayCalendar.setArea(area);
		holidayCalendar.setStartDate(LocalDate.of(2026, 1, 1));
		holidayCalendar.setEndDate(LocalDate.of(2026, 12, 31));
		holidayCalendar.setName(name);
		return holidayCalendar;
	}

	private AuditLog newAuditLog(String entityType, UUID entityId) {
		AuditLog auditLog = new AuditLog();
		auditLog.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		auditLog.setAuditActionType(auditActionTypeRepository.findById(CREATE_AUDIT_ACTION_TYPE_ID).orElseThrow());
		auditLog.setEntityType(entityType);
		auditLog.setEntityId(entityId);
		auditLog.setEntityDisplayName("Task 026 audited entity");
		auditLog.setDescription("Task 026 audit log event");
		auditLog.setIpAddress("127.0.0.1");
		auditLog.setUserAgent("JUnit");
		auditLog.setSeverityLevel("LOW");
		return auditLog;
	}

	private EmployeeDisciplinaryAction newEmployeeDisciplinaryAction(Employee employee, UserAccount issuedBy, UUID disciplinaryActionTypeId) {
		EmployeeDisciplinaryAction action = new EmployeeDisciplinaryAction();
		action.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		action.setCompanyProfile(companyProfileRepository.findById(FOUNDATION_COMPANY_ID).orElseThrow());
		action.setEmployee(employee);
		action.setDisciplinaryActionType(disciplinaryActionTypeRepository.findById(disciplinaryActionTypeId).orElseThrow());
		action.setActionDate(LocalDate.of(2026, 7, 1));
		action.setTitle("Task 027 disciplinary action");
		action.setDescription("Task 027 disciplinary action description");
		action.setIssuedBy(issuedBy);
		return action;
	}

}
