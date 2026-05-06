package com.odsoftware.hrm;

import com.odsoftware.hrm.dto.masterdata.global.ItalianZipCodeImportReport;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import com.odsoftware.hrm.service.ItalianZipCodeImportService;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class ItalianZipCodeImportServiceTests {

	@Autowired
	private ItalianZipCodeImportService italianZipCodeImportService;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private GlobalZipCodeRepository globalZipCodeRepository;

	@Test
	void italianZipCsvDatasetIsNormalizedAndValid() {
		ItalianZipCodeImportReport report = italianZipCodeImportService.analyzeDefaultCsv();
		assertThat(report.rowsRead()).isEqualTo(8465L);
		assertThat(report.totalValidSourceZipCodes()).isEqualTo(8465L);
		assertThat(report.errors()).isZero();
	}

	@Test
	void italianZipImportIsIdempotentAndKeepsDbCountAlignedWithSource() {
		Country italy = countryRepository.findByIsoCode("IT").orElseThrow();
		long before = globalZipCodeRepository.countByCountry_Id(italy.getId());

		ItalianZipCodeImportReport firstRun = italianZipCodeImportService.importDefaultCsv();
		long afterFirst = globalZipCodeRepository.countByCountry_Id(italy.getId());
		assertThat(afterFirst).isEqualTo(firstRun.totalValidSourceZipCodes());
		assertThat(firstRun.imported() + firstRun.updated() + firstRun.skipped()).isEqualTo(firstRun.totalValidSourceZipCodes());
		assertThat(firstRun.errors()).isZero();

		ItalianZipCodeImportReport secondRun = italianZipCodeImportService.importDefaultCsv();
		long afterSecond = globalZipCodeRepository.countByCountry_Id(italy.getId());
		assertThat(afterSecond).isEqualTo(afterFirst);
		assertThat(secondRun.imported()).isZero();
		assertThat(secondRun.updated()).isZero();
		assertThat(secondRun.skipped()).isEqualTo(secondRun.totalValidSourceZipCodes());
		assertThat(secondRun.errors()).isZero();

		assertThat(before).isLessThanOrEqualTo(afterFirst);
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
		assertThat(report.errorDetails()).anyMatch(m -> m.contains("duplicate istat+cap"));
		assertThat(report.errorDetails()).anyMatch(m -> m.contains("invalid cap"));
	}

	@Test
	void italianZipCsvContainsExpectedKnownCases() {
		ItalianZipCodeImportReport report = italianZipCodeImportService.importDefaultCsv();
		assertThat(report.errors()).isZero();

		Country italy = countryRepository.findByIsoCode("IT").orElseThrow();
		Set<String> torinoCaps = globalZipCodeRepository.findByCountry_IdAndCity(italy.getId(), "Torino").stream()
				.map(z -> z.getPostalCode())
				.collect(Collectors.toSet());
		assertThat(torinoCaps).contains("10121", "10122", "10156");
	}
}
