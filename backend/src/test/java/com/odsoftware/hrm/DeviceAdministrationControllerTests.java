package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.device.Device;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.master.DeviceBrand;
import com.odsoftware.hrm.entity.master.DeviceStatus;
import com.odsoftware.hrm.entity.master.DeviceType;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.device.DeviceRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.DeviceBrandRepository;
import com.odsoftware.hrm.repository.master.DeviceStatusRepository;
import com.odsoftware.hrm.repository.master.DeviceTypeRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
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
class DeviceAdministrationControllerTests {

	private static final AtomicInteger TEST_DEVICE_SEQUENCE = new AtomicInteger(900000);
	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COMPANY_PROFILE_ID = UUID.fromString("80000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_COUNTRY_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_DEVICE_TYPE_ID = UUID.fromString("62000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_DEVICE_BRAND_ID = UUID.fromString("63000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_AVAILABLE_DEVICE_STATUS_ID = UUID.fromString("64000000-0000-0000-0000-000000000001");
	private static final UUID FOUNDATION_ASSIGNED_DEVICE_STATUS_ID = UUID.fromString("64000000-0000-0000-0000-000000000002");
	private static final UUID TENANT_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000031");
	private static final UUID PLATFORM_CALLER_USER_ID = UUID.fromString("90000000-0000-0000-0000-000000000032");
	private static final UUID MISSING_ID = UUID.fromString("00000000-0000-0000-0000-000000000099");

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
	private DeviceRepository deviceRepository;

	@Autowired
	private DeviceTypeRepository deviceTypeRepository;

	@Autowired
	private DeviceBrandRepository deviceBrandRepository;

	@Autowired
	private DeviceStatusRepository deviceStatusRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Test
	@WithMockUser
	void deviceAdministrationListsDevicesWithTenantScopeFiltersAndSearch() throws Exception {
		Employee foundationEmployee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0662_EMPLOYEE_1",
				"Ada",
				"Lovelace");
		Device foundationDevice = saveDevice(
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"Task 066.2 Foundation Device",
				"TASK0662-SERIAL-001",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_ASSIGNED_DEVICE_STATUS_ID).orElseThrow(),
				foundationEmployee,
				OffsetDateTime.parse("2026-05-15T09:30:00Z"));

		Tenant otherTenant = saveTenant("TASK0662_LIST_OTHER_TENANT");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0662_LIST_OTHER_COMPANY");
		DeviceType otherDeviceType = saveDeviceType(otherTenant, "TASK0662_LIST_TYPE", "Task 066.2 Other Type");
		DeviceBrand otherDeviceBrand = saveDeviceBrand(otherTenant, "TASK0662_LIST_BRAND", "Task 066.2 Other Brand");
		DeviceStatus otherDeviceStatus = saveDeviceStatus(otherTenant, "TASK0662_LIST_STATUS", "Task 066.2 Other Status");
		saveDevice(otherCompanyProfile, "Task 066.2 Other Tenant Device", "TASK0662-SERIAL-999", otherDeviceType, otherDeviceBrand, otherDeviceStatus, null, null);

		mockMvc.perform(get("/api/admin/devices")
						.with(deviceTenantCaller())
						.param("tenantId", FOUNDATION_TENANT_ID.toString())
						.param("companyProfileId", FOUNDATION_COMPANY_PROFILE_ID.toString())
						.param("assignedToEmployeeId", foundationEmployee.getId().toString())
						.param("active", "true")
						.param("search", "TASK0662-SERIAL-001"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(foundationDevice.getId().toString()))
				.andExpect(jsonPath("$.content[0].tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.content[0].companyProfile.id").value(FOUNDATION_COMPANY_PROFILE_ID.toString()))
				.andExpect(jsonPath("$.content[0].assignedTo.id").value(foundationEmployee.getId().toString()))
				.andExpect(jsonPath("$.content[0].assetCode").value(foundationDevice.getAssetCode()))
				.andExpect(jsonPath("$.content[0].barcodeValue").value(foundationDevice.getBarcodeValue()))
				.andExpect(jsonPath("$.content[0].serialNumber").value("TASK0662-SERIAL-001"))
				.andExpect(jsonPath("$.content[0].deviceStatus.code").value("DS002"));
	}

	@Test
	@WithMockUser
	void deviceAdministrationSupportsPlatformListWithoutTenantFilter() throws Exception {
		Tenant otherTenant = saveTenant("TASK0662_PLATFORM_TENANT");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0662_PLATFORM_COMPANY");
		DeviceType otherDeviceType = saveDeviceType(otherTenant, "TASK0662_PLATFORM_TYPE", "Task 066.2 Platform Type");
		DeviceBrand otherDeviceBrand = saveDeviceBrand(otherTenant, "TASK0662_PLATFORM_BRAND", "Task 066.2 Platform Brand");
		DeviceStatus otherDeviceStatus = saveDeviceStatus(otherTenant, "TASK0662_PLATFORM_STATUS", "Task 066.2 Platform Status");
		Device device = saveDevice(otherCompanyProfile, "Task 066.2 Platform Device", "TASK0662-PLATFORM-001", otherDeviceType, otherDeviceBrand, otherDeviceStatus, null, null);

		mockMvc.perform(get("/api/admin/devices")
						.with(devicePlatformCaller())
						.param("search", "TASK0662-PLATFORM-001"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content.length()").value(1))
				.andExpect(jsonPath("$.content[0].id").value(device.getId().toString()))
				.andExpect(jsonPath("$.content[0].tenant.id").value(otherTenant.getId().toString()));
	}

	@Test
	@WithMockUser
	void deviceAdministrationReturnsDetail() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0662_EMPLOYEE_2",
				"Grace",
				"Hopper");
		Device device = saveDevice(
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"Task 066.2 Detail Device",
				"TASK0662-DETAIL-001",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_ASSIGNED_DEVICE_STATUS_ID).orElseThrow(),
				employee,
				OffsetDateTime.parse("2026-05-16T10:15:00Z"));

		mockMvc.perform(get("/api/admin/devices/{deviceId}", device.getId()).with(deviceTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(device.getId().toString()))
				.andExpect(jsonPath("$.name").value("Task 066.2 Detail Device"))
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.companyProfile.id").value(FOUNDATION_COMPANY_PROFILE_ID.toString()))
				.andExpect(jsonPath("$.assetCode").value(device.getAssetCode()))
				.andExpect(jsonPath("$.barcodeValue").value(device.getBarcodeValue()))
				.andExpect(jsonPath("$.type.code").value("DV001"))
				.andExpect(jsonPath("$.brand.code").value("DB001"))
				.andExpect(jsonPath("$.deviceStatus.code").value("DS002"))
				.andExpect(jsonPath("$.assignedTo.id").value(employee.getId().toString()))
				.andExpect(jsonPath("$.assignedAt").value("2026-05-16T10:15:00Z"))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void deviceAdministrationReturnsFormOptions() throws Exception {
		mockMvc.perform(get("/api/admin/devices/form-options").with(deviceTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.tenants[?(@.id=='" + FOUNDATION_TENANT_ID + "')]").exists())
				.andExpect(jsonPath("$.companyProfiles[?(@.id=='" + FOUNDATION_COMPANY_PROFILE_ID + "')]").exists())
				.andExpect(jsonPath("$.deviceTypes[?(@.id=='" + FOUNDATION_DEVICE_TYPE_ID + "')]").exists())
				.andExpect(jsonPath("$.deviceBrands[?(@.id=='" + FOUNDATION_DEVICE_BRAND_ID + "')]").exists())
				.andExpect(jsonPath("$.deviceStatuses[?(@.id=='" + FOUNDATION_AVAILABLE_DEVICE_STATUS_ID + "')]").exists());
	}

	@Test
	@WithMockUser
	void deviceAdministrationCreatesDeviceAndIgnoresManualActivePayload() throws Exception {
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"TASK0662_EMPLOYEE_3",
				"Katherine",
				"Johnson");

		mockMvc.perform(postJson("/api/admin/devices", deviceCreateRequest(
						FOUNDATION_TENANT_ID,
						FOUNDATION_COMPANY_PROFILE_ID,
						FOUNDATION_DEVICE_TYPE_ID,
						FOUNDATION_DEVICE_BRAND_ID,
						FOUNDATION_AVAILABLE_DEVICE_STATUS_ID,
						employee.getId(),
						"TASK0662-CREATE-001"))
						.with(deviceTenantCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.tenant.id").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.companyProfile.id").value(FOUNDATION_COMPANY_PROFILE_ID.toString()))
				.andExpect(jsonPath("$.assetCode").value("DEV000001"))
				.andExpect(jsonPath("$.barcodeValue").value("DEV000001"))
				.andExpect(jsonPath("$.serialNumber").value("TASK0662-CREATE-001"))
				.andExpect(jsonPath("$.assignedTo.id").value(employee.getId().toString()))
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void deviceAdministrationCreatesDeviceUsingNextAssetCodeWithinTenant() throws Exception {
		Device existingDevice = saveDevice(
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"Task 066.3 Existing Device",
				"TASK0663-EXISTING-001",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_AVAILABLE_DEVICE_STATUS_ID).orElseThrow(),
				null,
				null,
				"DEV000123");

		mockMvc.perform(postJson("/api/admin/devices", deviceCreateRequest(
						FOUNDATION_TENANT_ID,
						FOUNDATION_COMPANY_PROFILE_ID,
						FOUNDATION_DEVICE_TYPE_ID,
						FOUNDATION_DEVICE_BRAND_ID,
						FOUNDATION_AVAILABLE_DEVICE_STATUS_ID,
						null,
						"TASK0663-CREATE-002"))
						.with(deviceTenantCaller()))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.assetCode").value("DEV000124"))
				.andExpect(jsonPath("$.barcodeValue").value("DEV000124"));

		assertThat(existingDevice.getAssetCode()).isEqualTo("DEV000123");
	}

	@Test
	@WithMockUser
	void deviceAdministrationUpdatesEditableFieldsAndPreservesActive() throws Exception {
		CompanyProfile companyProfile = companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow();
		Employee employee = saveEmployee(
				tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow(),
				companyProfile,
				"TASK0662_EMPLOYEE_4",
				"Margaret",
				"Hamilton");
		Device device = saveDevice(
				companyProfile,
				"Task 066.2 Update Device",
				"TASK0662-UPDATE-001",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_AVAILABLE_DEVICE_STATUS_ID).orElseThrow(),
				null,
				null);

		Map<String, Object> request = new LinkedHashMap<>();
		request.put("companyProfileId", FOUNDATION_COMPANY_PROFILE_ID);
		request.put("name", " Task 066.2 Updated Device ");
		request.put("deviceTypeId", FOUNDATION_DEVICE_TYPE_ID);
		request.put("deviceBrandId", FOUNDATION_DEVICE_BRAND_ID);
		request.put("model", " Updated Model ");
		request.put("serialNumber", " TASK0662-UPDATE-999 ");
		request.put("purchaseDate", "2026-05-10");
		request.put("warrantyEndDate", "2029-05-10");
		request.put("deviceStatusId", FOUNDATION_ASSIGNED_DEVICE_STATUS_ID);
		request.put("assignedToEmployeeId", employee.getId());
		request.put("assignedAt", "2026-05-18T08:45:00Z");
		request.put("active", false);
		request.put("assetCode", "DEV999999");
		request.put("barcodeValue", "DEV999999");

		mockMvc.perform(putJson("/api/admin/devices/" + device.getId(), request).with(deviceTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Task 066.2 Updated Device"))
				.andExpect(jsonPath("$.assetCode").value(device.getAssetCode()))
				.andExpect(jsonPath("$.barcodeValue").value(device.getBarcodeValue()))
				.andExpect(jsonPath("$.model").value("Updated Model"))
				.andExpect(jsonPath("$.serialNumber").value("TASK0662-UPDATE-999"))
				.andExpect(jsonPath("$.deviceStatus.code").value("DS002"))
				.andExpect(jsonPath("$.assignedTo.id").value(employee.getId().toString()))
				.andExpect(jsonPath("$.active").value(true));

		Device reloadedDevice = deviceRepository.findById(device.getId()).orElseThrow();
		assertThat(reloadedDevice.getName()).isEqualTo("Task 066.2 Updated Device");
		assertThat(reloadedDevice.getModel()).isEqualTo("Updated Model");
		assertThat(reloadedDevice.getSerialNumber()).isEqualTo("TASK0662-UPDATE-999");
		assertThat(reloadedDevice.getAssignedTo().getId()).isEqualTo(employee.getId());
		assertThat(reloadedDevice.getActive()).isTrue();
		assertThat(reloadedDevice.getAssetCode()).isEqualTo(device.getAssetCode());
		assertThat(reloadedDevice.getBarcodeValue()).isEqualTo(device.getBarcodeValue());
	}

	@Test
	@WithMockUser
	void deviceAdministrationActivatesAndDeactivatesDevice() throws Exception {
		Device device = saveDevice(
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"Task 066.2 Toggle Device",
				"TASK0662-TOGGLE-001",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_AVAILABLE_DEVICE_STATUS_ID).orElseThrow(),
				null,
				null);

		mockMvc.perform(put("/api/admin/devices/{deviceId}/deactivate", device.getId()).with(deviceTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(false));

		mockMvc.perform(put("/api/admin/devices/{deviceId}/activate", device.getId()).with(deviceTenantCaller()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.active").value(true));
	}

	@Test
	@WithMockUser
	void deviceAdministrationDeletesDevicePhysicallyWhenUnreferenced() throws Exception {
		Device device = saveDevice(
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"Task 066.2 Delete Device",
				"TASK0662-DELETE-001",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_AVAILABLE_DEVICE_STATUS_ID).orElseThrow(),
				null,
				null);

		mockMvc.perform(delete("/api/admin/devices/{deviceId}", device.getId()).with(deviceTenantCaller()))
				.andExpect(status().isNoContent());

		assertThat(deviceRepository.findById(device.getId())).isEmpty();
	}

	@Test
	@WithMockUser
	void deviceAdministrationRejectsInvalidWarrantyDates() throws Exception {
		mockMvc.perform(postJson("/api/admin/devices", invalidWarrantyCreateRequest()).with(deviceTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Warranty end date must be greater than or equal to purchase date"));
	}

	@Test
	@WithMockUser
	void deviceAdministrationRejectsAssignedAtWithoutAssignedEmployee() throws Exception {
		Map<String, Object> request = deviceCreateRequest(
				FOUNDATION_TENANT_ID,
				FOUNDATION_COMPANY_PROFILE_ID,
				FOUNDATION_DEVICE_TYPE_ID,
				FOUNDATION_DEVICE_BRAND_ID,
				FOUNDATION_AVAILABLE_DEVICE_STATUS_ID,
				null,
				"TASK0662-ASSIGNMENT-001");
		request.put("assignedAt", "2026-05-18T08:45:00Z");

		mockMvc.perform(postJson("/api/admin/devices", request).with(deviceTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Assigned at requires an assigned employee"));
	}

	@Test
	@WithMockUser
	void deviceAdministrationRejectsCreateWithCompanyProfileFromDifferentTenant() throws Exception {
		Tenant otherTenant = saveTenant("TASK0662_COMPANY_OTHER_TENANT");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0662_COMPANY_OTHER");

		mockMvc.perform(postJson("/api/admin/devices", deviceCreateRequest(
						FOUNDATION_TENANT_ID,
						otherCompanyProfile.getId(),
						FOUNDATION_DEVICE_TYPE_ID,
						FOUNDATION_DEVICE_BRAND_ID,
						FOUNDATION_AVAILABLE_DEVICE_STATUS_ID,
						null,
						"TASK0662-COMPANY-MISMATCH"))
						.with(deviceTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Company profile does not belong to tenant: " + otherCompanyProfile.getId()));
	}

	@Test
	@WithMockUser
	void deviceAdministrationRejectsCreateWithEmployeeFromDifferentCompanyProfile() throws Exception {
		Tenant tenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		CompanyProfile otherCompanyProfile = saveCompanyProfile(tenant, "TASK0662_OTHER_COMPANY_SAME_TENANT");
		Employee employee = saveEmployee(tenant, otherCompanyProfile, "TASK0662_EMPLOYEE_5", "Dorothy", "Vaughan");

		mockMvc.perform(postJson("/api/admin/devices", deviceCreateRequest(
						FOUNDATION_TENANT_ID,
						FOUNDATION_COMPANY_PROFILE_ID,
						FOUNDATION_DEVICE_TYPE_ID,
						FOUNDATION_DEVICE_BRAND_ID,
						FOUNDATION_AVAILABLE_DEVICE_STATUS_ID,
						employee.getId(),
						"TASK0662-EMPLOYEE-MISMATCH"))
						.with(deviceTenantCaller()))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Employee does not belong to company profile: " + employee.getId()));
	}

	@Test
	void deviceAdministrationRejectsCallerWithoutReadPermission() throws Exception {
		mockMvc.perform(get("/api/admin/devices/form-options")
						.with(deviceTenantCaller("TENANT.DEVICE.UPDATE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void deviceAdministrationRejectsDeleteWithoutDeletePermission() throws Exception {
		Device device = saveDevice(
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"Task 066.2 Delete Permission Device",
				"TASK0662-DELETE-PERM",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_AVAILABLE_DEVICE_STATUS_ID).orElseThrow(),
				null,
				null);

		mockMvc.perform(delete("/api/admin/devices/{deviceId}", device.getId())
						.with(deviceTenantCaller("TENANT.DEVICE.READ", "TENANT.DEVICE.UPDATE")))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Access denied"));
	}

	@Test
	void deviceAdministrationRejectsUpdateWithoutToken() throws Exception {
		Device device = saveDevice(
				companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow(),
				"Task 066.2 No Token Device",
				"TASK0662-NO-TOKEN",
				deviceTypeRepository.findById(FOUNDATION_DEVICE_TYPE_ID).orElseThrow(),
				deviceBrandRepository.findById(FOUNDATION_DEVICE_BRAND_ID).orElseThrow(),
				deviceStatusRepository.findById(FOUNDATION_AVAILABLE_DEVICE_STATUS_ID).orElseThrow(),
				null,
				null);

		mockMvc.perform(putJson("/api/admin/devices/" + device.getId(), deviceUpdateRequest(FOUNDATION_COMPANY_PROFILE_ID, "Task 066.2 No Token Updated", "TASK0662-NO-TOKEN-UPD"))
						.with(request -> request))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deviceAdministrationRejectsCrossTenantDetailForTenantCaller() throws Exception {
		Tenant otherTenant = saveTenant("TASK0662_SCOPE_OTHER_TENANT");
		CompanyProfile otherCompanyProfile = saveCompanyProfile(otherTenant, "TASK0662_SCOPE_OTHER_COMPANY");
		DeviceType otherDeviceType = saveDeviceType(otherTenant, "TASK0662_SCOPE_TYPE", "Task 066.2 Scope Type");
		DeviceBrand otherDeviceBrand = saveDeviceBrand(otherTenant, "TASK0662_SCOPE_BRAND", "Task 066.2 Scope Brand");
		DeviceStatus otherDeviceStatus = saveDeviceStatus(otherTenant, "TASK0662_SCOPE_STATUS", "Task 066.2 Scope Status");
		Device device = saveDevice(otherCompanyProfile, "Task 066.2 Scoped Device", "TASK0662-SCOPE-001", otherDeviceType, otherDeviceBrand, otherDeviceStatus, null, null);

		mockMvc.perform(get("/api/admin/devices/{deviceId}", device.getId()).with(deviceTenantCaller()))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.message").value("Cross-tenant device administration is not allowed for caller"));
	}

	@Test
	@WithMockUser
	void deviceAdministrationReturnsNotFoundForMissingDevice() throws Exception {
		mockMvc.perform(get("/api/admin/devices/{deviceId}", MISSING_ID).with(deviceTenantCaller()))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Device not found: " + MISSING_ID));
	}

	@Test
	void deviceAdministrationPublishesApiDocumentation() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/admin/devices']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices'].get").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices'].post").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices/form-options']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices/{deviceId}']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices/{deviceId}'].put").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices/{deviceId}/activate']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices/{deviceId}/deactivate']").exists())
				.andExpect(jsonPath("$.paths['/api/admin/devices/{deviceId}'].delete").exists());
	}

	private Tenant saveTenant(String code) {
		Tenant foundationTenant = tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow();
		Tenant tenant = new Tenant();
		tenant.setCode(code);
		tenant.setName(code);
		tenant.setLegalName(code + " Legal");
		tenant.setDefaultCountry(foundationTenant.getDefaultCountry());
		tenant.setDefaultCurrency(foundationTenant.getDefaultCurrency());
		tenant.setActive(true);
		return tenantRepository.saveAndFlush(tenant);
	}

	private CompanyProfile saveCompanyProfile(Tenant tenant, String code) {
		CompanyProfile baseCompanyProfile = companyProfileRepository.findById(FOUNDATION_COMPANY_PROFILE_ID).orElseThrow();
		CompanyProfile companyProfile = new CompanyProfile();
		companyProfile.setTenant(tenant);
		companyProfile.setCompanyProfileType(baseCompanyProfile.getCompanyProfileType());
		companyProfile.setCode(code);
		companyProfile.setLegalName(code + " Legal");
		companyProfile.setTradeName(code);
		companyProfile.setCountry(baseCompanyProfile.getCountry());
		companyProfile.setStreet("Task 066.2 Street");
		companyProfile.setStreetNumber("1");
		companyProfile.setActive(true);
		return companyProfileRepository.saveAndFlush(companyProfile);
	}

	private DeviceType saveDeviceType(Tenant tenant, String code, String name) {
		DeviceType deviceType = new DeviceType();
		deviceType.setTenantId(tenant.getId());
		deviceType.setCode(code);
		deviceType.setName(name);
		deviceType.setActive(true);
		return deviceTypeRepository.saveAndFlush(deviceType);
	}

	private DeviceBrand saveDeviceBrand(Tenant tenant, String code, String name) {
		DeviceBrand deviceBrand = new DeviceBrand();
		deviceBrand.setTenantId(tenant.getId());
		deviceBrand.setCode(code);
		deviceBrand.setName(name);
		deviceBrand.setActive(true);
		return deviceBrandRepository.saveAndFlush(deviceBrand);
	}

	private DeviceStatus saveDeviceStatus(Tenant tenant, String code, String name) {
		DeviceStatus deviceStatus = new DeviceStatus();
		deviceStatus.setTenantId(tenant.getId());
		deviceStatus.setCode(code);
		deviceStatus.setName(name);
		deviceStatus.setActive(true);
		return deviceStatusRepository.saveAndFlush(deviceStatus);
	}

	private Employee saveEmployee(Tenant tenant, CompanyProfile companyProfile, String employeeCode, String firstName, String lastName) {
		Employee employee = new Employee();
		employee.setTenant(tenant);
		employee.setCompany(companyProfile);
		employee.setEmployeeCode(employeeCode);
		employee.setFirstName(firstName);
		employee.setLastName(lastName);
		employee.setEmail(employeeCode.toLowerCase() + "@example.com");
		employee.setEmploymentStatus("ACTIVE");
		employee.setActive(true);
		return employeeRepository.saveAndFlush(employee);
	}

	private Device saveDevice(
			CompanyProfile companyProfile,
			String name,
			String serialNumber,
			DeviceType deviceType,
			DeviceBrand deviceBrand,
			DeviceStatus deviceStatus,
			Employee assignedEmployee,
			OffsetDateTime assignedAt) {
		return saveDevice(
				companyProfile,
				name,
				serialNumber,
				deviceType,
				deviceBrand,
				deviceStatus,
				assignedEmployee,
				assignedAt,
				nextTestAssetCode());
	}

	private Device saveDevice(
			CompanyProfile companyProfile,
			String name,
			String serialNumber,
			DeviceType deviceType,
			DeviceBrand deviceBrand,
			DeviceStatus deviceStatus,
			Employee assignedEmployee,
			OffsetDateTime assignedAt,
			String assetCode) {
		Device device = new Device();
		device.setTenant(companyProfile.getTenant());
		device.setCompanyProfile(companyProfile);
		device.setName(name);
		device.setAssetCode(assetCode);
		device.setBarcodeValue(assetCode);
		device.setType(deviceType);
		device.setBrand(deviceBrand);
		device.setModel("Task 066.2 Model");
		device.setSerialNumber(serialNumber);
		device.setPurchaseDate(LocalDate.of(2026, 5, 15));
		device.setWarrantyEndDate(LocalDate.of(2029, 5, 15));
		device.setDeviceStatus(deviceStatus);
		device.setAssignedTo(assignedEmployee);
		device.setAssignedAt(assignedAt);
		device.setActive(true);
		return deviceRepository.saveAndFlush(device);
	}

	private Map<String, Object> deviceCreateRequest(
			UUID tenantId,
			UUID companyProfileId,
			UUID deviceTypeId,
			UUID deviceBrandId,
			UUID deviceStatusId,
			UUID assignedToEmployeeId,
			String serialNumber) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("tenantId", tenantId);
		request.put("companyProfileId", companyProfileId);
		request.put("name", " Task 066.2 Created Device ");
		request.put("deviceTypeId", deviceTypeId);
		request.put("deviceBrandId", deviceBrandId);
		request.put("model", " Created Model ");
		request.put("serialNumber", " " + serialNumber + " ");
		request.put("purchaseDate", "2026-05-10");
		request.put("warrantyEndDate", "2029-05-10");
		request.put("deviceStatusId", deviceStatusId);
		request.put("assignedToEmployeeId", assignedToEmployeeId);
		request.put("assignedAt", assignedToEmployeeId == null ? null : "2026-05-17T10:00:00Z");
		request.put("active", false);
		request.put("assetCode", "DEV777777");
		request.put("barcodeValue", "DEV777777");
		return request;
	}

	private Map<String, Object> invalidWarrantyCreateRequest() {
		Map<String, Object> request = deviceCreateRequest(
				FOUNDATION_TENANT_ID,
				FOUNDATION_COMPANY_PROFILE_ID,
				FOUNDATION_DEVICE_TYPE_ID,
				FOUNDATION_DEVICE_BRAND_ID,
				FOUNDATION_AVAILABLE_DEVICE_STATUS_ID,
				null,
				"TASK0662-WARRANTY-001");
		request.put("purchaseDate", "2026-05-20");
		request.put("warrantyEndDate", "2026-05-10");
		return request;
	}

	private Map<String, Object> deviceUpdateRequest(UUID companyProfileId, String name, String serialNumber) {
		Map<String, Object> request = new LinkedHashMap<>();
		request.put("companyProfileId", companyProfileId);
		request.put("name", name);
		request.put("deviceTypeId", FOUNDATION_DEVICE_TYPE_ID);
		request.put("deviceBrandId", FOUNDATION_DEVICE_BRAND_ID);
		request.put("model", "Updated Model");
		request.put("serialNumber", serialNumber);
		request.put("purchaseDate", "2026-05-10");
		request.put("warrantyEndDate", "2029-05-10");
		request.put("deviceStatusId", FOUNDATION_AVAILABLE_DEVICE_STATUS_ID);
		return request;
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

	private RequestPostProcessor deviceTenantCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {"TENANT.DEVICE.READ", "TENANT.DEVICE.CREATE", "TENANT.DEVICE.UPDATE", "TENANT.DEVICE.DELETE"}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_TENANT_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("tenant.device.admin@example.com")
						.claim("userId", TENANT_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "TENANT_ADMIN"))
				.authorities(grantedAuthorities);
	}

	private RequestPostProcessor devicePlatformCaller(String... authorities) {
		String[] effectiveAuthorities = authorities.length == 0
				? new String[] {"PLATFORM.DEVICE.READ", "PLATFORM.DEVICE.CREATE", "PLATFORM.DEVICE.UPDATE", "PLATFORM.DEVICE.DELETE"}
				: authorities;
		var grantedAuthorities = Stream.concat(
						Stream.of("USER_TYPE_PLATFORM_SUPER_ADMIN"),
						Stream.of(effectiveAuthorities))
				.map(SimpleGrantedAuthority::new)
				.map(authority -> (GrantedAuthority) authority)
				.toList();
		return jwt().jwt(jwt -> jwt
						.subject("platform.device.admin@example.com")
						.claim("userId", PLATFORM_CALLER_USER_ID.toString())
						.claim("tenantId", FOUNDATION_TENANT_ID.toString())
						.claim("userType", "PLATFORM_SUPER_ADMIN"))
				.authorities(grantedAuthorities);
	}

	private String nextTestAssetCode() {
		return "DEV" + String.format(Locale.ROOT, "%06d", TEST_DEVICE_SEQUENCE.incrementAndGet());
	}
}
