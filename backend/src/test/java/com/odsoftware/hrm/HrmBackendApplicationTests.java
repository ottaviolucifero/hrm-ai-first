package com.odsoftware.hrm;

import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.OfficeLocationRepository;
import com.odsoftware.hrm.repository.core.SmtpConfigurationRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.ApprovalStatusRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.AuditActionTypeRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
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
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.master.WorkModeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
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
	private MockMvc mockMvc;

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

}
