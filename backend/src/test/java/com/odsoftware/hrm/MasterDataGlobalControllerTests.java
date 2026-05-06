package com.odsoftware.hrm;

import com.odsoftware.hrm.repository.master.AreaRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.GenderRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import com.odsoftware.hrm.repository.master.MaritalStatusRepository;
import com.odsoftware.hrm.repository.master.NationalIdentifierTypeRepository;
import com.odsoftware.hrm.repository.master.RegionRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
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
class MasterDataGlobalControllerTests {

	private static final UUID EUR_CURRENCY_ID = UUID.fromString("10000000-0000-0000-0000-000000000001");
	private static final UUID ITALY_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private RegionRepository regionRepository;

	@Autowired
	private AreaRepository areaRepository;

	@Autowired
	private GlobalZipCodeRepository globalZipCodeRepository;

	@Autowired
	private CurrencyRepository currencyRepository;

	@Autowired
	private GenderRepository genderRepository;

	@Autowired
	private MaritalStatusRepository maritalStatusRepository;

	@Autowired
	private NationalIdentifierTypeRepository nationalIdentifierTypeRepository;

	@Test
	@WithMockUser
	void masterDataGlobalGeoCrudFlowSupportsListGetCreateUpdateAndDisable() throws Exception {
		UUID countryId = createCountry("Task 030 Country", "QZ");
		mockMvc.perform(get("/api/master-data/global/countries"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/countries/{id}", countryId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isoCode").value("QZ"));
		mockMvc.perform(putJson("/api/master-data/global/countries/" + countryId, countryRequest("Task 030 Country Updated", "QZ")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 030 Country Updated"));

		UUID regionId = createRegion(countryId, "Task 030 Region", "qa-r1");
		mockMvc.perform(get("/api/master-data/global/regions"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/regions/{id}", regionId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("QA-R1"));
		mockMvc.perform(putJson("/api/master-data/global/regions/" + regionId, regionRequest(countryId, "Task 030 Region Updated", "QA-R1")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 030 Region Updated"));

		UUID areaId = createArea(countryId, regionId, "Task 030 Area", "qa-a1");
		mockMvc.perform(get("/api/master-data/global/areas"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/areas/{id}", areaId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("QA-A1"));
		mockMvc.perform(putJson("/api/master-data/global/areas/" + areaId, areaRequest(countryId, regionId, "Task 030 Area Updated", "QA-A1")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 030 Area Updated"));

		UUID zipCodeId = createZipCode(countryId, regionId, areaId, "Task City", "30100");
		mockMvc.perform(get("/api/master-data/global/zip-codes"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/zip-codes/{id}", zipCodeId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.postalCode").value("30100"))
				.andExpect(jsonPath("$.sourceType").value("MANUAL"));
		mockMvc.perform(putJson("/api/master-data/global/zip-codes/" + zipCodeId, zipCodeRequest(countryId, regionId, areaId, "Task City Updated", "30100")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.city").value("Task City Updated"));

		mockMvc.perform(delete("/api/master-data/global/zip-codes/{id}", zipCodeId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/global/areas/{id}", areaId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/global/regions/{id}", regionId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/global/countries/{id}", countryId).with(csrf()))
				.andExpect(status().isNoContent());

		assertThat(globalZipCodeRepository.findById(zipCodeId).orElseThrow().getActive()).isFalse();
		assertThat(areaRepository.findById(areaId).orElseThrow().getActive()).isFalse();
		assertThat(regionRepository.findById(regionId).orElseThrow().getActive()).isFalse();
		assertThat(countryRepository.findById(countryId).orElseThrow().getActive()).isFalse();
	}

	@Test
	@WithMockUser
	void masterDataGlobalSimpleMasterCrudFlowSupportsListGetCreateUpdateAndDisable() throws Exception {
		UUID currencyId = createCurrency("XQA", "Task 030 Currency", "XQA");
		mockMvc.perform(get("/api/master-data/global/currencies"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/currencies/{id}", currencyId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("XQA"));
		mockMvc.perform(putJson("/api/master-data/global/currencies/" + currencyId, currencyRequest("XQA", "Task 030 Currency Updated", "XQA")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 030 Currency Updated"));

		UUID genderId = createGender("TASK030_GENDER", "Task 030 Gender");
		mockMvc.perform(get("/api/master-data/global/genders"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/genders/{id}", genderId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("TASK030_GENDER"));
		mockMvc.perform(putJson("/api/master-data/global/genders/" + genderId, codeNameRequest("TASK030_GENDER", "Task 030 Gender Updated")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 030 Gender Updated"));

		UUID maritalStatusId = createMaritalStatus("TASK030_STATUS", "Task 030 Status");
		mockMvc.perform(get("/api/master-data/global/marital-statuses"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/marital-statuses/{id}", maritalStatusId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("TASK030_STATUS"));
		mockMvc.perform(putJson("/api/master-data/global/marital-statuses/" + maritalStatusId, codeNameRequest("TASK030_STATUS", "Task 030 Status Updated")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 030 Status Updated"));

		UUID nationalIdentifierTypeId = createNationalIdentifierType("TASK030_NID", "Task 030 NID");
		mockMvc.perform(get("/api/master-data/global/national-identifier-types"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray());
		mockMvc.perform(get("/api/master-data/global/national-identifier-types/{id}", nationalIdentifierTypeId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("TASK030_NID"));
		mockMvc.perform(putJson("/api/master-data/global/national-identifier-types/" + nationalIdentifierTypeId, nationalIdentifierTypeRequest("TASK030_NID", "Task 030 NID Updated")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 030 NID Updated"));

		mockMvc.perform(delete("/api/master-data/global/currencies/{id}", currencyId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/global/genders/{id}", genderId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/global/marital-statuses/{id}", maritalStatusId).with(csrf()))
				.andExpect(status().isNoContent());
		mockMvc.perform(delete("/api/master-data/global/national-identifier-types/{id}", nationalIdentifierTypeId).with(csrf()))
				.andExpect(status().isNoContent());

		assertThat(currencyRepository.findById(currencyId).orElseThrow().getActive()).isFalse();
		assertThat(genderRepository.findById(genderId).orElseThrow().getActive()).isFalse();
		assertThat(maritalStatusRepository.findById(maritalStatusId).orElseThrow().getActive()).isFalse();
		assertThat(nationalIdentifierTypeRepository.findById(nationalIdentifierTypeId).orElseThrow().getActive()).isFalse();
	}

	@Test
	@WithMockUser
	void masterDataGlobalListEndpointsSupportPaginationAndSearch() throws Exception {
		long totalCountries = countryRepository.count();

		mockMvc.perform(get("/api/master-data/global/countries"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray())
				.andExpect(jsonPath("$.page").value(0))
				.andExpect(jsonPath("$.size").value(25))
				.andExpect(jsonPath("$.totalElements").value(totalCountries))
				.andExpect(jsonPath("$.totalPages").value((int) Math.ceil(totalCountries / 25.0d)))
				.andExpect(jsonPath("$.first").value(true))
				.andExpect(jsonPath("$.last").value(totalCountries <= 25));

		mockMvc.perform(get("/api/master-data/global/countries?page=1&size=10"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.page").value(1))
				.andExpect(jsonPath("$.size").value(10))
				.andExpect(jsonPath("$.content.length()").value(10))
				.andExpect(jsonPath("$.first").value(false))
				.andExpect(jsonPath("$.last").value(false));

		mockMvc.perform(get("/api/master-data/global/countries?size=500"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.size").value(100))
				.andExpect(jsonPath("$.content.length()").value(100));

		mockMvc.perform(get("/api/master-data/global/countries?search=Italy"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].isoCode").value("IT"))
				.andExpect(jsonPath("$.content[0].name").value("Italy"));
	}

	@Test
	@WithMockUser
	void masterDataGlobalApiReturnsNotFoundForMissingRecord() throws Exception {
		mockMvc.perform(get("/api/master-data/global/currencies/{id}", MISSING_ID))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.status").value(404))
				.andExpect(jsonPath("$.message").value("Currency not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void masterDataGlobalApiReturnsValidationErrorForInvalidPayload() throws Exception {
		mockMvc.perform(postJson("/api/master-data/global/countries", Map.of("isoCode", "QZ")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.validationErrors.name").exists());
	}

	@Test
	@WithMockUser
	void masterDataGlobalApiAllowsCountryWithoutDefaultCurrency() throws Exception {
		mockMvc.perform(postJson("/api/master-data/global/countries", countryRequest("Task 042 Country", "QC", null)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.isoCode").value("QC"))
				.andExpect(jsonPath("$.defaultCurrency").doesNotExist());
	}

	@Test
	@WithMockUser
	void masterDataGlobalApiReturnsValidationErrorForInvalidId() throws Exception {
		mockMvc.perform(get("/api/master-data/global/countries/not-a-uuid"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.validationErrors.id").value("Invalid value"));
	}

	@Test
	@WithMockUser
	void masterDataGlobalApiReturnsConflictForNaturalKeyDuplicates() throws Exception {
		createGender("TASK030_DUPLICATE", "Task 030 Duplicate Gender");

		mockMvc.perform(postJson("/api/master-data/global/genders", codeNameRequest("TASK030_DUPLICATE", "Task 030 Duplicate Gender 2")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.status").value(409))
				.andExpect(jsonPath("$.message").value("Gender code already exists: TASK030_DUPLICATE"));
	}

	@Test
	@WithMockUser
	void masterDataGlobalApiValidatesGeographicRelationshipConsistency() throws Exception {
		UUID countryId = createCountry("Task 030 Mismatch Country", "QB");
		UUID italyRegionId = createRegion(ITALY_COUNTRY_ID, "Task 030 Italy Region", "IT-T030");

		mockMvc.perform(postJson("/api/master-data/global/areas", areaRequest(countryId, italyRegionId, "Task 030 Invalid Area", "QA-BAD")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.status").value(400))
				.andExpect(jsonPath("$.message").value("Region does not belong to the selected country"));
	}

	@Test
	void openApiIncludesMasterDataGlobalCrudEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/master-data/global/countries']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/countries/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/regions']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/regions/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/areas']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/areas/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/zip-codes']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/zip-codes/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/currencies']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/currencies/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/genders']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/genders/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/marital-statuses']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/marital-statuses/{id}']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/national-identifier-types']").exists())
				.andExpect(jsonPath("$.paths['/api/master-data/global/national-identifier-types/{id}']").exists());
	}

	private UUID createCountry(String name, String isoCode) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/countries", countryRequest(name, isoCode)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private UUID createRegion(UUID countryId, String name, String code) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/regions", regionRequest(countryId, name, code)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private UUID createArea(UUID countryId, UUID regionId, String name, String code) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/areas", areaRequest(countryId, regionId, name, code)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private UUID createZipCode(UUID countryId, UUID regionId, UUID areaId, String city, String postalCode) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/zip-codes", zipCodeRequest(countryId, regionId, areaId, city, postalCode)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private UUID createCurrency(String code, String name, String symbol) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/currencies", currencyRequest(code, name, symbol)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private UUID createGender(String code, String name) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/genders", codeNameRequest(code, name)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private UUID createMaritalStatus(String code, String name) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/marital-statuses", codeNameRequest(code, name)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private UUID createNationalIdentifierType(String code, String name) throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/master-data/global/national-identifier-types", nationalIdentifierTypeRequest(code, name)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();
		return responseId(result);
	}

	private Map<String, Object> countryRequest(String name, String isoCode) {
		return countryRequest(name, isoCode, EUR_CURRENCY_ID);
	}

	private Map<String, Object> countryRequest(String name, String isoCode, UUID defaultCurrencyId) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", name);
		request.put("isoCode", isoCode);
		request.put("phoneCode", "+999");
		if (defaultCurrencyId != null) {
			request.put("defaultCurrencyId", defaultCurrencyId);
		}
		return request;
	}

	private Map<String, Object> regionRequest(UUID countryId, String name, String code) {
		Map<String, Object> request = codeNameRequest(code, name);
		request.put("countryId", countryId);
		return request;
	}

	private Map<String, Object> areaRequest(UUID countryId, UUID regionId, String name, String code) {
		Map<String, Object> request = codeNameRequest(code, name);
		request.put("countryId", countryId);
		request.put("regionId", regionId);
		return request;
	}

	private Map<String, Object> zipCodeRequest(UUID countryId, UUID regionId, UUID areaId, String city, String postalCode) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("countryId", countryId);
		request.put("regionId", regionId);
		request.put("areaId", areaId);
		request.put("city", city);
		request.put("postalCode", postalCode);
		request.put("provinceCode", "T30");
		request.put("provinceName", "Task 030 Province");
		request.put("latitude", "41.9028000");
		request.put("longitude", "12.4964000");
		request.put("sourceType", "MANUAL");
		return request;
	}

	private Map<String, Object> currencyRequest(String code, String name, String symbol) {
		Map<String, Object> request = codeNameRequest(code, name);
		request.put("symbol", symbol);
		return request;
	}

	private Map<String, Object> nationalIdentifierTypeRequest(String code, String name) {
		Map<String, Object> request = codeNameRequest(code, name);
		request.put("countryId", ITALY_COUNTRY_ID);
		request.put("regexPattern", "^[A-Z0-9]+$");
		return request;
	}

	private Map<String, Object> codeNameRequest(String code, String name) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("code", code);
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
}
