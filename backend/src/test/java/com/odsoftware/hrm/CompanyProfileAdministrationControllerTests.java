package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.CompanyProfileType;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.GlobalZipCode;
import com.odsoftware.hrm.entity.master.GlobalZipCodeSourceType;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
class CompanyProfileAdministrationControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");
	private static final UUID TENANT_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000021");
	private static final UUID PLATFORM_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000022");

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
	private GlobalZipCodeRepository globalZipCodeRepository;

	@Test
	@WithMockUser
	void companyProfileAdministrationListsCompanyProfilesWithTenantScope() throws Exception {
		CompanyProfile foundationCompanyProfile = saveCompanyProfile(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				foundFirstCompanyProfileType(FOUNDATION_TENANT_ID),
				"TASK0645_LIST_FOUNDATION");
		Tenant otherTenant = saveTenant("TASK0645_LIST_OTHER_TENANT");
		CompanyProfileType otherType = saveCompanyProfileType(otherTenant, "TASK0645_TYPE_OTH", "Task 064.5 Other Type");
		saveCompanyProfile(otherTenant, otherType, "TASK0645_LIST_OTHER");

		mockMvc.perform(get("/api/admin/company-profiles")
						.with(companyProfileTenantCaller())
						.param("tenantId", FOUNDATION_TENANT_ID.toString())
						.param("search", "TASK0645_LIST"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(foundationCompanyProfile.getId().toString()))
				.andExpect(jsonPath("$.content[0].tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.content[0].code").value("TASK0645_LIST_FOUNDATION"));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationSupportsPlatformListWithoutTenantFilter() throws Exception {
		Tenant otherTenant = saveTenant("TASK0645_PLATFORM_TENANT");
		CompanyProfileType otherType = saveCompanyProfileType(otherTenant, "TASK0645_TYPE_PLATFORM", "Task 064.5 Platform Type");
		CompanyProfile otherTenantCompanyProfile = saveCompanyProfile(otherTenant, otherType, "TASK0645_PLATFORM_PROFILE");

		mockMvc.perform(get("/api/admin/company-profiles")
						.with(companyProfilePlatformCaller())
						.param("search", "TASK0645_PLATFORM_PROFILE"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(otherTenantCompanyProfile.getId().toString()))
				.andExpect(jsonPath("$.content[0].tenant.id").value(otherTenant.getId().toString()));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationReturnsDetail() throws Exception {
		CompanyProfile companyProfile = saveCompanyProfile(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				foundFirstCompanyProfileType(FOUNDATION_TENANT_ID),
				"TASK0645_DETAIL");

		mockMvc.perform(get("/api/admin/company-profiles/{companyProfileId}", companyProfile.getId()).with(companyProfileTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(companyProfile.getId().toString()))
				.andExpect(jsonPath("$.code").value("TASK0645_DETAIL"))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.companyProfileType.id").value(companyProfile.getCompanyProfileType().getId().toString()))
				.andExpect(jsonPath("$.country.code").value("IT"))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationReturnsFormOptions() throws Exception {
		mockMvc.perform(get("/api/admin/company-profiles/form-options").with(companyProfileTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tenants[?(@.id=='" + FOUNDATION_TENANT_ID + "')]").exists())
				.andExpect(jsonPath("$.companyProfileTypes.length()").value(org.hamcrest.Matchers.greaterThan(0)))
				.andExpect(jsonPath("$.countries[?(@.id=='" + FOUNDATION_COUNTRY_ID + "')]").exists());
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationFormOptionsExposeGlobalZipProvinceFields() throws Exception {
		Country italy = countryRepository.findById(FOUNDATION_COUNTRY_ID).orElseThrow();
		GlobalZipCode zipCode = saveGlobalZipCode(italy, "00018", "Palombara Sabina", "RM", "Roma");

		mockMvc.perform(get("/api/admin/company-profiles/form-options").with(companyProfileTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.globalZipCodes[?(@.id=='" + zipCode.getId() + "')].name").value(org.hamcrest.Matchers.hasItem("Palombara Sabina")))
				.andExpect(jsonPath("$.globalZipCodes[?(@.id=='" + zipCode.getId() + "')].provinceName").value(org.hamcrest.Matchers.hasItem("Roma")))
				.andExpect(jsonPath("$.globalZipCodes[?(@.id=='" + zipCode.getId() + "')].provinceCode").value(org.hamcrest.Matchers.hasItem("RM")));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationCreatesCompanyProfileWithTenantAwareAutoCodeAndIgnoresManualCode() throws Exception {
		Tenant tenant = saveTenant("TASK0645_CREATE_TENANT");
		CompanyProfileType type = saveCompanyProfileType(tenant, "TASK0645_TYPE_CREATE", "Task 064.5 Create Type");

		mockMvc.perform(postJson("/api/admin/company-profiles", companyProfileCreateRequest(tenant.getId(), type.getId(), "CP999", "Task 064.5 Create One"))
						.with(companyProfilePlatformCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.code").value("CP001"))
				.andExpect(jsonPath("$.tenant.id").value(tenant.getId().toString()))
				.andExpect(jsonPath("$.legalName").value("Task 064.5 Create One Legal"))
				.andExpect(jsonPath("$.tradeName").value("Task 064.5 Create One"));

		mockMvc.perform(postJson("/api/admin/company-profiles", companyProfileCreateRequest(tenant.getId(), type.getId(), null, "Task 064.5 Create Two"))
						.with(companyProfilePlatformCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.code").value("CP002"));

		Tenant otherTenant = saveTenant("TASK0645_CREATE_OTHER");
		CompanyProfileType otherType = saveCompanyProfileType(otherTenant, "TASK0645_TYPE_CREATE_O", "Task 064.5 Other Type");

		mockMvc.perform(postJson("/api/admin/company-profiles", companyProfileCreateRequest(otherTenant.getId(), otherType.getId(), null, "Task 064.5 Other Tenant"))
						.with(companyProfilePlatformCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.code").value("CP001"));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationUpdatesEditableFieldsAndPreservesCode() throws Exception {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfileType type = foundFirstCompanyProfileType(FOUNDATION_TENANT_ID);
		CompanyProfile companyProfile = saveCompanyProfile(tenant, type, "TASK0645_UPDATE");

		Map<String, Object> request = new LinkedHashMap<>();
		request.put("code", "CP999");
		request.put("companyProfileTypeId", type.getId());
		request.put("legalName", " Task 064.5 Updated Legal ");
		request.put("tradeName", " Task 064.5 Updated Trade ");
		request.put("vatNumber", "IT12345678901");
		request.put("email", "updated@example.com");
		request.put("phone", "+39 3310000000");
		request.put("countryId", FOUNDATION_COUNTRY_ID);
		request.put("globalZipCodeId", foundationGlobalZipCodeIdForCountry(FOUNDATION_COUNTRY_ID));
		request.put("street", " Updated Street ");
		request.put("streetNumber", " 99 ");
		request.put("active", false);

		mockMvc.perform(putJson("/api/admin/company-profiles/" + companyProfile.getId(), request).with(companyProfileTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("TASK0645_UPDATE"))
				.andExpect(jsonPath("$.legalName").value("Task 064.5 Updated Legal"))
				.andExpect(jsonPath("$.tradeName").value("Task 064.5 Updated Trade"))
				.andExpect(jsonPath("$.active").value(true));

		CompanyProfile reloaded = companyProfileRepository.findById(companyProfile.getId()).orElseThrow();
		assertThat(reloaded.getCode()).isEqualTo("TASK0645_UPDATE");
		assertThat(reloaded.getLegalName()).isEqualTo("Task 064.5 Updated Legal");
		assertThat(reloaded.getTradeName()).isEqualTo("Task 064.5 Updated Trade");
		assertThat(reloaded.getActive()).isTrue();
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationActivatesAndDeactivatesCompanyProfile() throws Exception {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfileType type = foundFirstCompanyProfileType(FOUNDATION_TENANT_ID);
		CompanyProfile companyProfile = saveCompanyProfile(tenant, type, "TASK0645_TOGGLE");

		mockMvc.perform(put("/api/admin/company-profiles/{companyProfileId}/deactivate", companyProfile.getId()).with(companyProfileTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(false));

		mockMvc.perform(put("/api/admin/company-profiles/{companyProfileId}/activate", companyProfile.getId()).with(companyProfileTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationDeletesUnreferencedCompanyProfile() throws Exception {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfileType type = foundFirstCompanyProfileType(FOUNDATION_TENANT_ID);
		CompanyProfile companyProfile = saveCompanyProfile(tenant, type, "TASK0645_DELETE_OK");

		mockMvc.perform(delete("/api/admin/company-profiles/{companyProfileId}", companyProfile.getId()).with(companyProfileTenantCaller()))
				.andExpect(status().isNoContent());

		assertThat(companyProfileRepository.findById(companyProfile.getId())).isEmpty();
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationRejectsDeleteWhenCompanyProfileIsReferenced() throws Exception {
		mockMvc.perform(delete("/api/admin/company-profiles/{companyProfileId}", UUID.fromString("80000000-0000-0000-0000-000000000001"))
						.with(companyProfileTenantCaller()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Company profile cannot be deleted because it is referenced by one or more records"));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationRejectsMissingRequiredFields() throws Exception {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", FOUNDATION_TENANT_ID);

		mockMvc.perform(postJson("/api/admin/company-profiles", request).with(companyProfileTenantCaller()))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationRejectsItalianCreateWithoutVatNumber() throws Exception {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfileType type = foundFirstCompanyProfileType(FOUNDATION_TENANT_ID);
		Map<String, Object> request = companyProfileCreateRequest(tenant.getId(), type.getId(), null, "Task 064.5 Missing Vat");
		request.put("vatNumber", null);

		mockMvc.perform(postJson("/api/admin/company-profiles", request).with(companyProfileTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("VAT number is required for Italy"));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationRejectsForeignCreateWithoutTaxIdentifier() throws Exception {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfileType type = foundFirstCompanyProfileType(FOUNDATION_TENANT_ID);
		UUID foreignCountryId = countryIdByIsoCode("FR");
		Map<String, Object> request = companyProfileCreateRequest(tenant.getId(), type.getId(), null, "Task 064.5 Missing Tax Identifier");
		request.put("countryId", foreignCountryId);
		request.put("globalZipCodeId", foundationGlobalZipCodeIdForCountry(foreignCountryId));
		request.put("vatNumber", null);
		request.put("taxIdentifier", null);

		mockMvc.perform(postJson("/api/admin/company-profiles", request).with(companyProfileTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Tax identifier is required for non-Italian countries"));
	}

	@Test
	void companyProfileAdministrationRejectsCallerWithoutReadPermission() throws Exception {
		mockMvc.perform(get("/api/admin/company-profiles").with(companyProfileTenantCaller("TENANT.COMPANY_PROFILE.UPDATE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void companyProfileAdministrationRejectsDeleteWithoutDeletePermission() throws Exception {
		mockMvc.perform(delete("/api/admin/company-profiles/{companyProfileId}", UUID.fromString("80000000-0000-0000-0000-000000000001"))
						.with(companyProfileTenantCaller("TENANT.COMPANY_PROFILE.READ", "TENANT.COMPANY_PROFILE.UPDATE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationRejectsCrossTenantDetailForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK0645_SCOPE_OTHER");
		CompanyProfileType otherType = saveCompanyProfileType(otherTenant, "TASK0645_SCOPE_TYPE", "Task 064.5 Scope Type");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, otherType, "TASK0645_SCOPE_PROFILE");

		mockMvc.perform(get("/api/admin/company-profiles/{companyProfileId}", otherCompanyProfile.getId()).with(companyProfileTenantCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant company profile administration is not allowed for caller"));
	}

	@Test
	@WithMockUser
	void companyProfileAdministrationReturnsNotFoundForMissingCompanyProfile() throws Exception {
		mockMvc.perform(get("/api/admin/company-profiles/{companyProfileId}", MISSING_ID).with(companyProfileTenantCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Company profile not found: " + MISSING_ID));
	}

	@Test
	void companyProfileAdministrationPublishesApiDocumentation() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles/form-options']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles/{companyProfileId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles/{companyProfileId}/activate'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles/{companyProfileId}/deactivate'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/company-profiles/{companyProfileId}'].delete").exists());
	}

	private Tenant saveTenant(String code) {
		Country country = countryRepository.findById(FOUNDATION_COUNTRY_ID).orElseThrow();
		Tenant tenant = new Tenant();
		tenant.setCode(code);
		tenant.setName(code);
		tenant.setLegalName(code + " Legal");
		tenant.setDefaultCountry(country);
		tenant.setDefaultCurrency(currencyRepository.findById(UUID.fromString("10000000-0000-0000-0000-000000000001")).orElseThrow());
		tenant.setActive(true);
		return tenantRepository.saveAndFlush(tenant);
	}

	private CompanyProfileType foundFirstCompanyProfileType(UUID tenantId) {
		return companyProfileTypeRepository.findAll().stream()
				.filter(type -> tenantId.equals(type.getTenantId()))
				.findFirst()
				.orElseThrow();
	}

	private CompanyProfileType saveCompanyProfileType(Tenant tenant, String code, String name) {
		CompanyProfileType companyProfileType = new CompanyProfileType();
		companyProfileType.setTenantId(tenant.getId());
		companyProfileType.setCode(code);
		companyProfileType.setName(name);
		companyProfileType.setActive(true);
		return companyProfileTypeRepository.saveAndFlush(companyProfileType);
	}

	private CompanyProfile saveCompanyProfile(Tenant tenant, CompanyProfileType type, String code) {
		Country country = countryRepository.findById(FOUNDATION_COUNTRY_ID).orElseThrow();
		CompanyProfile companyProfile = new CompanyProfile();
		companyProfile.setTenant(tenant);
		companyProfile.setCompanyProfileType(type);
		companyProfile.setCode(code);
		companyProfile.setLegalName(code + " Legal");
		companyProfile.setTradeName(code);
		companyProfile.setCountry(country);
		companyProfile.setStreet("Task 064.5 Street");
		companyProfile.setStreetNumber("1");
		companyProfile.setActive(true);
		return companyProfileRepository.saveAndFlush(companyProfile);
	}

	private Map<String, Object> companyProfileCreateRequest(UUID tenantId, UUID companyProfileTypeId, String manualCode, String tradeName) {
		Map<String, Object> request = new LinkedHashMap<>();
		if (manualCode != null) {
			request.put("code", manualCode);
		}
		request.put("tenantId", tenantId);
		request.put("companyProfileTypeId", companyProfileTypeId);
		request.put("legalName", tradeName + " Legal");
		request.put("tradeName", tradeName);
		request.put("vatNumber", "IT12345678901");
		request.put("email", "company.profile@example.com");
		request.put("phone", "+39 3310000000");
		request.put("countryId", FOUNDATION_COUNTRY_ID);
		request.put("globalZipCodeId", foundationGlobalZipCodeIdForCountry(FOUNDATION_COUNTRY_ID));
		request.put("street", "Task 064.5 Street");
		request.put("streetNumber", "1");
		return request;
	}

	private UUID foundationGlobalZipCodeIdForCountry(UUID countryId) {
		return globalZipCodeRepository.findAll().stream()
				.filter(zipCode -> countryId.equals(zipCode.getCountry().getId()))
				.filter(zipCode -> Boolean.TRUE.equals(zipCode.getActive()))
				.map(GlobalZipCode::getId)
				.findFirst()
				.orElseGet(() -> saveGlobalZipCode(countryRepository.findById(countryId).orElseThrow()).getId());
	}

	private UUID countryIdByIsoCode(String isoCode) {
		return countryRepository.findAll().stream()
				.filter(country -> isoCode.equalsIgnoreCase(country.getIsoCode()))
				.map(Country::getId)
				.findFirst()
				.orElseThrow();
	}

	private GlobalZipCode saveGlobalZipCode(Country country) {
		return saveGlobalZipCode(country, "1000" + country.getIsoCode(), "Test City " + country.getIsoCode(), "TEST", "Test Province");
	}

	private GlobalZipCode saveGlobalZipCode(Country country, String postalCode, String city, String provinceCode, String provinceName) {
		GlobalZipCode globalZipCode = new GlobalZipCode();
		globalZipCode.setTenantId(null);
		globalZipCode.setTenantScopeKey(country.getId());
		globalZipCode.setCountry(country);
		globalZipCode.setCity(city);
		globalZipCode.setPostalCode(postalCode);
		globalZipCode.setProvinceCode(provinceCode);
		globalZipCode.setProvinceName(provinceName);
		globalZipCode.setSourceType(GlobalZipCodeSourceType.MANUAL);
		globalZipCode.setActive(true);
		return globalZipCodeRepository.saveAndFlush(globalZipCode);
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

	private RequestPostProcessor companyProfilePlatformCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {"PLATFORM.COMPANY_PROFILE.READ", "PLATFORM.COMPANY_PROFILE.CREATE", "PLATFORM.COMPANY_PROFILE.UPDATE", "PLATFORM.COMPANY_PROFILE.DELETE"}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_PLATFORM_SUPER_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("platform.company.admin@example.com")
						.claim("userId", PLATFORM_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "PLATFORM_SUPER_ADMIN"))
				.authorities(grantedAuthorities);
	}

	private RequestPostProcessor companyProfileTenantCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {"TENANT.COMPANY_PROFILE.READ", "TENANT.COMPANY_PROFILE.CREATE", "TENANT.COMPANY_PROFILE.UPDATE", "TENANT.COMPANY_PROFILE.DELETE"}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_TENANT_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("tenant.company.admin@example.com")
						.claim("userId", TENANT_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "TENANT_ADMIN"))
				.authorities(grantedAuthorities);
	}
}
