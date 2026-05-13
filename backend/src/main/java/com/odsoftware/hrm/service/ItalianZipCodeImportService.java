package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.global.ItalianZipCodeImportReport;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.GlobalZipCode;
import com.odsoftware.hrm.entity.master.GlobalZipCodeSourceType;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ItalianZipCodeImportService {

	static final String DEFAULT_CSV_PATH = "master-data/italy-zip-codes.csv";
	private static final UUID GLOBAL_SCOPE_KEY = UUID.fromString("00000000-0000-0000-0000-000000000000");

	private final CountryRepository countryRepository;
	private final GlobalZipCodeRepository globalZipCodeRepository;

	public ItalianZipCodeImportService(
			CountryRepository countryRepository,
			GlobalZipCodeRepository globalZipCodeRepository) {
		this.countryRepository = countryRepository;
		this.globalZipCodeRepository = globalZipCodeRepository;
	}

	public ItalianZipCodeImportReport analyzeDefaultCsv() {
		return summarize(readRows(new ClassPathResource(DEFAULT_CSV_PATH)));
	}

	@Transactional
	public ItalianZipCodeImportReport importDefaultCsv() {
		return importFromResource(new ClassPathResource(DEFAULT_CSV_PATH));
	}

	@Transactional
	ItalianZipCodeImportReport importFromResource(Resource csvResource) {
		Country italy = countryRepository.findByIsoCode("IT")
				.orElseThrow(() -> new ResourceNotFoundException("Country not found by isoCode: IT"));
		CsvReadResult readResult = readRows(csvResource);
		long imported = 0L;
		long updated = 0L;
		long skipped = 0L;
		List<String> errors = new ArrayList<>(readResult.errors());

		for (ItalianZipCodeCsvRow row : readResult.rows()) {
			try {
				String city = normalize(row.comune());
				String postalCode = normalize(row.cap());
				String provinceCode = normalizeUpper(row.provinciaSigla());
				GlobalZipCode existing = globalZipCodeRepository
						.findByTenantIdIsNullAndCountry_IdAndPostalCodeAndCity(italy.getId(), postalCode, city)
						.orElse(null);
				if (existing == null) {
					GlobalZipCode globalZipCode = new GlobalZipCode();
					globalZipCode.setTenantId(null);
					globalZipCode.setTenantScopeKey(GLOBAL_SCOPE_KEY);
					globalZipCode.setCountry(italy);
					globalZipCode.setRegion(null);
					globalZipCode.setArea(null);
					globalZipCode.setCity(city);
					globalZipCode.setPostalCode(postalCode);
					globalZipCode.setProvinceCode(provinceCode);
					globalZipCode.setProvinceName(null);
					globalZipCode.setLatitude(null);
					globalZipCode.setLongitude(null);
					globalZipCode.setSourceType(GlobalZipCodeSourceType.OFFICIAL_IMPORT);
					globalZipCode.setActive(true);
					globalZipCodeRepository.save(globalZipCode);
					imported++;
				} else if (requiresUpdate(existing, provinceCode)) {
					existing.setProvinceCode(provinceCode);
					existing.setProvinceName(null);
					existing.setSourceType(GlobalZipCodeSourceType.OFFICIAL_IMPORT);
					existing.setActive(true);
					globalZipCodeRepository.save(existing);
					updated++;
				} else {
					skipped++;
				}
			} catch (RuntimeException ex) {
				errors.add("line " + row.lineNumber() + ": " + ex.getMessage());
			}
		}

		return new ItalianZipCodeImportReport(
				readResult.rowsRead(),
				readResult.rows().size(),
				imported,
				updated,
				skipped,
				errors.size(),
				errors);
	}

	CsvReadResult readRows(Resource csvResource) {
		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(csvResource.getInputStream(), StandardCharsets.UTF_8))) {
			String header = reader.readLine();
			if (header == null) {
				return new CsvReadResult(0L, List.of(), List.of("empty csv file"));
			}
			List<String> headerColumns = parseCsvLine(stripBom(header));
			if (headerColumns.size() != 6
					|| !"istat".equals(headerColumns.get(0))
					|| !"comune".equals(headerColumns.get(1))
					|| !"cap".equals(headerColumns.get(2))
					|| !"provincia_sigla".equals(headerColumns.get(3))
					|| !"regione".equals(headerColumns.get(4))
					|| !"cod_fisco".equals(headerColumns.get(5))) {
				return new CsvReadResult(0L, List.of(), List.of("unexpected csv header"));
			}

			long rowsRead = 0L;
			List<ItalianZipCodeCsvRow> rows = new ArrayList<>();
			List<String> errors = new ArrayList<>();
			Set<String> uniqueIstatCap = new HashSet<>();

			String line;
			long lineNumber = 1L;
			while ((line = reader.readLine()) != null) {
				lineNumber++;
				if (line.isBlank()) {
					continue;
				}
				rowsRead++;
				List<String> columns = parseCsvLine(line);
				if (columns.size() != 6) {
					errors.add("line " + lineNumber + ": invalid column count");
					continue;
				}
				String istat = normalize(columns.get(0));
				String comune = normalize(columns.get(1));
				String cap = normalize(columns.get(2));
				String provinciaSigla = normalizeUpper(columns.get(3));
				String regione = normalize(columns.get(4));
				String codFisco = normalizeUpper(columns.get(5));
				if (istat == null || comune == null || cap == null || provinciaSigla == null || regione == null || codFisco == null) {
					errors.add("line " + lineNumber + ": required value missing");
					continue;
				}
				if (!cap.matches("\\d{5}")) {
					errors.add("line " + lineNumber + ": invalid cap " + cap);
					continue;
				}
				String key = istat + "|" + cap;
				if (!uniqueIstatCap.add(key)) {
					errors.add("line " + lineNumber + ": duplicate istat+cap " + key);
					continue;
				}
				rows.add(new ItalianZipCodeCsvRow(lineNumber, istat, comune, cap, provinciaSigla, regione, codFisco));
			}
			return new CsvReadResult(rowsRead, rows, errors);
		} catch (IOException ex) {
			throw new IllegalStateException("Cannot read italian zip code csv", ex);
		}
	}

	public ItalianZipCodeImportReport analyzeRawCsv(String csvContent) {
		return summarize(readRows(new ByteArrayResource(csvContent.getBytes(StandardCharsets.UTF_8))));
	}

	private ItalianZipCodeImportReport summarize(CsvReadResult readResult) {
		return new ItalianZipCodeImportReport(
				readResult.rowsRead(),
				readResult.rows().size(),
				0L,
				0L,
				0L,
				readResult.errors().size(),
				readResult.errors());
	}

	private boolean requiresUpdate(GlobalZipCode existing, String provinceCode) {
		if (!normalize(existing.getProvinceCode()).equals(provinceCode)) {
			return true;
		}
		if (existing.getSourceType() != GlobalZipCodeSourceType.OFFICIAL_IMPORT) {
			return true;
		}
		return !Boolean.TRUE.equals(existing.getActive());
	}

	private String normalizeUpper(String value) {
		String normalized = normalize(value);
		return normalized == null ? null : normalized.toUpperCase(Locale.ROOT);
	}

	private String normalize(String value) {
		if (value == null) {
			return null;
		}
		String normalized = value.trim();
		return normalized.isEmpty() ? null : normalized;
	}

	private String stripBom(String value) {
		return value != null && !value.isEmpty() && value.charAt(0) == '\uFEFF' ? value.substring(1) : value;
	}

	private List<String> parseCsvLine(String line) {
		List<String> columns = new ArrayList<>();
		StringBuilder current = new StringBuilder();
		boolean inQuotes = false;
		for (int i = 0; i < line.length(); i++) {
			char c = line.charAt(i);
			if (c == '"') {
				if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
					current.append('"');
					i++;
				} else {
					inQuotes = !inQuotes;
				}
			} else if (c == ',' && !inQuotes) {
				columns.add(current.toString());
				current.setLength(0);
			} else {
				current.append(c);
			}
		}
		columns.add(current.toString());
		return columns;
	}

	record ItalianZipCodeCsvRow(
			long lineNumber,
			String istat,
			String comune,
			String cap,
			String provinciaSigla,
			String regione,
			String codFisco) {
	}

	record CsvReadResult(long rowsRead, List<ItalianZipCodeCsvRow> rows, List<String> errors) {
	}
}
