package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.CompanyProfileType;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Currency;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
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
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class TenantAdministrationControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_CURRENCY_ID = UUID.fromString("10000000-0000-0000-0000-000000000001");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");
	private static final UUID PLATFORM_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000010");
	private static final UUID TENANT_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000011");
	private static final UUID COMPANY_PROFILE_TYPE_ID = UUID.fromString("73000000-0000-0000-0000-000000000008");

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private CurrencyRepository currencyRepository;

	@Autowired
	private CompanyProfileRepository companyProfileRepository;

	@Autowired
	private CompanyProfileTypeRepository companyProfileTypeRepository;

	@Test
	@WithMockUser
	void tenantAdministrationListsTenantsWithSearch() throws Exception {
		Tenant tenant = saveTenant("TASK064_LIST", "Task 064 List");

		mockMvc.perform(get("/api/admin/tenants")
						.with(platformTenantAdminCaller())
						.param("search", "TASK064_LIST"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(tenant.getId().toString()))
				.andExpect(jsonPath("$.content[0].code").value("TASK064_LIST"))
				.andExpect(jsonPath("$.content[0].defaultCountry.code").value("IT"))
				.andExpect(jsonPath("$.content[0].defaultCurrency.code").value("EUR"));
	}

	@Test
	@WithMockUser
	void tenantAdministrationReturnsFormOptions() throws Exception {
		mockMvc.perform(get("/api/admin/tenants/form-options").with(platformTenantAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.countries[0].id").exists())
				.andExpect(jsonPath("$.currencies[0].id").exists());
	}

	@Test
	@WithMockUser
	void tenantAdministrationReturnsTenantDetail() throws Exception {
		Tenant tenant = saveTenant("TASK064_DETAIL", "Task 064 Detail");

		mockMvc.perform(get("/api/admin/tenants/{tenantId}", tenant.getId()).with(platformTenantAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(tenant.getId().toString()))
				.andExpect(jsonPath("$.code").value("TASK064_DETAIL"))
				.andExpect(jsonPath("$.defaultCountry.code").value("IT"))
				.andExpect(jsonPath("$.defaultCurrency.code").value("EUR"));
	}

	@Test
	@WithMockUser
	void tenantAdministrationCreatesTenant() throws Exception {
		String expectedCode = nextTenantAutoCode();
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", " Task 064 Create ");
		request.put("legalName", " Task 064 Create Legal ");
		request.put("defaultCountryId", FOUNDATION_COUNTRY_ID);
		request.put("defaultCurrencyId", FOUNDATION_CURRENCY_ID);
		request.put("active", true);

		mockMvc.perform(postJson("/api/admin/tenants", request).with(platformTenantAdminCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.code").value(expectedCode))
				.andExpect(jsonPath("$.name").value("Task 064 Create"))
				.andExpect(jsonPath("$.legalName").value("Task 064 Create Legal"))
				.andExpect(jsonPath("$.active").value(true));

		assertThat(tenantRepository.existsByCode(expectedCode)).isTrue();
	}

	@Test
	@WithMockUser
	void tenantAdministrationCreatesTenantUsingNextProgressiveCode() throws Exception {
		int currentMaxProgressive = currentTenantAutoCodeProgressive();
		saveTenant(tenantAutoCode(currentMaxProgressive + 1), "Task 064 Existing 1");

		mockMvc.perform(postJson("/api/admin/tenants", tenantRequest("Task 064 Progressive 2")).with(platformTenantAdminCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.code").value(tenantAutoCode(currentMaxProgressive + 2)));
	}

	@Test
	@WithMockUser
	void tenantAdministrationCreateIgnoresManualCodePayload() throws Exception {
		String expectedCode = nextTenantAutoCode();
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("code", "MANUAL_TENANT_CODE");
		request.put("name", "Task 064 Manual Code Ignored");
		request.put("legalName", "Task 064 Manual Code Ignored Legal");
		request.put("defaultCountryId", FOUNDATION_COUNTRY_ID);
		request.put("defaultCurrencyId", FOUNDATION_CURRENCY_ID);
		request.put("active", true);

		mockMvc.perform(postJson("/api/admin/tenants", request).with(platformTenantAdminCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.code").value(expectedCode));
	}

	@Test
	@WithMockUser
	void tenantAdministrationUpdatesTenant() throws Exception {
		Tenant tenant = saveTenant("TASK064_UPDATE", "Task 064 Update");

		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", " Task 064 Updated ");
		request.put("legalName", " Task 064 Updated Legal ");
		request.put("defaultCountryId", FOUNDATION_COUNTRY_ID);
		request.put("defaultCurrencyId", FOUNDATION_CURRENCY_ID);

		mockMvc.perform(putJson("/api/admin/tenants/" + tenant.getId(), request).with(platformTenantAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("TASK064_UPDATE"))
				.andExpect(jsonPath("$.name").value("Task 064 Updated"))
				.andExpect(jsonPath("$.legalName").value("Task 064 Updated Legal"));
	}

	@Test
	@WithMockUser
	void tenantAdministrationUpdateIgnoresManualCodePayload() throws Exception {
		Tenant tenant = saveTenant("TASK064_UPDATE_IGNORE", "Task 064 Update Ignore Code");

		Map<String, Object> request = new LinkedHashMap<>();
		request.put("code", "TE999");
		request.put("name", "Task 064 Updated Without Code Change");
		request.put("legalName", "Task 064 Updated Without Code Change Legal");
		request.put("defaultCountryId", FOUNDATION_COUNTRY_ID);
		request.put("defaultCurrencyId", FOUNDATION_CURRENCY_ID);

		mockMvc.perform(putJson("/api/admin/tenants/" + tenant.getId(), request).with(platformTenantAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.code").value("TASK064_UPDATE_IGNORE"))
				.andExpect(jsonPath("$.name").value("Task 064 Updated Without Code Change"));
	}

	@Test
	@WithMockUser
	void tenantAdministrationActivatesAndDeactivatesTenant() throws Exception {
		Tenant tenant = saveTenant("TASK064_TOGGLE", "Task 064 Toggle");
		tenant.setActive(false);
		tenantRepository.saveAndFlush(tenant);

		mockMvc.perform(put("/api/admin/tenants/{tenantId}/activate", tenant.getId()).with(platformTenantAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(true));

		mockMvc.perform(put("/api/admin/tenants/{tenantId}/deactivate", tenant.getId()).with(platformTenantAdminCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(false));
	}

	@Test
	@WithMockUser
	void tenantAdministrationDeletesUnreferencedTenant() throws Exception {
		Tenant tenant = saveTenant("TASK064_DELETE", "Task 064 Delete");

		mockMvc.perform(delete("/api/admin/tenants/{tenantId}", tenant.getId()).with(platformTenantAdminCaller()))
				.andExpect(status().isNoContent());

		assertThat(tenantRepository.findById(tenant.getId())).isEmpty();
	}

	@Test
	@WithMockUser
	void tenantAdministrationRejectsDeleteForFoundationTenant() throws Exception {
		mockMvc.perform(delete("/api/admin/tenants/{tenantId}", FOUNDATION_TENANT_ID).with(platformTenantAdminCaller()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Foundation tenant cannot be deleted"));
	}

	@Test
	@WithMockUser
	void tenantAdministrationRejectsDeleteWhenTenantIsReferenced() throws Exception {
		Tenant tenant = saveTenant("TASK064_REFERENCED", "Task 064 Referenced");
		saveCompanyProfile(tenant, "TASK064_COMPANY");

		mockMvc.perform(delete("/api/admin/tenants/{tenantId}", tenant.getId()).with(platformTenantAdminCaller()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Tenant cannot be deleted because it is referenced by one or more records"));
	}

	@Test
	void tenantAdministrationRejectsTenantCaller() throws Exception {
		mockMvc.perform(get("/api/admin/tenants").with(tenantCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void tenantAdministrationRejectsPlatformCallerWithoutReadPermission() throws Exception {
		mockMvc.perform(get("/api/admin/tenants").with(platformTenantAdminCaller("PLATFORM.TENANT.UPDATE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	@WithMockUser
	void tenantAdministrationReturnsNotFoundForMissingTenant() throws Exception {
		mockMvc.perform(get("/api/admin/tenants/{tenantId}", MISSING_ID).with(platformTenantAdminCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Tenant not found: " + MISSING_ID));
	}

	@Test
	@WithMockUser
	void openApiIncludesTenantAdministrationEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/tenants']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/tenants'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/tenants'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/tenants/form-options']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/tenants/{tenantId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/tenants/{tenantId}/activate']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/tenants/{tenantId}/deactivate']").exists());
	}

	private Tenant saveTenant(String code, String name) {
		Country country = countryRepository.findById(FOUNDATION_COUNTRY_ID).orElseThrow();
		Currency currency = currencyRepository.findById(FOUNDATION_CURRENCY_ID).orElseThrow();
		Tenant tenant = new Tenant();
		tenant.setCode(code);
		tenant.setName(name);
		tenant.setLegalName(name + " Legal");
		tenant.setDefaultCountry(country);
		tenant.setDefaultCurrency(currency);
		tenant.setActive(true);
		return tenantRepository.saveAndFlush(tenant);
	}

	private CompanyProfile saveCompanyProfile(Tenant tenant, String code) {
		CompanyProfile baseCompanyProfile = companyProfileRepository.findAll().stream()
				.filter(candidate -> FOUNDATION_TENANT_ID.equals(candidate.getTenant().getId()))
				.findFirst()
				.orElseThrow();

		CompanyProfile companyProfile = new CompanyProfile();
		companyProfile.setTenant(tenant);
		companyProfile.setCompanyProfileType(baseCompanyProfile.getCompanyProfileType());
		companyProfile.setCode(code);
		companyProfile.setLegalName(code + " Legal Entity");
		companyProfile.setTradeName(code);
		companyProfile.setCountry(baseCompanyProfile.getCountry());
		companyProfile.setStreet("Task 064 Street");
		companyProfile.setStreetNumber("1");
		companyProfile.setActive(true);
		return companyProfileRepository.saveAndFlush(companyProfile);
	}

	private Map<String, Object> tenantRequest(String name) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", name);
		request.put("legalName", name + " Legal");
		request.put("defaultCountryId", FOUNDATION_COUNTRY_ID);
		request.put("defaultCurrencyId", FOUNDATION_CURRENCY_ID);
		request.put("active", true);
		return request;
	}

	private String nextTenantAutoCode() {
		return tenantAutoCode(currentTenantAutoCodeProgressive() + 1);
	}

	private int currentTenantAutoCodeProgressive() {
		int maxProgressive = 0;
		for (Tenant tenant : tenantRepository.findAll()) {
			String code = tenant.getCode();
			if (code == null || !code.startsWith("TE") || code.length() != 5) {
				continue;
			}
			String progressive = code.substring(2);
			if (!progressive.chars().allMatch(Character::isDigit)) {
				continue;
			}
			maxProgressive = Math.max(maxProgressive, Integer.parseInt(progressive));
		}
		return maxProgressive;
	}

	private String tenantAutoCode(int progressive) {
		return "TE" + String.format("%03d", progressive);
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

	private RequestPostProcessor platformTenantAdminCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {"PLATFORM.TENANT.READ", "PLATFORM.TENANT.CREATE", "PLATFORM.TENANT.UPDATE", "PLATFORM.TENANT.DELETE"}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_PLATFORM_SUPER_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("platform.tenant.admin@example.com")
						.claim("userId", PLATFORM_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "PLATFORM_SUPER_ADMIN"))
				.authorities(grantedAuthorities);
	}

	private RequestPostProcessor tenantCaller() {
		var grantedAuthorities = Stream.of("USER_TYPE_TENANT_ADMIN", "TENANT.TENANT.READ")
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("tenant.admin@example.com")
						.claim("userId", TENANT_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "TENANT_ADMIN"))
				.authorities(grantedAuthorities);
	}
}
