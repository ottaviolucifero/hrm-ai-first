package com.odsoftware.hrm;

import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.OfficeLocationRepository;
import com.odsoftware.hrm.repository.core.SmtpConfigurationRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.entity.contract.Contract;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.ContractType;
import com.odsoftware.hrm.entity.master.TimeZone;
import com.odsoftware.hrm.repository.contract.ContractRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.ApprovalStatusRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.AuditActionTypeRepository;
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
import com.odsoftware.hrm.repository.master.MaritalStatusRepository;
import com.odsoftware.hrm.repository.master.OfficeLocationTypeRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.SmtpEncryptionTypeRepository;
import com.odsoftware.hrm.repository.master.TimeZoneRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.master.WorkModeRepository;
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
	private MockMvc mockMvc;

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_OFFICE_ID = UUID.fromString("81000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_CURRENCY_ID = UUID.fromString("10000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000003");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");

	@Test
	void contextLoads() {
	}

	@Test
	void flywayMigrationSeedsGlobalMasterTables() {
		assertThat(currencyRepository.count()).isEqualTo(2);
		assertThat(countryRepository.count()).isEqualTo(3);
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
		assertThat(roleRepository.count()).isEqualTo(3);
		assertThat(permissionRepository.count()).isEqualTo(5);
		assertThat(companyProfileTypeRepository.count()).isEqualTo(2);
		assertThat(officeLocationTypeRepository.count()).isEqualTo(3);
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
	@WithMockUser
	void foundationReadApiReturnsSeedData() throws Exception {
		mockMvc.perform(get("/api/foundation/tenants"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].code").value("FOUNDATION_TENANT"))
				.andExpect(jsonPath("$[0].defaultCountry.code").value("IT"))
				.andExpect(jsonPath("$[0].defaultCurrency.code").value("EUR"));

		mockMvc.perform(get("/api/foundation/company-profiles"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].code").value("FOUNDATION_LEGAL_ENTITY"))
				.andExpect(jsonPath("$[0].tenant.code").value("FOUNDATION_TENANT"));

		mockMvc.perform(get("/api/foundation/offices"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].code").value("HEADQUARTER"))
				.andExpect(jsonPath("$[0].companyProfile.code").value("FOUNDATION_LEGAL_ENTITY"));
	}

	@Test
	@WithMockUser
	void foundationSmtpApiDoesNotExposeEncryptedPassword() throws Exception {
		mockMvc.perform(get("/api/foundation/smtp-configurations"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].code").value("DEFAULT_SMTP"))
				.andExpect(jsonPath("$[0].smtpEncryptionType.code").value("STARTTLS"))
				.andExpect(jsonPath("$[0].passwordEncrypted").doesNotExist());
	}

	@Test
	@WithMockUser
	void foundationTenantApiReturnsNotFoundForMissingTenant() throws Exception {
		mockMvc.perform(get("/api/foundation/tenants/00000000-0000-0000-0000-000000000099"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Tenant not found: 00000000-0000-0000-0000-000000000099"));
	}

	@Test
	@WithMockUser
	void foundationTenantApiReturnsValidationErrorForInvalidId() throws Exception {
		mockMvc.perform(get("/api/foundation/tenants/not-a-uuid"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.validationErrors.id").value("Invalid value"));
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

}
