package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.hrbusiness.TenantMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.hrbusiness.TenantMasterDataAutoCodeRequest;
import com.odsoftware.hrm.dto.masterdata.hrbusiness.TenantMasterDataResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import com.odsoftware.hrm.entity.master.ContractType;
import com.odsoftware.hrm.entity.master.Department;
import com.odsoftware.hrm.entity.master.DeviceBrand;
import com.odsoftware.hrm.entity.master.DeviceStatus;
import com.odsoftware.hrm.entity.master.DeviceType;
import com.odsoftware.hrm.entity.master.DocumentType;
import com.odsoftware.hrm.entity.master.EmploymentStatus;
import com.odsoftware.hrm.entity.master.JobTitle;
import com.odsoftware.hrm.entity.master.LeaveRequestType;
import com.odsoftware.hrm.entity.master.WorkMode;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.device.DeviceRepository;
import com.odsoftware.hrm.repository.contract.ContractRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.leave.LeaveRequestRepository;
import com.odsoftware.hrm.repository.master.ContractTypeRepository;
import com.odsoftware.hrm.repository.master.DepartmentRepository;
import com.odsoftware.hrm.repository.master.DeviceBrandRepository;
import com.odsoftware.hrm.repository.master.DeviceStatusRepository;
import com.odsoftware.hrm.repository.master.DeviceTypeRepository;
import com.odsoftware.hrm.repository.master.DocumentTypeRepository;
import com.odsoftware.hrm.repository.master.EmploymentStatusRepository;
import com.odsoftware.hrm.repository.master.JobTitleRepository;
import com.odsoftware.hrm.repository.master.LeaveRequestTypeRepository;
import com.odsoftware.hrm.repository.master.WorkModeRepository;
import com.odsoftware.hrm.repository.payroll.PayrollDocumentRepository;
import java.util.Locale;
import java.util.List;
import java.util.UUID;
import java.util.function.BiPredicate;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MasterDataHrBusinessService {

	private final TenantRepository tenantRepository;
	private final EmployeeRepository employeeRepository;
	private final ContractRepository contractRepository;
	private final LeaveRequestRepository leaveRequestRepository;
	private final PayrollDocumentRepository payrollDocumentRepository;
	private final DeviceRepository deviceRepository;
	private final DepartmentRepository departmentRepository;
	private final JobTitleRepository jobTitleRepository;
	private final ContractTypeRepository contractTypeRepository;
	private final EmploymentStatusRepository employmentStatusRepository;
	private final WorkModeRepository workModeRepository;
	private final LeaveRequestTypeRepository leaveRequestTypeRepository;
	private final DocumentTypeRepository documentTypeRepository;
	private final DeviceTypeRepository deviceTypeRepository;
	private final DeviceBrandRepository deviceBrandRepository;
	private final DeviceStatusRepository deviceStatusRepository;

	public MasterDataHrBusinessService(
			TenantRepository tenantRepository,
			EmployeeRepository employeeRepository,
			ContractRepository contractRepository,
			LeaveRequestRepository leaveRequestRepository,
			PayrollDocumentRepository payrollDocumentRepository,
			DeviceRepository deviceRepository,
			DepartmentRepository departmentRepository,
			JobTitleRepository jobTitleRepository,
			ContractTypeRepository contractTypeRepository,
			EmploymentStatusRepository employmentStatusRepository,
			WorkModeRepository workModeRepository,
			LeaveRequestTypeRepository leaveRequestTypeRepository,
			DocumentTypeRepository documentTypeRepository,
			DeviceTypeRepository deviceTypeRepository,
			DeviceBrandRepository deviceBrandRepository,
			DeviceStatusRepository deviceStatusRepository) {
		this.tenantRepository = tenantRepository;
		this.employeeRepository = employeeRepository;
		this.contractRepository = contractRepository;
		this.leaveRequestRepository = leaveRequestRepository;
		this.payrollDocumentRepository = payrollDocumentRepository;
		this.deviceRepository = deviceRepository;
		this.departmentRepository = departmentRepository;
		this.jobTitleRepository = jobTitleRepository;
		this.contractTypeRepository = contractTypeRepository;
		this.employmentStatusRepository = employmentStatusRepository;
		this.workModeRepository = workModeRepository;
		this.leaveRequestTypeRepository = leaveRequestTypeRepository;
		this.documentTypeRepository = documentTypeRepository;
		this.deviceTypeRepository = deviceTypeRepository;
		this.deviceBrandRepository = deviceBrandRepository;
		this.deviceStatusRepository = deviceStatusRepository;
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findDepartments(Integer page, Integer size, String search) {
		return findAll(departmentRepository, page, size, search);
	}

	public TenantMasterDataResponse findDepartmentById(UUID id) {
		return findById(id, departmentRepository, "Department");
	}

	@Transactional
	public TenantMasterDataResponse createDepartment(TenantMasterDataRequest request) {
		return create(request, Department::new, departmentRepository, departmentRepository::existsByTenantIdAndCode, "Department");
	}

	@Transactional
	public TenantMasterDataResponse updateDepartment(UUID id, TenantMasterDataRequest request) {
		return update(id, request, departmentRepository, departmentRepository::existsByTenantIdAndCodeAndIdNot, "Department");
	}

	@Transactional
	public void disableDepartment(UUID id) {
		disable(id, departmentRepository, "Department");
	}

	@Transactional
	public void deletePhysicalDepartment(UUID id) {
		deletePhysical(id, departmentRepository, this::isDepartmentReferenced, "Department");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findJobTitles(Integer page, Integer size, String search) {
		return findAll(jobTitleRepository, page, size, search);
	}

	public TenantMasterDataResponse findJobTitleById(UUID id) {
		return findById(id, jobTitleRepository, "Job title");
	}

	@Transactional
	public TenantMasterDataResponse createJobTitle(TenantMasterDataRequest request) {
		return create(request, JobTitle::new, jobTitleRepository, jobTitleRepository::existsByTenantIdAndCode, "Job title");
	}

	@Transactional
	public TenantMasterDataResponse updateJobTitle(UUID id, TenantMasterDataRequest request) {
		return update(id, request, jobTitleRepository, jobTitleRepository::existsByTenantIdAndCodeAndIdNot, "Job title");
	}

	@Transactional
	public void disableJobTitle(UUID id) {
		disable(id, jobTitleRepository, "Job title");
	}

	@Transactional
	public void deletePhysicalJobTitle(UUID id) {
		deletePhysical(id, jobTitleRepository, this::isJobTitleReferenced, "Job title");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findContractTypes(Integer page, Integer size, String search) {
		return findAll(contractTypeRepository, page, size, search);
	}

	public TenantMasterDataResponse findContractTypeById(UUID id) {
		return findById(id, contractTypeRepository, "Contract type");
	}

	@Transactional
	public TenantMasterDataResponse createContractType(TenantMasterDataRequest request) {
		return create(request, ContractType::new, contractTypeRepository, contractTypeRepository::existsByTenantIdAndCode, "Contract type");
	}

	@Transactional
	public TenantMasterDataResponse updateContractType(UUID id, TenantMasterDataRequest request) {
		return update(id, request, contractTypeRepository, contractTypeRepository::existsByTenantIdAndCodeAndIdNot, "Contract type");
	}

	@Transactional
	public void disableContractType(UUID id) {
		disable(id, contractTypeRepository, "Contract type");
	}

	@Transactional
	public void deletePhysicalContractType(UUID id) {
		deletePhysical(id, contractTypeRepository, this::isContractTypeReferenced, "Contract type");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findEmploymentStatuses(Integer page, Integer size, String search) {
		return findAll(employmentStatusRepository, page, size, search);
	}

	public TenantMasterDataResponse findEmploymentStatusById(UUID id) {
		return findById(id, employmentStatusRepository, "Employment status");
	}

	@Transactional
	public TenantMasterDataResponse createEmploymentStatus(TenantMasterDataAutoCodeRequest request) {
		return createAutoCode(request, EmploymentStatus::new, employmentStatusRepository, "Employment status", "ES");
	}

	@Transactional
	public TenantMasterDataResponse updateEmploymentStatus(UUID id, TenantMasterDataAutoCodeRequest request) {
		return updateAutoCode(id, request, employmentStatusRepository, employmentStatusRepository::existsByTenantIdAndCodeAndIdNot, "Employment status");
	}

	@Transactional
	public void disableEmploymentStatus(UUID id) {
		disable(id, employmentStatusRepository, "Employment status");
	}

	@Transactional
	public void deletePhysicalEmploymentStatus(UUID id) {
		deletePhysical(id, employmentStatusRepository, this::isEmploymentStatusReferenced, "Employment status");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findWorkModes(Integer page, Integer size, String search) {
		return findAll(workModeRepository, page, size, search);
	}

	public TenantMasterDataResponse findWorkModeById(UUID id) {
		return findById(id, workModeRepository, "Work mode");
	}

	@Transactional
	public TenantMasterDataResponse createWorkMode(TenantMasterDataRequest request) {
		return create(request, WorkMode::new, workModeRepository, workModeRepository::existsByTenantIdAndCode, "Work mode");
	}

	@Transactional
	public TenantMasterDataResponse updateWorkMode(UUID id, TenantMasterDataRequest request) {
		return update(id, request, workModeRepository, workModeRepository::existsByTenantIdAndCodeAndIdNot, "Work mode");
	}

	@Transactional
	public void disableWorkMode(UUID id) {
		disable(id, workModeRepository, "Work mode");
	}

	@Transactional
	public void deletePhysicalWorkMode(UUID id) {
		deletePhysical(id, workModeRepository, this::isWorkModeReferenced, "Work mode");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findLeaveRequestTypes(Integer page, Integer size, String search) {
		return findAll(leaveRequestTypeRepository, page, size, search);
	}

	public TenantMasterDataResponse findLeaveRequestTypeById(UUID id) {
		return findById(id, leaveRequestTypeRepository, "Leave request type");
	}

	@Transactional
	public TenantMasterDataResponse createLeaveRequestType(TenantMasterDataAutoCodeRequest request) {
		return createAutoCode(request, LeaveRequestType::new, leaveRequestTypeRepository, "Leave request type", "LR");
	}

	@Transactional
	public TenantMasterDataResponse updateLeaveRequestType(UUID id, TenantMasterDataAutoCodeRequest request) {
		return updateAutoCode(id, request, leaveRequestTypeRepository, leaveRequestTypeRepository::existsByTenantIdAndCodeAndIdNot, "Leave request type");
	}

	@Transactional
	public void disableLeaveRequestType(UUID id) {
		disable(id, leaveRequestTypeRepository, "Leave request type");
	}

	@Transactional
	public void deletePhysicalLeaveRequestType(UUID id) {
		deletePhysical(id, leaveRequestTypeRepository, this::isLeaveRequestTypeReferenced, "Leave request type");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findDocumentTypes(Integer page, Integer size, String search) {
		return findAll(documentTypeRepository, page, size, search);
	}

	public TenantMasterDataResponse findDocumentTypeById(UUID id) {
		return findById(id, documentTypeRepository, "Document type");
	}

	@Transactional
	public TenantMasterDataResponse createDocumentType(TenantMasterDataAutoCodeRequest request) {
		return createAutoCode(request, DocumentType::new, documentTypeRepository, "Document type", "DT");
	}

	@Transactional
	public TenantMasterDataResponse updateDocumentType(UUID id, TenantMasterDataAutoCodeRequest request) {
		return updateAutoCode(id, request, documentTypeRepository, documentTypeRepository::existsByTenantIdAndCodeAndIdNot, "Document type");
	}

	@Transactional
	public void disableDocumentType(UUID id) {
		disable(id, documentTypeRepository, "Document type");
	}

	@Transactional
	public void deletePhysicalDocumentType(UUID id) {
		deletePhysical(id, documentTypeRepository, this::isDocumentTypeReferenced, "Document type");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findDeviceTypes(Integer page, Integer size, String search) {
		return findAll(deviceTypeRepository, page, size, search);
	}

	public TenantMasterDataResponse findDeviceTypeById(UUID id) {
		return findById(id, deviceTypeRepository, "Device type");
	}

	@Transactional
	public TenantMasterDataResponse createDeviceType(TenantMasterDataAutoCodeRequest request) {
		return createAutoCode(request, DeviceType::new, deviceTypeRepository, "Device type", "DV");
	}

	@Transactional
	public TenantMasterDataResponse updateDeviceType(UUID id, TenantMasterDataAutoCodeRequest request) {
		return updateAutoCode(id, request, deviceTypeRepository, deviceTypeRepository::existsByTenantIdAndCodeAndIdNot, "Device type");
	}

	@Transactional
	public void disableDeviceType(UUID id) {
		disable(id, deviceTypeRepository, "Device type");
	}

	@Transactional
	public void deletePhysicalDeviceType(UUID id) {
		deletePhysical(id, deviceTypeRepository, this::isDeviceTypeReferenced, "Device type");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findDeviceBrands(Integer page, Integer size, String search) {
		return findAll(deviceBrandRepository, page, size, search);
	}

	public TenantMasterDataResponse findDeviceBrandById(UUID id) {
		return findById(id, deviceBrandRepository, "Device brand");
	}

	@Transactional
	public TenantMasterDataResponse createDeviceBrand(TenantMasterDataAutoCodeRequest request) {
		return createAutoCode(request, DeviceBrand::new, deviceBrandRepository, "Device brand", "DB");
	}

	@Transactional
	public TenantMasterDataResponse updateDeviceBrand(UUID id, TenantMasterDataAutoCodeRequest request) {
		return updateAutoCode(id, request, deviceBrandRepository, deviceBrandRepository::existsByTenantIdAndCodeAndIdNot, "Device brand");
	}

	@Transactional
	public void disableDeviceBrand(UUID id) {
		disable(id, deviceBrandRepository, "Device brand");
	}

	@Transactional
	public void deletePhysicalDeviceBrand(UUID id) {
		deletePhysical(id, deviceBrandRepository, this::isDeviceBrandReferenced, "Device brand");
	}

	public MasterDataPageResponse<TenantMasterDataResponse> findDeviceStatuses(Integer page, Integer size, String search) {
		return findAll(deviceStatusRepository, page, size, search);
	}

	public TenantMasterDataResponse findDeviceStatusById(UUID id) {
		return findById(id, deviceStatusRepository, "Device status");
	}

	@Transactional
	public TenantMasterDataResponse createDeviceStatus(TenantMasterDataAutoCodeRequest request) {
		return createAutoCode(request, DeviceStatus::new, deviceStatusRepository, "Device status", "DS");
	}

	@Transactional
	public TenantMasterDataResponse updateDeviceStatus(UUID id, TenantMasterDataAutoCodeRequest request) {
		return updateAutoCode(id, request, deviceStatusRepository, deviceStatusRepository::existsByTenantIdAndCodeAndIdNot, "Device status");
	}

	@Transactional
	public void disableDeviceStatus(UUID id) {
		disable(id, deviceStatusRepository, "Device status");
	}

	@Transactional
	public void deletePhysicalDeviceStatus(UUID id) {
		deletePhysical(id, deviceStatusRepository, this::isDeviceStatusReferenced, "Device status");
	}

	private <T extends BaseTenantMasterEntity> MasterDataPageResponse<TenantMasterDataResponse> findAll(
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			Integer page,
			Integer size,
			String search) {
		return findPage(
				repository,
				page,
				size,
				search,
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toResponse);
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse findById(
			UUID id,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			String label) {
		return toResponse(findEntity(id, repository, label));
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse create(
			TenantMasterDataRequest request,
			Supplier<T> factory,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			BiPredicate<UUID, String> existsByTenantIdAndCode,
			String label) {
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (existsByTenantIdAndCode.test(request.tenantId(), code)) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
		T entity = factory.get();
		applyTenantMasterData(entity, request, code);
		try {
			return toResponse(repository.save(entity));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse update(
			UUID id,
			TenantMasterDataRequest request,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			TenantCodeExcludingIdExists existsByTenantIdAndCodeAndIdNot,
			String label) {
		T entity = findEntity(id, repository, label);
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (existsByTenantIdAndCodeAndIdNot.exists(request.tenantId(), code, id)) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
		applyTenantMasterData(entity, request, code);
		try {
			return toResponse(repository.save(entity));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse createAutoCode(
			TenantMasterDataAutoCodeRequest request,
			Supplier<T> factory,
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			String label,
			String codePrefix) {
		validateTenant(request.tenantId());
		String code = generateNextCode(request.tenantId(), codePrefix, repository, label);
		T entity = factory.get();
		applyTenantMasterData(entity, request.tenantId(), code, request.name(), request.active());
		try {
			return toResponse(repository.save(entity));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException(
					label + " code generation collision for tenant. Retry create operation.");
		}
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse updateAutoCode(
			UUID id,
			TenantMasterDataAutoCodeRequest request,
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			TenantCodeExcludingIdExists existsByTenantIdAndCodeAndIdNot,
			String label) {
		T entity = findEntity(id, repository, label);
		validateTenant(request.tenantId());
		String code = cleanUpper(entity.getCode());
		if (existsByTenantIdAndCodeAndIdNot.exists(request.tenantId(), code, id)) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
		applyTenantMasterData(entity, request.tenantId(), code, request.name(), request.active());
		try {
			return toResponse(repository.save(entity));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
	}

	private <T extends BaseTenantMasterEntity> void disable(
			UUID id,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			String label) {
		T entity = findEntity(id, repository, label);
		entity.setActive(false);
		repository.save(entity);
	}

	private <T extends BaseTenantMasterEntity> void deletePhysical(
			UUID id,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			Predicate<T> isReferenced,
			String label) {
		T entity = findEntity(id, repository, label);
		if (isReferenced.test(entity)) {
			throw physicalDeleteConflict(label);
		}
		try {
			repository.delete(entity);
			repository.flush();
		}
		catch (DataIntegrityViolationException exception) {
			throw physicalDeleteConflict(label);
		}
	}

	private <T extends BaseTenantMasterEntity> T findEntity(
			UUID id,
			org.springframework.data.jpa.repository.JpaRepository<T, UUID> repository,
			String label) {
		return repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(label + " not found: " + id));
	}

	private void validateTenant(UUID tenantId) {
		if (!tenantRepository.existsById(tenantId)) {
			throw new ResourceNotFoundException("Tenant not found: " + tenantId);
		}
	}

	private void applyTenantMasterData(BaseTenantMasterEntity entity, TenantMasterDataRequest request, String code) {
		applyTenantMasterData(entity, request.tenantId(), code, request.name(), request.active());
	}

	private void applyTenantMasterData(
			BaseTenantMasterEntity entity,
			UUID tenantId,
			String code,
			String name,
			Boolean active) {
		entity.setTenantId(tenantId);
		entity.setCode(code);
		entity.setName(clean(name));
		entity.setActive(activeOrDefault(active));
	}

	private TenantMasterDataResponse toResponse(BaseTenantMasterEntity entity) {
		return new TenantMasterDataResponse(
				entity.getId(),
				entity.getTenantId(),
				entity.getCode(),
				entity.getName(),
				entity.getActive(),
				entity.getCreatedAt(),
				entity.getUpdatedAt());
	}

	private Boolean activeOrDefault(Boolean active) {
		return active == null ? Boolean.TRUE : active;
	}

	private String cleanUpper(String value) {
		String cleaned = clean(value);
		return cleaned == null ? null : cleaned.toUpperCase(Locale.ROOT);
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}

	private <T extends BaseTenantMasterEntity, R> MasterDataPageResponse<R> findPage(
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			Integer page,
			Integer size,
			String search,
			org.springframework.data.jpa.domain.Specification<T> specification,
			Function<T, R> mapper) {
		return MasterDataQuerySupport.toPageResponse(
				repository.findAll(
						specification,
						MasterDataQuerySupport.buildPageable(
								page,
								size,
								MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")))),
				mapper);
	}

	private <T extends BaseTenantMasterEntity> String generateNextCode(
			UUID tenantId,
			String codePrefix,
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			String label) {
		List<T> tenantEntities = repository.findAll(
				(root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("tenantId"), tenantId),
				Sort.by(Sort.Order.desc("code")));
		int maxProgressive = 0;
		for (T entity : tenantEntities) {
			int parsedProgressive = parseProgressiveCode(entity.getCode(), codePrefix);
			if (parsedProgressive > maxProgressive) {
				maxProgressive = parsedProgressive;
			}
		}

		if (maxProgressive >= 999) {
			throw new ResourceConflictException(label + " code progressive exhausted for tenant: " + tenantId);
		}

		return codePrefix + String.format(Locale.ROOT, "%03d", maxProgressive + 1);
	}

	private int parseProgressiveCode(String code, String prefix) {
		String normalizedCode = cleanUpper(code);
		if (normalizedCode == null || !normalizedCode.startsWith(prefix)) {
			return -1;
		}
		if (normalizedCode.length() != prefix.length() + 3) {
			return -1;
		}
		String progressive = normalizedCode.substring(prefix.length());
		for (int index = 0; index < progressive.length(); index++) {
			if (!Character.isDigit(progressive.charAt(index))) {
				return -1;
			}
		}
		return Integer.parseInt(progressive);
	}

	@FunctionalInterface
	private interface TenantCodeExcludingIdExists {
		boolean exists(UUID tenantId, String code, UUID id);
	}

	private boolean isDepartmentReferenced(Department department) {
		return employeeRepository.existsByTenant_IdAndDepartment(department.getTenantId(), department.getCode());
	}

	private boolean isJobTitleReferenced(JobTitle jobTitle) {
		return employeeRepository.existsByTenant_IdAndJobTitle(jobTitle.getTenantId(), jobTitle.getCode());
	}

	private boolean isContractTypeReferenced(ContractType contractType) {
		return employeeRepository.existsByTenant_IdAndContractType(contractType.getTenantId(), contractType.getCode())
				|| contractRepository.existsByContractType_Id(contractType.getId());
	}

	private boolean isWorkModeReferenced(WorkMode workMode) {
		return employeeRepository.existsByTenant_IdAndWorkMode(workMode.getTenantId(), workMode.getCode());
	}

	private boolean isEmploymentStatusReferenced(EmploymentStatus employmentStatus) {
		return employeeRepository.existsByTenant_IdAndEmploymentStatus(employmentStatus.getTenantId(), employmentStatus.getCode());
	}

	private boolean isLeaveRequestTypeReferenced(LeaveRequestType leaveRequestType) {
		return leaveRequestRepository.existsByLeaveRequestType_Id(leaveRequestType.getId());
	}

	private boolean isDocumentTypeReferenced(DocumentType documentType) {
		return payrollDocumentRepository.existsByDocumentType_Id(documentType.getId());
	}

	private boolean isDeviceTypeReferenced(DeviceType deviceType) {
		return deviceRepository.existsByType_Id(deviceType.getId());
	}

	private boolean isDeviceBrandReferenced(DeviceBrand deviceBrand) {
		return deviceRepository.existsByBrand_Id(deviceBrand.getId());
	}

	private boolean isDeviceStatusReferenced(DeviceStatus deviceStatus) {
		return deviceRepository.existsByDeviceStatus_Id(deviceStatus.getId());
	}

	private ResourceConflictException physicalDeleteConflict(String label) {
		return new ResourceConflictException(label + " cannot be physically deleted because it is referenced by other data");
	}
}
