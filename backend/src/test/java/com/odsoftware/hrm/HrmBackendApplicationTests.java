package com.odsoftware.hrm;

import com.odsoftware.hrm.repository.master.ApprovalStatusRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.GenderRepository;
import com.odsoftware.hrm.repository.master.MaritalStatusRepository;
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

}
