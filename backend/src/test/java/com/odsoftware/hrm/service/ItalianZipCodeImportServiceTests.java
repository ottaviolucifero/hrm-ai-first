package com.odsoftware.hrm.service;

import com.odsoftware.hrm.HrmBackendApplication;
import com.odsoftware.hrm.dto.masterdata.global.ItalianZipCodeImportReport;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = HrmBackendApplication.class)
@ActiveProfiles("test")
class ItalianZipCodeImportServiceTests {

	private static final String VALID_SMALL_CSV = String.join("\n",
			"istat,comune,cap,provincia_sigla,regione,cod_fisco",
			"1272,Task 044 Torino,10121,TO,Piemonte,L219",
			"1272,Task 044 Torino,10122,TO,Piemonte,L219",
			"15146,Task 044 Milano,20121,MI,Lombardia,F205");

	@Autowired
	private ItalianZipCodeImportService italianZipCodeImportService;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private GlobalZipCodeRepository globalZipCodeRepository;

	@Test
	void italianZipImportReadsSmallFixtureWithoutUsingDefaultCsv() {
		ItalianZipCodeImportReport report = italianZipCodeImportService.analyzeRawCsv(VALID_SMALL_CSV);

		assertThat(report.rowsRead()).isEqualTo(3L);
		assertThat(report.totalValidSourceZipCodes()).isEqualTo(3L);
		assertThat(report.errors()).isZero();
	}

	@Test
	void italianZipImportIsIdempotentOnSmallFixture() {
		Country italy = countryRepository.findByIsoCode("IT").orElseThrow();

		ItalianZipCodeImportReport firstRun = italianZipCodeImportService.importFromResource(csvResource(VALID_SMALL_CSV));
		assertThat(firstRun.imported() + firstRun.updated() + firstRun.skipped()).isEqualTo(3L);
		assertThat(firstRun.errors()).isZero();

		ItalianZipCodeImportReport secondRun = italianZipCodeImportService.importFromResource(csvResource(VALID_SMALL_CSV));
		assertThat(secondRun.imported()).isZero();
		assertThat(secondRun.updated()).isZero();
		assertThat(secondRun.skipped()).isEqualTo(3L);
		assertThat(secondRun.errors()).isZero();

		Set<String> torinoCaps = globalZipCodeRepository.findByCountry_IdAndCity(italy.getId(), "Task 044 Torino").stream()
				.map(zipCode -> zipCode.getPostalCode())
				.collect(Collectors.toSet());
		assertThat(torinoCaps).containsExactlyInAnyOrder("10121", "10122");
	}

	@Test
	void italianZipImportRejectsInvalidAndDuplicateCapsFromCsvContent() {
		String csv = String.join("\n",
				"istat,comune,cap,provincia_sigla,regione,cod_fisco",
				"1272,Torino,10121,TO,Piemonte,L219",
				"1272,Torino,10121,TO,Piemonte,L219",
				"15146,Milano,20A21,MI,Lombardia,F205");

		ItalianZipCodeImportReport report = italianZipCodeImportService.analyzeRawCsv(csv);

		assertThat(report.rowsRead()).isEqualTo(3L);
		assertThat(report.totalValidSourceZipCodes()).isEqualTo(1L);
		assertThat(report.errors()).isEqualTo(2L);
		assertThat(report.errorDetails()).anyMatch(message -> message.contains("duplicate istat+cap"));
		assertThat(report.errorDetails()).anyMatch(message -> message.contains("invalid cap"));
	}

	private ByteArrayResource csvResource(String csv) {
		return new ByteArrayResource(csv.getBytes(StandardCharsets.UTF_8));
	}
}
