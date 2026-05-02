package com.odsoftware.hrm;

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
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
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

}
