package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationAssignmentRequest;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationAssignmentResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceCreateRequest;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceDetailResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceListItemResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationDeviceUpdateRequest;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationEmployeeOptionResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationReferenceResponse;
import com.odsoftware.hrm.dto.deviceadministration.DeviceAdministrationReturnRequest;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.device.Device;
import com.odsoftware.hrm.entity.device.DeviceAssignment;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.DeviceBrand;
import com.odsoftware.hrm.entity.master.DeviceStatus;
import com.odsoftware.hrm.entity.master.DeviceType;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.device.DeviceAssignmentRepository;
import com.odsoftware.hrm.repository.device.DeviceRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.DeviceBrandRepository;
import com.odsoftware.hrm.repository.master.DeviceStatusRepository;
import com.odsoftware.hrm.repository.master.DeviceTypeRepository;
import com.odsoftware.hrm.security.CurrentCaller;
import com.odsoftware.hrm.security.CurrentCallerService;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DeviceAdministrationService {

	private static final String DEVICE_ASSET_CODE_PREFIX = "DEV";
	private static final int DEVICE_ASSET_CODE_DIGITS = 6;

	private final DeviceRepository deviceRepository;
	private final DeviceAssignmentRepository deviceAssignmentRepository;
	private final TenantRepository tenantRepository;
	private final CompanyProfileRepository companyProfileRepository;
	private final DeviceTypeRepository deviceTypeRepository;
	private final DeviceBrandRepository deviceBrandRepository;
	private final DeviceStatusRepository deviceStatusRepository;
	private final EmployeeRepository employeeRepository;
	private final UserAccountRepository userAccountRepository;
	private final CurrentCallerService currentCallerService;

	public DeviceAdministrationService(
			DeviceRepository deviceRepository,
			DeviceAssignmentRepository deviceAssignmentRepository,
			TenantRepository tenantRepository,
			CompanyProfileRepository companyProfileRepository,
			DeviceTypeRepository deviceTypeRepository,
			DeviceBrandRepository deviceBrandRepository,
			DeviceStatusRepository deviceStatusRepository,
			EmployeeRepository employeeRepository,
			UserAccountRepository userAccountRepository,
			CurrentCallerService currentCallerService) {
		this.deviceRepository = deviceRepository;
		this.deviceAssignmentRepository = deviceAssignmentRepository;
		this.tenantRepository = tenantRepository;
		this.companyProfileRepository = companyProfileRepository;
		this.deviceTypeRepository = deviceTypeRepository;
		this.deviceBrandRepository = deviceBrandRepository;
		this.deviceStatusRepository = deviceStatusRepository;
		this.employeeRepository = employeeRepository;
		this.userAccountRepository = userAccountRepository;
		this.currentCallerService = currentCallerService;
	}

	public MasterDataPageResponse<DeviceAdministrationDeviceListItemResponse> findDevices(
			UUID tenantId,
			UUID companyProfileId,
			UUID deviceTypeId,
			UUID deviceBrandId,
			UUID deviceStatusId,
			UUID assignedToEmployeeId,
			Boolean active,
			Integer page,
			Integer size,
			String search) {
		UUID authorizedTenantId = resolveAuthorizedTenantFilter(tenantId);
		Page<Device> devicePage = deviceRepository.findAll(
				deviceSpecification(
						authorizedTenantId,
						companyProfileId,
						deviceTypeId,
						deviceBrandId,
						deviceStatusId,
						assignedToEmployeeId,
						active,
						search),
				MasterDataQuerySupport.buildPageable(
						page,
						size,
						MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("name", "serialNumber"))));
		return MasterDataQuerySupport.toPageResponse(devicePage, this::toListItemResponse);
	}

	public DeviceAdministrationFormOptionsResponse findFormOptions() {
		CurrentCaller caller = currentCaller();
		List<DeviceAdministrationReferenceResponse> tenants = tenantRepository.findAll().stream()
				.filter(tenant -> Boolean.TRUE.equals(tenant.getActive()))
				.filter(tenant -> caller.isPlatformUser() || tenant.getId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(Tenant::getCode))
				.map(this::toTenantReference)
				.toList();
		List<DeviceAdministrationReferenceResponse> companyProfiles = companyProfileRepository.findAll().stream()
				.filter(companyProfile -> Boolean.TRUE.equals(companyProfile.getActive()))
				.filter(companyProfile -> caller.isPlatformUser() || companyProfile.getTenant().getId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(CompanyProfile::getCode))
				.map(this::toCompanyProfileReference)
				.toList();
		List<DeviceAdministrationReferenceResponse> deviceTypes = deviceTypeRepository.findAll().stream()
				.filter(deviceType -> Boolean.TRUE.equals(deviceType.getActive()))
				.filter(deviceType -> caller.isPlatformUser() || caller.tenantId().equals(deviceType.getTenantId()))
				.sorted(Comparator.comparing(DeviceType::getCode))
				.map(this::toDeviceTypeReference)
				.toList();
		List<DeviceAdministrationReferenceResponse> deviceBrands = deviceBrandRepository.findAll().stream()
				.filter(deviceBrand -> Boolean.TRUE.equals(deviceBrand.getActive()))
				.filter(deviceBrand -> caller.isPlatformUser() || caller.tenantId().equals(deviceBrand.getTenantId()))
				.sorted(Comparator.comparing(DeviceBrand::getCode))
				.map(this::toDeviceBrandReference)
				.toList();
		List<DeviceAdministrationReferenceResponse> deviceStatuses = deviceStatusRepository.findAll().stream()
				.filter(deviceStatus -> Boolean.TRUE.equals(deviceStatus.getActive()))
				.filter(deviceStatus -> caller.isPlatformUser() || caller.tenantId().equals(deviceStatus.getTenantId()))
				.sorted(Comparator.comparing(DeviceStatus::getCode))
				.map(this::toDeviceStatusReference)
				.toList();
		List<DeviceAdministrationEmployeeOptionResponse> employees = employeeRepository.findAll().stream()
				.filter(employee -> Boolean.TRUE.equals(employee.getActive()))
				.filter(employee -> caller.isPlatformUser() || caller.tenantId().equals(employee.getTenant().getId()))
				.sorted(Comparator.comparing(Employee::getEmployeeCode))
				.map(this::toEmployeeOption)
				.toList();
		return new DeviceAdministrationFormOptionsResponse(
				tenants,
				companyProfiles,
				deviceTypes,
				deviceBrands,
				deviceStatuses,
				employees);
	}

	public DeviceAdministrationDeviceDetailResponse findDeviceById(UUID deviceId) {
		return toDetailResponse(findDeviceForAdministration(deviceId));
	}

	public List<DeviceAdministrationAssignmentResponse> findDeviceAssignments(UUID deviceId) {
		Device device = findDeviceForAdministration(deviceId);
		return deviceAssignmentRepository.findByTenant_IdAndDevice_IdOrderByAssignedFromDescCreatedAtDesc(
						device.getTenant().getId(),
						device.getId())
				.stream()
				.map(this::toAssignmentResponse)
				.toList();
	}

	@Transactional
	public DeviceAdministrationDeviceDetailResponse createDevice(DeviceAdministrationDeviceCreateRequest request) {
		assertCallerCanManageTenant(request.tenantId());
		Tenant tenant = lockAndFindTenant(request.tenantId());
		CompanyProfile companyProfile = findCompanyProfileForTenant(request.companyProfileId(), tenant.getId());
		DeviceType deviceType = findDeviceTypeForTenant(request.deviceTypeId(), tenant.getId());
		DeviceBrand deviceBrand = findDeviceBrandForTenant(request.deviceBrandId(), tenant.getId());
		DeviceStatus deviceStatus = findDeviceStatusForTenant(request.deviceStatusId(), tenant.getId());
		Employee assignedEmployee = findAssignedEmployee(request.assignedToEmployeeId(), tenant.getId(), companyProfile.getId());
		validateAssignment(request.assignedAt(), assignedEmployee);
		validateWarrantyDates(request.purchaseDate(), request.warrantyEndDate());
		String assetCode = generateNextAssetCode(tenant.getId());
		OffsetDateTime effectiveAssignedFrom = resolveCreateAssignedFrom(request.assignedAt(), assignedEmployee);

		Device device = new Device();
		device.setTenant(tenant);
		device.setCompanyProfile(companyProfile);
		device.setName(cleanRequired(request.name(), "Device name is required"));
		device.setAssetCode(assetCode);
		device.setBarcodeValue(assetCode);
		device.setType(deviceType);
		device.setBrand(deviceBrand);
		device.setModel(clean(request.model()));
		device.setSerialNumber(cleanRequired(request.serialNumber(), "Serial number is required"));
		device.setPurchaseDate(request.purchaseDate());
		device.setWarrantyEndDate(request.warrantyEndDate());
		device.setDeviceStatus(deviceStatus);
		device.setAssignedTo(assignedEmployee);
		device.setAssignedAt(effectiveAssignedFrom);
		device.setActive(true);
		Device savedDevice = deviceRepository.saveAndFlush(device);
		if (assignedEmployee != null) {
			createOpenAssignment(savedDevice, assignedEmployee, effectiveAssignedFrom, resolveAssignedByUserOrNull(), null, null);
		}
		return toDetailResponse(savedDevice);
	}

	@Transactional
	public DeviceAdministrationDeviceDetailResponse updateDevice(
			UUID deviceId,
			DeviceAdministrationDeviceUpdateRequest request) {
		Device device = lockDeviceForAdministration(deviceId);
		UUID tenantId = device.getTenant().getId();
		CompanyProfile companyProfile = findCompanyProfileForTenant(request.companyProfileId(), tenantId);
		DeviceType deviceType = findDeviceTypeForTenant(request.deviceTypeId(), tenantId);
		DeviceBrand deviceBrand = findDeviceBrandForTenant(request.deviceBrandId(), tenantId);
		DeviceStatus deviceStatus = findDeviceStatusForTenant(request.deviceStatusId(), tenantId);
		Employee assignedEmployee = findAssignedEmployee(request.assignedToEmployeeId(), tenantId, companyProfile.getId());
		validateAssignment(request.assignedAt(), assignedEmployee);
		validateWarrantyDates(request.purchaseDate(), request.warrantyEndDate());

		device.setCompanyProfile(companyProfile);
		device.setName(cleanRequired(request.name(), "Device name is required"));
		device.setType(deviceType);
		device.setBrand(deviceBrand);
		device.setModel(clean(request.model()));
		device.setSerialNumber(cleanRequired(request.serialNumber(), "Serial number is required"));
		device.setPurchaseDate(request.purchaseDate());
		device.setWarrantyEndDate(request.warrantyEndDate());
		device.setDeviceStatus(deviceStatus);
		if (assignedEmployee == null) {
			clearCurrentAssignment(device);
		} else {
			assignOrReassignDevice(device, assignedEmployee, request.assignedAt(), null, null);
		}
		return toDetailResponse(deviceRepository.saveAndFlush(device));
	}

	@Transactional
	public DeviceAdministrationAssignmentResponse assignDevice(
			UUID deviceId,
			DeviceAdministrationAssignmentRequest request) {
		Device device = lockDeviceForAdministration(deviceId);
		Employee employee = findAssignedEmployee(
				request.employeeId(),
				device.getTenant().getId(),
				device.getCompanyProfile().getId());
		DeviceAssignment assignment = assignOrReassignDevice(
				device,
				employee,
				request.assignedFrom(),
				request.conditionOnAssign(),
				request.notes());
		deviceRepository.saveAndFlush(device);
		return toAssignmentResponse(assignment);
	}

	@Transactional
	public DeviceAdministrationAssignmentResponse returnDevice(
			UUID deviceId,
			DeviceAdministrationReturnRequest request) {
		Device device = lockDeviceForAdministration(deviceId);
		DeviceAssignment assignment = returnAssignedDevice(device, request);
		deviceRepository.saveAndFlush(device);
		return toAssignmentResponse(assignment);
	}

	@Transactional
	public DeviceAdministrationDeviceDetailResponse activateDevice(UUID deviceId) {
		Device device = findDeviceForAdministration(deviceId);
		device.setActive(true);
		return toDetailResponse(deviceRepository.saveAndFlush(device));
	}

	@Transactional
	public DeviceAdministrationDeviceDetailResponse deactivateDevice(UUID deviceId) {
		Device device = findDeviceForAdministration(deviceId);
		device.setActive(false);
		return toDetailResponse(deviceRepository.saveAndFlush(device));
	}

	@Transactional
	public void deleteDevice(UUID deviceId) {
		Device device = findDeviceForAdministration(deviceId);
		try {
			deviceRepository.delete(device);
			deviceRepository.flush();
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException("Device cannot be deleted because it is referenced by one or more records");
		}
	}

	private Specification<Device> deviceSpecification(
			UUID tenantId,
			UUID companyProfileId,
			UUID deviceTypeId,
			UUID deviceBrandId,
			UUID deviceStatusId,
			UUID assignedToEmployeeId,
			Boolean active,
			String search) {
		Specification<Device> searchSpecification = MasterDataQuerySupport.searchSpecification(
				search,
				"name",
				"assetCode",
				"barcodeValue",
				"model",
				"serialNumber",
				"tenant.code",
				"tenant.name",
				"companyProfile.code",
				"companyProfile.legalName",
				"companyProfile.tradeName",
				"type.code",
				"type.name",
				"brand.code",
				"brand.name",
				"deviceStatus.code",
				"deviceStatus.name",
				"assignedTo.employeeCode",
				"assignedTo.firstName",
				"assignedTo.lastName");
		return (root, query, criteriaBuilder) -> {
			query.distinct(true);
			Predicate predicate = criteriaBuilder.conjunction();
			if (tenantId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("tenant").get("id"), tenantId));
			}
			if (companyProfileId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("companyProfile").get("id"), companyProfileId));
			}
			if (deviceTypeId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("type").get("id"), deviceTypeId));
			}
			if (deviceBrandId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("brand").get("id"), deviceBrandId));
			}
			if (deviceStatusId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("deviceStatus").get("id"), deviceStatusId));
			}
			if (assignedToEmployeeId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("assignedTo").get("id"), assignedToEmployeeId));
			}
			if (active != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("active"), active));
			}
			if (searchSpecification == null) {
				return predicate;
			}
			Predicate searchPredicate = searchSpecification.toPredicate(root, query, criteriaBuilder);
			return searchPredicate == null ? predicate : criteriaBuilder.and(predicate, searchPredicate);
		};
	}

	private Device findDeviceForAdministration(UUID deviceId) {
		Device device = deviceRepository.findWithAdministrationGraphById(deviceId)
				.orElseThrow(() -> new ResourceNotFoundException("Device not found: " + deviceId));
		assertCallerCanManageTenant(device.getTenant().getId());
		return device;
	}

	private Device lockDeviceForAdministration(UUID deviceId) {
		Device device = deviceRepository.findWithAdministrationGraphByIdForUpdate(deviceId)
				.orElseThrow(() -> new ResourceNotFoundException("Device not found: " + deviceId));
		assertCallerCanManageTenant(device.getTenant().getId());
		return device;
	}

	private Tenant lockAndFindTenant(UUID tenantId) {
		return tenantRepository.findByIdForUpdate(tenantId)
				.orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + tenantId));
	}

	private CompanyProfile findCompanyProfileForTenant(UUID companyProfileId, UUID tenantId) {
		CompanyProfile companyProfile = companyProfileRepository.findById(companyProfileId)
				.orElseThrow(() -> new ResourceNotFoundException("Company profile not found: " + companyProfileId));
		if (!tenantId.equals(companyProfile.getTenant().getId())) {
			throw new InvalidRequestException("Company profile does not belong to tenant: " + companyProfileId);
		}
		return companyProfile;
	}

	private DeviceType findDeviceTypeForTenant(UUID deviceTypeId, UUID tenantId) {
		DeviceType deviceType = deviceTypeRepository.findById(deviceTypeId)
				.orElseThrow(() -> new ResourceNotFoundException("Device type not found: " + deviceTypeId));
		if (!tenantId.equals(deviceType.getTenantId())) {
			throw new InvalidRequestException("Device type does not belong to tenant: " + deviceTypeId);
		}
		return deviceType;
	}

	private DeviceBrand findDeviceBrandForTenant(UUID deviceBrandId, UUID tenantId) {
		DeviceBrand deviceBrand = deviceBrandRepository.findById(deviceBrandId)
				.orElseThrow(() -> new ResourceNotFoundException("Device brand not found: " + deviceBrandId));
		if (!tenantId.equals(deviceBrand.getTenantId())) {
			throw new InvalidRequestException("Device brand does not belong to tenant: " + deviceBrandId);
		}
		return deviceBrand;
	}

	private DeviceStatus findDeviceStatusForTenant(UUID deviceStatusId, UUID tenantId) {
		DeviceStatus deviceStatus = deviceStatusRepository.findById(deviceStatusId)
				.orElseThrow(() -> new ResourceNotFoundException("Device status not found: " + deviceStatusId));
		if (!tenantId.equals(deviceStatus.getTenantId())) {
			throw new InvalidRequestException("Device status does not belong to tenant: " + deviceStatusId);
		}
		return deviceStatus;
	}

	private Employee findAssignedEmployee(UUID employeeId, UUID tenantId, UUID companyProfileId) {
		if (employeeId == null) {
			return null;
		}
		Employee employee = employeeRepository.findById(employeeId)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));
		if (!tenantId.equals(employee.getTenant().getId())) {
			throw new InvalidRequestException("Employee does not belong to tenant: " + employeeId);
		}
		if (!companyProfileId.equals(employee.getCompany().getId())) {
			throw new InvalidRequestException("Employee does not belong to company profile: " + employeeId);
		}
		if (!Boolean.TRUE.equals(employee.getActive())) {
			throw new InvalidRequestException("Employee is inactive and cannot receive device assignments: " + employeeId);
		}
		return employee;
	}

	private DeviceAssignment assignOrReassignDevice(
			Device device,
			Employee employee,
			OffsetDateTime requestedAssignedFrom,
			String conditionOnAssign,
			String notes) {
		DeviceAssignment openAssignment = ensureCurrentOpenAssignment(device);
		OffsetDateTime effectiveAssignedFrom = resolveAssignedFrom(device, openAssignment, employee, requestedAssignedFrom);
		String cleanedConditionOnAssign = clean(conditionOnAssign);
		String cleanedNotes = clean(notes);
		UserAccount assignedByUser = resolveAssignedByUserOrNull();

		if (openAssignment != null && openAssignment.getEmployee().getId().equals(employee.getId())) {
			if (!Objects.equals(openAssignment.getAssignedFrom(), effectiveAssignedFrom)) {
				openAssignment.setAssignedFrom(effectiveAssignedFrom);
			}
			if (cleanedConditionOnAssign != null
					&& !Objects.equals(openAssignment.getConditionOnAssign(), cleanedConditionOnAssign)) {
				openAssignment.setConditionOnAssign(cleanedConditionOnAssign);
			}
			if (cleanedNotes != null && !Objects.equals(openAssignment.getNotes(), cleanedNotes)) {
				openAssignment.setNotes(cleanedNotes);
			}
			if (assignedByUser != null) {
				openAssignment.setAssignedByUser(assignedByUser);
			}
			device.setAssignedTo(employee);
			device.setAssignedAt(effectiveAssignedFrom);
			return openAssignment;
		}

		if (openAssignment != null) {
			validateClosedAt(openAssignment.getAssignedFrom(), effectiveAssignedFrom, "Assignment transition timestamp must be greater than or equal to assignment start");
			openAssignment.setAssignedTo(effectiveAssignedFrom);
			openAssignment.setReturnedAt(null);
			openAssignment.setReturnNote(null);
			openAssignment.setConditionOnReturn(null);
		}

		device.setAssignedTo(employee);
		device.setAssignedAt(effectiveAssignedFrom);
		return createOpenAssignment(
				device,
				employee,
				effectiveAssignedFrom,
				assignedByUser,
				cleanedConditionOnAssign,
				cleanedNotes);
	}

	private void clearCurrentAssignment(Device device) {
		DeviceAssignment openAssignment = ensureCurrentOpenAssignment(device);
		if (openAssignment != null) {
			OffsetDateTime returnedAt = OffsetDateTime.now();
			validateClosedAt(openAssignment.getAssignedFrom(), returnedAt, "Return timestamp must be greater than or equal to assignment start");
			openAssignment.setAssignedTo(returnedAt);
			openAssignment.setReturnedAt(returnedAt);
		}
		device.setAssignedTo(null);
		device.setAssignedAt(null);
	}

	private DeviceAssignment returnAssignedDevice(Device device, DeviceAdministrationReturnRequest request) {
		DeviceAssignment openAssignment = ensureCurrentOpenAssignment(device);
		if (openAssignment == null) {
			throw new InvalidRequestException("Device is not currently assigned");
		}
		OffsetDateTime returnedAt = request.returnedAt() != null ? request.returnedAt() : OffsetDateTime.now();
		validateClosedAt(openAssignment.getAssignedFrom(), returnedAt, "Return timestamp must be greater than or equal to assignment start");
		openAssignment.setAssignedTo(returnedAt);
		openAssignment.setReturnedAt(returnedAt);
		openAssignment.setReturnNote(clean(request.returnNote()));
		openAssignment.setConditionOnReturn(clean(request.conditionOnReturn()));
		String cleanedNotes = clean(request.notes());
		if (cleanedNotes != null) {
			openAssignment.setNotes(cleanedNotes);
		}
		device.setAssignedTo(null);
		device.setAssignedAt(null);
		return openAssignment;
	}

	private DeviceAssignment ensureCurrentOpenAssignment(Device device) {
		List<DeviceAssignment> openAssignments = findOpenAssignments(device);
		if (!openAssignments.isEmpty()) {
			return openAssignments.getFirst();
		}
		if (device.getAssignedTo() == null) {
			return null;
		}
		OffsetDateTime assignedFrom = firstNonNull(device.getAssignedAt(), device.getCreatedAt(), OffsetDateTime.now());
		return createOpenAssignment(
				device,
				device.getAssignedTo(),
				assignedFrom,
				resolveAssignedByUserOrNull(),
				null,
				null);
	}

	private List<DeviceAssignment> findOpenAssignments(Device device) {
		List<DeviceAssignment> openAssignments = deviceAssignmentRepository.findByTenant_IdAndDevice_IdAndAssignedToIsNullOrderByAssignedFromAsc(
				device.getTenant().getId(),
				device.getId());
		if (openAssignments.size() > 1) {
			throw new ResourceConflictException("Device has multiple open assignment history rows: " + device.getId());
		}
		return openAssignments;
	}

	private DeviceAssignment createOpenAssignment(
			Device device,
			Employee employee,
			OffsetDateTime assignedFrom,
			UserAccount assignedByUser,
			String conditionOnAssign,
			String notes) {
		DeviceAssignment assignment = new DeviceAssignment();
		assignment.setTenant(device.getTenant());
		assignment.setDevice(device);
		assignment.setEmployee(employee);
		assignment.setAssignedFrom(assignedFrom);
		assignment.setAssignedByUser(assignedByUser);
		assignment.setConditionOnAssign(conditionOnAssign);
		assignment.setNotes(notes);
		return deviceAssignmentRepository.saveAndFlush(assignment);
	}

	private OffsetDateTime resolveCreateAssignedFrom(OffsetDateTime requestedAssignedFrom, Employee assignedEmployee) {
		if (assignedEmployee == null) {
			return null;
		}
		return requestedAssignedFrom != null ? requestedAssignedFrom : OffsetDateTime.now();
	}

	private OffsetDateTime resolveAssignedFrom(
			Device device,
			DeviceAssignment openAssignment,
			Employee employee,
			OffsetDateTime requestedAssignedFrom) {
		if (requestedAssignedFrom != null) {
			return requestedAssignedFrom;
		}
		if (openAssignment != null && openAssignment.getEmployee().getId().equals(employee.getId())) {
			return openAssignment.getAssignedFrom();
		}
		if (device.getAssignedTo() != null
				&& device.getAssignedTo().getId().equals(employee.getId())
				&& device.getAssignedAt() != null) {
			return device.getAssignedAt();
		}
		return OffsetDateTime.now();
	}

	private void validateClosedAt(OffsetDateTime assignedFrom, OffsetDateTime closedAt, String message) {
		if (assignedFrom != null && closedAt != null && closedAt.isBefore(assignedFrom)) {
			throw new InvalidRequestException(message);
		}
	}

	private UserAccount resolveAssignedByUserOrNull() {
		return userAccountRepository.findById(currentCaller().userId()).orElse(null);
	}

	private DeviceAdministrationDeviceListItemResponse toListItemResponse(Device device) {
		return new DeviceAdministrationDeviceListItemResponse(
				device.getId(),
				toTenantReference(device.getTenant()),
				toCompanyProfileReference(device.getCompanyProfile()),
				device.getName(),
				device.getAssetCode(),
				device.getBarcodeValue(),
				toDeviceTypeReference(device.getType()),
				toDeviceBrandReference(device.getBrand()),
				device.getModel(),
				device.getSerialNumber(),
				device.getPurchaseDate(),
				device.getWarrantyEndDate(),
				toDeviceStatusReference(device.getDeviceStatus()),
				toEmployeeReference(device.getAssignedTo()),
				device.getAssignedAt(),
				device.getActive(),
				device.getUpdatedAt());
	}

	private DeviceAdministrationDeviceDetailResponse toDetailResponse(Device device) {
		return new DeviceAdministrationDeviceDetailResponse(
				device.getId(),
				toTenantReference(device.getTenant()),
				toCompanyProfileReference(device.getCompanyProfile()),
				device.getName(),
				device.getAssetCode(),
				device.getBarcodeValue(),
				toDeviceTypeReference(device.getType()),
				toDeviceBrandReference(device.getBrand()),
				device.getModel(),
				device.getSerialNumber(),
				device.getPurchaseDate(),
				device.getWarrantyEndDate(),
				toDeviceStatusReference(device.getDeviceStatus()),
				toEmployeeReference(device.getAssignedTo()),
				device.getAssignedAt(),
				device.getActive(),
				device.getCreatedAt(),
				device.getUpdatedAt());
	}

	private DeviceAdministrationAssignmentResponse toAssignmentResponse(DeviceAssignment assignment) {
		UserAccount assignedByUser = assignment.getAssignedByUser();
		return new DeviceAdministrationAssignmentResponse(
				assignment.getId(),
				assignment.getDevice().getId(),
				assignment.getEmployee().getId(),
				toEmployeeReference(assignment.getEmployee()),
				assignedByUser == null ? null : assignedByUser.getId(),
				assignedByUser == null ? null : assignedByUser.getEmail(),
				assignment.getAssignedFrom(),
				assignment.getAssignedTo(),
				assignment.getReturnedAt(),
				assignment.getReturnNote(),
				assignment.getConditionOnAssign(),
				assignment.getConditionOnReturn(),
				assignment.getNotes(),
				assignment.getCreatedAt(),
				assignment.getUpdatedAt());
	}

	private DeviceAdministrationReferenceResponse toTenantReference(Tenant tenant) {
		return new DeviceAdministrationReferenceResponse(tenant.getId(), tenant.getCode(), tenant.getName());
	}

	private DeviceAdministrationReferenceResponse toCompanyProfileReference(CompanyProfile companyProfile) {
		return new DeviceAdministrationReferenceResponse(
				companyProfile.getId(),
				companyProfile.getCode(),
				companyProfile.getLegalName());
	}

	private DeviceAdministrationReferenceResponse toDeviceTypeReference(DeviceType deviceType) {
		return new DeviceAdministrationReferenceResponse(deviceType.getId(), deviceType.getCode(), deviceType.getName());
	}

	private DeviceAdministrationReferenceResponse toDeviceBrandReference(DeviceBrand deviceBrand) {
		return new DeviceAdministrationReferenceResponse(deviceBrand.getId(), deviceBrand.getCode(), deviceBrand.getName());
	}

	private DeviceAdministrationReferenceResponse toDeviceStatusReference(DeviceStatus deviceStatus) {
		return new DeviceAdministrationReferenceResponse(deviceStatus.getId(), deviceStatus.getCode(), deviceStatus.getName());
	}

	private DeviceAdministrationReferenceResponse toEmployeeReference(Employee employee) {
		if (employee == null) {
			return null;
		}
		return new DeviceAdministrationReferenceResponse(employee.getId(), employee.getEmployeeCode(), employeeDisplayName(employee));
	}

	private DeviceAdministrationEmployeeOptionResponse toEmployeeOption(Employee employee) {
		return new DeviceAdministrationEmployeeOptionResponse(
				employee.getId(),
				employee.getEmployeeCode(),
				employeeDisplayName(employee),
				employee.getCompany().getId());
	}

	private String employeeDisplayName(Employee employee) {
		String firstName = employee.getFirstName() == null ? "" : employee.getFirstName().trim();
		String lastName = employee.getLastName() == null ? "" : employee.getLastName().trim();
		String displayName = (firstName + " " + lastName).trim();
		return displayName.isEmpty() ? employee.getEmployeeCode() : displayName;
	}

	private void validateAssignment(OffsetDateTime assignedAt, Employee assignedEmployee) {
		if (assignedEmployee == null && assignedAt != null) {
			throw new InvalidRequestException("Assigned at requires an assigned employee");
		}
	}

	private void validateWarrantyDates(LocalDate purchaseDate, LocalDate warrantyEndDate) {
		if (purchaseDate != null && warrantyEndDate != null && warrantyEndDate.isBefore(purchaseDate)) {
			throw new InvalidRequestException("Warranty end date must be greater than or equal to purchase date");
		}
	}

	private UUID resolveAuthorizedTenantFilter(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (caller.isPlatformUser()) {
			return tenantId;
		}
		if (tenantId != null && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant device administration is not allowed for caller");
		}
		return caller.tenantId();
	}

	private void assertCallerCanManageTenant(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (!caller.isPlatformUser() && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant device administration is not allowed for caller");
		}
	}

	private CurrentCaller currentCaller() {
		return currentCallerService.requireCurrentCaller();
	}

	private String cleanRequired(String value, String message) {
		String cleaned = clean(value);
		if (cleaned == null) {
			throw new InvalidRequestException(message);
		}
		return cleaned;
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}

	private String generateNextAssetCode(UUID tenantId) {
		int maxProgressive = 0;
		for (String assetCode : deviceRepository.findAssetCodesByTenantIdOrderByAssetCodeDesc(tenantId)) {
			int parsedProgressive = parseAssetCodeProgressive(assetCode);
			if (parsedProgressive > maxProgressive) {
				maxProgressive = parsedProgressive;
			}
		}

		if (maxProgressive >= 999999) {
			throw new ResourceConflictException("Device asset code progressive exhausted for tenant: " + tenantId);
		}

		return DEVICE_ASSET_CODE_PREFIX + String.format(Locale.ROOT, "%06d", maxProgressive + 1);
	}

	private int parseAssetCodeProgressive(String assetCode) {
		String normalizedAssetCode = cleanUpper(assetCode);
		if (normalizedAssetCode == null || !normalizedAssetCode.startsWith(DEVICE_ASSET_CODE_PREFIX)) {
			return -1;
		}
		if (normalizedAssetCode.length() != DEVICE_ASSET_CODE_PREFIX.length() + DEVICE_ASSET_CODE_DIGITS) {
			return -1;
		}
		String progressive = normalizedAssetCode.substring(DEVICE_ASSET_CODE_PREFIX.length());
		for (int index = 0; index < progressive.length(); index++) {
			if (!Character.isDigit(progressive.charAt(index))) {
				return -1;
			}
		}
		return Integer.parseInt(progressive);
	}

	private String cleanUpper(String value) {
		String cleaned = clean(value);
		return cleaned == null ? null : cleaned.toUpperCase(Locale.ROOT);
	}

	@SafeVarargs
	private static <T> T firstNonNull(T... candidates) {
		for (T candidate : candidates) {
			if (candidate != null) {
				return candidate;
			}
		}
		return null;
	}
}
