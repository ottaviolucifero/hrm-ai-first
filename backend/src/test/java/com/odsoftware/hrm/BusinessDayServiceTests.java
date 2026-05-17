package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.calendar.Holiday;
import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import com.odsoftware.hrm.entity.calendar.HolidayCalendarScope;
import com.odsoftware.hrm.entity.calendar.HolidayGenerationRule;
import com.odsoftware.hrm.entity.calendar.HolidayType;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.CompanyProfileType;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.repository.calendar.HolidayCalendarRepository;
import com.odsoftware.hrm.repository.calendar.HolidayRepository;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.service.BusinessDayService;
import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class BusinessDayServiceTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_PROFILE_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID ITALY_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");

	@Autowired
	private BusinessDayService businessDayService;

	@Autowired
	private HolidayCalendarRepository holidayCalendarRepository;

	@Autowired
	private HolidayRepository holidayRepository;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private CompanyProfileRepository companyProfileRepository;

	@Autowired
	private CompanyProfileTypeRepository companyProfileTypeRepository;

	@Autowired
	private CountryRepository countryRepository;

	@Test
	void businessDayServiceTreatsSaturdayAndSundayAsWeekend() {
		assertThat(businessDayService.isWeekend(LocalDate.of(2090, 1, 7))).isTrue();
		assertThat(businessDayService.isWeekend(LocalDate.of(2090, 1, 8))).isTrue();
		assertThat(businessDayService.isWeekend(LocalDate.of(2090, 1, 9))).isFalse();
	}

	@Test
	void businessDayServiceTreatsWeekdayWithoutHolidayAsWorkingDay() {
		assertThat(businessDayService.isWorkingDay(LocalDate.of(2090, 1, 9), FOUNDATION_TENANT_ID)).isTrue();
	}

	@Test
	void businessDayServiceTreatsSingleDayHolidayAsNonWorkingDay() {
		HolidayCalendar calendar = saveGlobalCalendar(2091);
		saveHoliday(calendar, "Single Day", LocalDate.of(2091, 5, 1), LocalDate.of(2091, 5, 1));

		assertThat(businessDayService.isHoliday(LocalDate.of(2091, 5, 1), FOUNDATION_TENANT_ID)).isTrue();
		assertThat(businessDayService.isWorkingDay(LocalDate.of(2091, 5, 1), FOUNDATION_TENANT_ID)).isFalse();
		assertThat(businessDayService.isWorkingDay(LocalDate.of(2091, 5, 2), FOUNDATION_TENANT_ID)).isTrue();
	}

	@Test
	void businessDayServiceTreatsEveryDateInsideMultiDayHolidayAsNonWorkingDay() {
		HolidayCalendar calendar = saveGlobalCalendar(2092);
		saveHoliday(calendar, "Multi Day", LocalDate.of(2092, 3, 20), LocalDate.of(2092, 3, 22));

		assertThat(businessDayService.isHoliday(LocalDate.of(2092, 3, 20), FOUNDATION_TENANT_ID)).isTrue();
		assertThat(businessDayService.isHoliday(LocalDate.of(2092, 3, 21), FOUNDATION_TENANT_ID)).isTrue();
		assertThat(businessDayService.isHoliday(LocalDate.of(2092, 3, 22), FOUNDATION_TENANT_ID)).isTrue();
		assertThat(businessDayService.isWorkingDay(LocalDate.of(2092, 3, 21), FOUNDATION_TENANT_ID)).isFalse();
	}

	@Test
	void businessDayServiceFindsNextWorkingDayAfterWeekendAndHoliday() {
		HolidayCalendar calendar = saveGlobalCalendar(2093);
		saveHoliday(calendar, "Monday Holiday", LocalDate.of(2093, 1, 5), LocalDate.of(2093, 1, 5));

		assertThat(businessDayService.nextWorkingDay(LocalDate.of(2093, 1, 2), FOUNDATION_TENANT_ID))
				.isEqualTo(LocalDate.of(2093, 1, 6));
	}

	@Test
	void businessDayServiceAddsPositiveWorkingDaysAfterTheStartDate() {
		HolidayCalendar calendar = saveGlobalCalendar(2094);
		saveHoliday(calendar, "Midweek Holiday", LocalDate.of(2094, 1, 4), LocalDate.of(2094, 1, 4));

		assertThat(businessDayService.addWorkingDays(LocalDate.of(2094, 1, 2), 3, FOUNDATION_TENANT_ID))
				.isEqualTo(LocalDate.of(2094, 1, 7));
		assertThat(businessDayService.addWorkingDays(LocalDate.of(2094, 1, 2), 0, FOUNDATION_TENANT_ID))
				.isEqualTo(LocalDate.of(2094, 1, 2));
		assertThatThrownBy(() -> businessDayService.addWorkingDays(LocalDate.of(2094, 1, 2), -1, FOUNDATION_TENANT_ID))
				.isInstanceOf(InvalidRequestException.class)
				.hasMessage("Working days must be zero or positive");
	}

	@Test
	void businessDayServiceCountsWorkingDaysInInclusiveInterval() {
		HolidayCalendar calendar = saveGlobalCalendar(2095);
		saveHoliday(calendar, "Friday Holiday", LocalDate.of(2095, 1, 6), LocalDate.of(2095, 1, 6));

		assertThat(businessDayService.countWorkingDays(LocalDate.of(2095, 1, 2), LocalDate.of(2095, 1, 8), FOUNDATION_TENANT_ID))
				.isEqualTo(4);
		assertThatThrownBy(() -> businessDayService.countWorkingDays(LocalDate.of(2095, 1, 8), LocalDate.of(2095, 1, 2), FOUNDATION_TENANT_ID))
				.isInstanceOf(InvalidRequestException.class)
				.hasMessage("End date must be on or after start date");
	}

	@Test
	void businessDayServiceFallsBackFromCompanyProfileToTenantCalendar() {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfile companyProfile = saveCompanyProfile(tenant, "TASK0673_CP_FALLBACK");
		HolidayCalendar tenantCalendar = saveTenantCalendar(tenant, 2096);
		saveHoliday(tenantCalendar, "Tenant Holiday", LocalDate.of(2096, 4, 2), LocalDate.of(2096, 4, 2));

		assertThat(businessDayService.isHoliday(LocalDate.of(2096, 4, 2), FOUNDATION_TENANT_ID, companyProfile.getId())).isTrue();
	}

	@Test
	void businessDayServiceFallsBackFromTenantToGlobalCalendar() {
		HolidayCalendar globalCalendar = saveGlobalCalendar(2097);
		saveHoliday(globalCalendar, "Global Holiday", LocalDate.of(2097, 6, 1), LocalDate.of(2097, 6, 1));

		assertThat(businessDayService.isHoliday(LocalDate.of(2097, 6, 1), FOUNDATION_TENANT_ID)).isTrue();
	}

	@Test
	void businessDayServiceUsesCompanyProfileCalendarBeforeTenantAndGlobal() {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfile companyProfile = saveCompanyProfile(tenant, "TASK0673_CP_PRIORITY");
		HolidayCalendar globalCalendar = saveGlobalCalendar(2098);
		saveHoliday(globalCalendar, "Global Holiday", LocalDate.of(2098, 7, 1), LocalDate.of(2098, 7, 1));
		HolidayCalendar tenantCalendar = saveTenantCalendar(tenant, 2098);
		saveHoliday(tenantCalendar, "Tenant Holiday", LocalDate.of(2098, 7, 2), LocalDate.of(2098, 7, 2));
		HolidayCalendar companyProfileCalendar = saveCompanyProfileCalendar(tenant, companyProfile, 2098);
		saveHoliday(companyProfileCalendar, "Company Holiday", LocalDate.of(2098, 7, 3), LocalDate.of(2098, 7, 3));

		assertThat(businessDayService.isHoliday(LocalDate.of(2098, 7, 3), FOUNDATION_TENANT_ID, companyProfile.getId())).isTrue();
		assertThat(businessDayService.isHoliday(LocalDate.of(2098, 7, 2), FOUNDATION_TENANT_ID, companyProfile.getId())).isFalse();
		assertThat(businessDayService.isHoliday(LocalDate.of(2098, 7, 1), FOUNDATION_TENANT_ID, companyProfile.getId())).isFalse();
	}

	@Test
	void businessDayServiceDoesNotApplyTenantCalendarToAnotherTenant() {
		Tenant baseTenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		HolidayCalendar tenantCalendar = saveTenantCalendar(baseTenant, 2099);
		saveHoliday(tenantCalendar, "Tenant Holiday", LocalDate.of(2099, 8, 2), LocalDate.of(2099, 8, 2));
		Tenant otherTenant = saveTenant("TASK0673_OTHER_TENANT", countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow());

		assertThat(businessDayService.isHoliday(LocalDate.of(2099, 8, 2), FOUNDATION_TENANT_ID)).isTrue();
		assertThat(businessDayService.isHoliday(LocalDate.of(2099, 8, 2), otherTenant.getId())).isFalse();
	}

	@Test
	void businessDayServiceDoesNotApplyCompanyProfileCalendarToAnotherCompanyProfile() {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfile companyProfileOne = saveCompanyProfile(tenant, "TASK0673_CP_ONE");
		CompanyProfile companyProfileTwo = saveCompanyProfile(tenant, "TASK0673_CP_TWO");
		HolidayCalendar companyProfileCalendar = saveCompanyProfileCalendar(tenant, companyProfileOne, 2100);
		saveHoliday(companyProfileCalendar, "Company Holiday", LocalDate.of(2100, 9, 1), LocalDate.of(2100, 9, 1));

		assertThat(businessDayService.isHoliday(LocalDate.of(2100, 9, 1), FOUNDATION_TENANT_ID, companyProfileOne.getId())).isTrue();
		assertThat(businessDayService.isHoliday(LocalDate.of(2100, 9, 1), FOUNDATION_TENANT_ID, companyProfileTwo.getId())).isFalse();
	}

	@Test
	void businessDayServiceRejectsCompanyProfileFromDifferentTenant() {
		Tenant otherTenant = saveTenant("TASK0673_FOREIGN_TENANT", countryRepository.findByIsoCode("FR").orElseThrow());
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0673_FOREIGN_CP");

		assertThatThrownBy(() -> businessDayService.isWorkingDay(
						LocalDate.of(2101, 1, 2),
						FOUNDATION_TENANT_ID,
						otherCompanyProfile.getId()))
				.isInstanceOf(InvalidRequestException.class)
				.hasMessage("Company profile does not belong to tenant: " + otherCompanyProfile.getId());
	}

	@Test
	void businessDayServiceFallsBackToWeekendOnlyWhenNoCalendarExists() {
		assertThat(businessDayService.isHoliday(LocalDate.of(2102, 2, 3), FOUNDATION_TENANT_ID)).isFalse();
		assertThat(businessDayService.isWorkingDay(LocalDate.of(2102, 2, 3), FOUNDATION_TENANT_ID)).isTrue();
		assertThat(businessDayService.isWorkingDay(LocalDate.of(2102, 2, 5), FOUNDATION_TENANT_ID)).isFalse();
	}

	@Test
	void businessDayServiceFallsBackToWeekendOnlyWhenResolvedCalendarIsInactive() {
		HolidayCalendar inactiveCalendar = saveTenantCalendar(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(), 2103);
		inactiveCalendar.setActive(false);
		holidayCalendarRepository.saveAndFlush(inactiveCalendar);
		saveHoliday(inactiveCalendar, "Inactive Calendar Holiday", LocalDate.of(2103, 2, 5), LocalDate.of(2103, 2, 5));

		assertThat(businessDayService.isHoliday(LocalDate.of(2103, 2, 5), FOUNDATION_TENANT_ID)).isFalse();
		assertThat(businessDayService.isWorkingDay(LocalDate.of(2103, 2, 5), FOUNDATION_TENANT_ID)).isTrue();
	}

	private HolidayCalendar saveGlobalCalendar(Integer year) {
		return saveCalendar(
				countryRepository.findById(ITALY_COUNTRY_ID).orElseThrow(),
				year,
				HolidayCalendarScope.GLOBAL,
				null,
				null);
	}

	private HolidayCalendar saveTenantCalendar(Tenant tenant, Integer year) {
		return saveCalendar(tenant.getDefaultCountry(), year, HolidayCalendarScope.TENANT, tenant, null);
	}

	private HolidayCalendar saveCompanyProfileCalendar(Tenant tenant, CompanyProfile companyProfile, Integer year) {
		return saveCalendar(companyProfile.getCountry(), year, HolidayCalendarScope.COMPANY_PROFILE, tenant, companyProfile);
	}

	private HolidayCalendar saveCalendar(
			Country country,
			Integer year,
			HolidayCalendarScope scope,
			Tenant tenant,
			CompanyProfile companyProfile) {
		HolidayCalendar holidayCalendar = new HolidayCalendar();
		holidayCalendar.setCountry(country);
		holidayCalendar.setYear(year);
		holidayCalendar.setName(scope + " " + country.getIsoCode() + " " + year);
		holidayCalendar.setScope(scope);
		holidayCalendar.setTenant(tenant);
		holidayCalendar.setCompanyProfile(companyProfile);
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
		holiday.setDescription("Task 067.3 test holiday");
		return holidayRepository.saveAndFlush(holiday);
	}

	private Tenant saveTenant(String code, Country country) {
		Tenant baseTenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		Tenant tenant = new Tenant();
		tenant.setCode(code);
		tenant.setName(code);
		tenant.setLegalName(code + " Legal Entity");
		tenant.setDefaultCountry(country);
		tenant.setDefaultCurrency(baseTenant.getDefaultCurrency());
		tenant.setActive(true);
		return tenantRepository.saveAndFlush(tenant);
	}

	private CompanyProfile saveCompanyProfile(Tenant tenant, String code) {
		return saveCompanyProfile(tenant, code, tenant.getDefaultCountry());
	}

	private CompanyProfile saveCompanyProfile(Tenant tenant, String code, Country country) {
		CompanyProfileType companyProfileType = companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID)
				.map(CompanyProfile::getCompanyProfileType)
				.orElseGet(() -> companyProfileTypeRepository.findAll().stream().findFirst().orElseThrow());
		CompanyProfile companyProfile = new CompanyProfile();
		companyProfile.setTenant(tenant);
		companyProfile.setCompanyProfileType(companyProfileType);
		companyProfile.setCode(code);
		companyProfile.setLegalName(code + " Legal Entity");
		companyProfile.setTradeName(code);
		companyProfile.setCountry(country);
		companyProfile.setStreet("Task 067.3 Street");
		companyProfile.setStreetNumber("1");
		companyProfile.setActive(true);
		return companyProfileRepository.saveAndFlush(companyProfile);
	}
}
