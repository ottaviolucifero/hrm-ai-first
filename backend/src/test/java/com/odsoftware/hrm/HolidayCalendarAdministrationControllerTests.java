package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.calendar.Holiday;
import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import com.odsoftware.hrm.entity.calendar.HolidayGenerationRule;
import com.odsoftware.hrm.entity.calendar.HolidayType;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Permission;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.rbac.RolePermission;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import com.odsoftware.hrm.repository.calendar.HolidayCalendarRepository;
import com.odsoftware.hrm.repository.calendar.HolidayRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.PermissionRepository;
import com.odsoftware.hrm.repository.master.RoleRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import com.odsoftware.hrm.repository.rbac.RolePermissionRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;
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
@Transactional
class HolidayCalendarAdministrationControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID ITALY_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000003");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000041");
	private static final UUID PLATFORM_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000042");
	private static final String VALID_PASSWORD = "Secret1!";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private CountryRepository countryRepository;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private HolidayCalendarRepository holidayCalendarRepository;

	@Autowired
	private HolidayRepository holidayRepository;

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private AuthenticationMethodRepository authenticationMethodRepository;

	@Autowired
	private PermissionRepository permissionRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private RolePermissionRepository rolePermissionRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private UserTenantAccessRepository userTenantAccessRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	@WithMockUser
	void holidayCalendarAdministrationCreatesCalendar() throws Exception {
		MvcResult result = mockMvc.perform(postJson("/api/admin/holiday-calendars", calendarRequest(ITALY_COUNTRY_ID, 2026, " Tunisia 2026 "))
						.with(holidayTenantCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.country.id").value(ITALY_COUNTRY_ID.toString()))
				.andExpect(jsonPath("$.year").value(2026))
				.andExpect(jsonPath("$.name").value("Tunisia 2026"))
				.andExpect(jsonPath("$.active").value(true))
				.andReturn();

		UUID calendarId = UUID.fromString(objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asText());
		assertThat(holidayCalendarRepository.findById(calendarId)).isPresent();
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsMissingCountry() throws Exception {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("year", 2026);
		request.put("name", "Missing Country");

		mockMvc.perform(postJson("/api/admin/holiday-calendars", request).with(holidayTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.validationErrors.countryId").exists());
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsMissingYear() throws Exception {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("countryId", ITALY_COUNTRY_ID);
		request.put("name", "Missing Year");

		mockMvc.perform(postJson("/api/admin/holiday-calendars", request).with(holidayTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.validationErrors.year").exists());
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsDuplicateCountryYear() throws Exception {
		saveCalendar(2026, "Existing Calendar");

		mockMvc.perform(postJson("/api/admin/holiday-calendars", calendarRequest(ITALY_COUNTRY_ID, 2026, "Duplicate Calendar"))
						.with(holidayTenantCaller()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Holiday calendar already exists for country and year"));
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationCreatesHolidayWithinCalendarYear() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Italy 2026");

		mockMvc.perform(postJson("/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays",
						holidayRequest("Republic Day", "2026-06-02", "2026-06-02", "FIXED", "FIXED_DATE"))
						.with(holidayTenantCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.holidayCalendarId").value(holidayCalendar.getId().toString()))
				.andExpect(jsonPath("$.name").value("Republic Day"))
				.andExpect(jsonPath("$.type").value("FIXED"))
				.andExpect(jsonPath("$.generationRule").value("FIXED_DATE"));

		assertThat(holidayRepository.findByHolidayCalendar_IdOrderByStartDateAscNameAsc(holidayCalendar.getId())).hasSize(1);
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsMissingHolidayStartDate() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Italy 2026");
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", "Missing Start");
		request.put("endDate", "2026-06-02");
		request.put("type", "FIXED");
		request.put("generationRule", "FIXED_DATE");

		mockMvc.perform(postJson("/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays", request)
						.with(holidayTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.validationErrors.startDate").exists());
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsMissingHolidayEndDate() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Italy 2026");
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", "Missing End");
		request.put("startDate", "2026-06-02");
		request.put("type", "FIXED");
		request.put("generationRule", "FIXED_DATE");

		mockMvc.perform(postJson("/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays", request)
						.with(holidayTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.validationErrors.endDate").exists());
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsHolidayWhenEndDatePrecedesStartDate() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Italy 2026");

		mockMvc.perform(postJson("/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays",
						holidayRequest("Invalid Range", "2026-06-03", "2026-06-01", "FIXED", "FIXED_DATE"))
						.with(holidayTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Holiday endDate must be on or after startDate"));
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsHolidayOutsideCalendarYear() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Italy 2026");

		mockMvc.perform(postJson("/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays",
						holidayRequest("Outside Year", "2026-12-31", "2027-01-01", "MOBILE", "MANUAL"))
						.with(holidayTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Holiday dates must stay within the holiday calendar year"));
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationSupportsMultiDayHoliday() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Tunisia 2026");

		mockMvc.perform(postJson("/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays",
						holidayRequest("Aid al-Fitr", "2026-03-20", "2026-03-21", "MOBILE", "MANUAL"))
						.with(holidayTenantCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("Aid al-Fitr"))
				.andExpect(jsonPath("$.startDate").value("2026-03-20"))
				.andExpect(jsonPath("$.endDate").value("2026-03-21"))
				.andExpect(jsonPath("$.type").value("MOBILE"))
				.andExpect(jsonPath("$.generationRule").value("MANUAL"));
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationRejectsOverlapWithinSameCalendar() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Tunisia 2026");
		saveHoliday(holidayCalendar, "Aid Existing", LocalDate.of(2026, 3, 20), LocalDate.of(2026, 3, 21));

		mockMvc.perform(postJson("/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays",
						holidayRequest("Aid Overlap", "2026-03-21", "2026-03-22", "MOBILE", "MANUAL"))
						.with(holidayTenantCaller()))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.message").value("Holiday dates overlap with an existing holiday in the same calendar"));
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationUpdatesHolidayExcludingSelfFromOverlapCheck() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Tunisia 2026");
		Holiday holiday = saveHoliday(holidayCalendar, "Aid Existing", LocalDate.of(2026, 3, 20), LocalDate.of(2026, 3, 21));

		mockMvc.perform(putJson(
						"/api/admin/holiday-calendars/" + holidayCalendar.getId() + "/holidays/" + holiday.getId(),
						holidayRequest("Aid Existing Updated", "2026-03-20", "2026-03-21", "MOBILE", "MANUAL"))
						.with(holidayTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Aid Existing Updated"));
	}

	@Test
	@WithMockUser
	void holidayCalendarAdministrationProtectsCrudEndpointsWithAuthorities() throws Exception {
		HolidayCalendar holidayCalendar = saveCalendar(2026, "Italy 2026");

		mockMvc.perform(get("/api/admin/holiday-calendars").with(holidayTenantCaller("TENANT.HOLIDAY_CALENDAR.READ")))
				.andExpect(status().isOk());

		mockMvc.perform(postJson("/api/admin/holiday-calendars", calendarRequest(ITALY_COUNTRY_ID, 2027, "No Create Authority"))
						.with(holidayTenantCaller("TENANT.HOLIDAY_CALENDAR.READ")))
				.andExpect(status().isForbidden());

		mockMvc.perform(delete("/api/admin/holiday-calendars/{calendarId}", holidayCalendar.getId())
						.with(holidayPlatformCaller("PLATFORM.HOLIDAY_CALENDAR.DELETE")))
				.andExpect(status().isNoContent());
	}

	@Test
	void holidayCalendarAdministrationAllowsCreateWithTenantJwtAndCreatePermission() throws Exception {
		UserAccount userAccount = saveTenantAdminUser(
				"task0672.holiday.create@example.com",
				VALID_PASSWORD,
				"TENANT.HOLIDAY_CALENDAR.CREATE");
		String accessToken = loginAndReadToken(userAccount.getEmail(), VALID_PASSWORD);

		mockMvc.perform(get("/api/auth/me")
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.authorities[?(@=='TENANT.HOLIDAY_CALENDAR.CREATE')]").exists());

		mockMvc.perform(postJson("/api/admin/holiday-calendars", calendarRequest(ITALY_COUNTRY_ID, 2028, "Austria 2028"))
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.country.id").value(ITALY_COUNTRY_ID.toString()))
				.andExpect(jsonPath("$.year").value(2028))
				.andExpect(jsonPath("$.name").value("Austria 2028"));
	}

	@Test
	void holidayCalendarAdministrationRejectsCreateWithTenantJwtWhenCallerHasOnlyReadPermission() throws Exception {
		UserAccount userAccount = saveTenantAdminUser(
				"task0672.holiday.readonly@example.com",
				VALID_PASSWORD,
				"TENANT.HOLIDAY_CALENDAR.READ");
		String accessToken = loginAndReadToken(userAccount.getEmail(), VALID_PASSWORD);

		mockMvc.perform(postJson("/api/admin/holiday-calendars", calendarRequest(ITALY_COUNTRY_ID, 2029, "Austria 2029"))
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void holidayCalendarAdministrationAllowsReadWithTenantJwtAndReadPermission() throws Exception {
		saveCalendar(2030, "Austria 2030");
		UserAccount userAccount = saveTenantAdminUser(
				"task0672.holiday.read@example.com",
				VALID_PASSWORD,
				"TENANT.HOLIDAY_CALENDAR.READ");
		String accessToken = loginAndReadToken(userAccount.getEmail(), VALID_PASSWORD);

		mockMvc.perform(get("/api/admin/holiday-calendars")
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken))
				.andExpect(status().isOk());
	}

	@Test
	void openApiIncludesHolidayCalendarAdministrationEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/holiday-calendars']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/holiday-calendars/{calendarId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/holiday-calendars/{calendarId}/holidays']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/holiday-calendars/{calendarId}/holidays/{holidayId}']").exists());
	}

	private Map<String, Object> calendarRequest(UUID countryId, Integer year, String name) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("countryId", countryId);
		request.put("year", year);
		request.put("name", name);
		return request;
	}

	private Map<String, Object> holidayRequest(String name, String startDate, String endDate, String type, String generationRule) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("name", name);
		request.put("startDate", startDate);
		request.put("endDate", endDate);
		request.put("type", type);
		request.put("generationRule", generationRule);
		request.put("description", "Manual holiday entry");
		return request;
	}

	private HolidayCalendar saveCalendar(Integer year, String name) {
		Country country = countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow();
		HolidayCalendar holidayCalendar = new HolidayCalendar();
		holidayCalendar.setCountry(country);
		holidayCalendar.setYear(year);
		holidayCalendar.setName(name);
		holidayCalendar.setActive(true);
		return holidayCalendarRepository.saveAndFlush(holidayCalendar);
	}

	private Holiday saveHoliday(HolidayCalendar holidayCalendar, String name, LocalDate startDate, LocalDate endDate) {
		Holiday holiday = new Holiday();
		holiday.setHolidayCalendar(holidayCalendar);
		holiday.setName(name);
		holiday.setStartDate(startDate);
		holiday.setEndDate(endDate);
		holiday.setType(HolidayType.MOBILE);
		holiday.setGenerationRule(HolidayGenerationRule.MANUAL);
		holiday.setDescription("Manual holiday entry");
		return holidayRepository.saveAndFlush(holiday);
	}

	private String loginAndReadToken(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest(email, password))))
				.andExpect(status().isOk())
				.andReturn();
		return objectMapper.readTree(result.getResponse().getContentAsString()).get("accessToken").asText();
	}

	private Map<String, String> loginRequest(String email, String password) {
		Map<String, String> request = new LinkedHashMap<>();
		request.put("email", email);
		request.put("password", password);
		return request;
	}

	private UserAccount saveTenantAdminUser(String email, String password, String... permissionCodes) {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		UserAccount userAccount = new UserAccount();
		userAccount.setTenant(tenant);
		userAccount.setUserType(userTypeRepository.findById(TENANT_ADMIN_USER_TYPE_ID).orElseThrow());
		userAccount.setAuthenticationMethod(authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID).orElseThrow());
		userAccount.setEmail(email);
		userAccount.setPasswordHash(passwordEncoder.encode(password));
		userAccount.setActive(true);
		userAccount.setLocked(false);
		UserAccount savedUserAccount = userAccountRepository.saveAndFlush(userAccount);
		assignPermissions(savedUserAccount, permissionCodes);
		return savedUserAccount;
	}

	private void assignPermissions(UserAccount userAccount, String... permissionCodes) {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		UserTenantAccess tenantAccess = new UserTenantAccess();
		tenantAccess.setUserAccount(userAccount);
		tenantAccess.setTenant(tenant);
		tenantAccess.setAccessRole("TENANT_ADMIN");
		tenantAccess.setActive(true);
		userTenantAccessRepository.saveAndFlush(tenantAccess);

		Role role = new Role();
		role.setTenantId(FOUNDATION_TENANT_ID);
		role.setCode("HOLIDAY_TEST_" + userAccount.getId().toString().replace("-", "").substring(0, 12).toUpperCase(Locale.ROOT));
		role.setName("Holiday calendar test role");
		role.setSystemRole(false);
		role.setActive(true);
		role = roleRepository.saveAndFlush(role);

		UserRole userRole = new UserRole();
		userRole.setTenant(tenant);
		userRole.setUserAccount(userAccount);
		userRole.setRole(role);
		userRoleRepository.saveAndFlush(userRole);

		for (String permissionCode : permissionCodes) {
			Permission permission = permissionRepository.findAll().stream()
					.filter(candidate -> FOUNDATION_TENANT_ID.equals(candidate.getTenantId()))
					.filter(candidate -> permissionCode.equals(candidate.getCode()))
					.findFirst()
					.orElseThrow();
			RolePermission rolePermission = new RolePermission();
			rolePermission.setTenant(tenant);
			rolePermission.setRole(role);
			rolePermission.setPermission(permission);
			rolePermissionRepository.saveAndFlush(rolePermission);
		}
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

	private RequestPostProcessor holidayTenantCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {
						"TENANT.HOLIDAY_CALENDAR.READ",
						"TENANT.HOLIDAY_CALENDAR.CREATE",
						"TENANT.HOLIDAY_CALENDAR.UPDATE",
						"TENANT.HOLIDAY_CALENDAR.DELETE"
				}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_TENANT_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("tenant.holiday.admin@example.com")
						.claim("userId", TENANT_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "TENANT_ADMIN"))
				.authorities(grantedAuthorities);
	}

	private RequestPostProcessor holidayPlatformCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {
						"PLATFORM.HOLIDAY_CALENDAR.READ",
						"PLATFORM.HOLIDAY_CALENDAR.CREATE",
						"PLATFORM.HOLIDAY_CALENDAR.UPDATE",
						"PLATFORM.HOLIDAY_CALENDAR.DELETE"
				}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_PLATFORM_SUPER_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("platform.holiday.admin@example.com")
						.claim("userId", PLATFORM_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "PLATFORM_SUPER_ADMIN"))
				.authorities(grantedAuthorities);
	}
}
