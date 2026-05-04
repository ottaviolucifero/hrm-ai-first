package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.hrbusiness.TenantMasterDataRequest;
import com.odsoftware.hrm.dto.masterdata.hrbusiness.TenantMasterDataResponse;
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
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.function.BiPredicate;
import java.util.function.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MasterDataHrBusinessService {

	private final TenantRepository tenantRepository;
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

	public List<TenantMasterDataResponse> findDepartments() {
		return findAll(departmentRepository);
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

	public List<TenantMasterDataResponse> findJobTitles() {
		return findAll(jobTitleRepository);
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

	public List<TenantMasterDataResponse> findContractTypes() {
		return findAll(contractTypeRepository);
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

	public List<TenantMasterDataResponse> findEmploymentStatuses() {
		return findAll(employmentStatusRepository);
	}

	public TenantMasterDataResponse findEmploymentStatusById(UUID id) {
		return findById(id, employmentStatusRepository, "Employment status");
	}

	@Transactional
	public TenantMasterDataResponse createEmploymentStatus(TenantMasterDataRequest request) {
		return create(request, EmploymentStatus::new, employmentStatusRepository, employmentStatusRepository::existsByTenantIdAndCode, "Employment status");
	}

	@Transactional
	public TenantMasterDataResponse updateEmploymentStatus(UUID id, TenantMasterDataRequest request) {
		return update(id, request, employmentStatusRepository, employmentStatusRepository::existsByTenantIdAndCodeAndIdNot, "Employment status");
	}

	@Transactional
	public void disableEmploymentStatus(UUID id) {
		disable(id, employmentStatusRepository, "Employment status");
	}

	public List<TenantMasterDataResponse> findWorkModes() {
		return findAll(workModeRepository);
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

	public List<TenantMasterDataResponse> findLeaveRequestTypes() {
		return findAll(leaveRequestTypeRepository);
	}

	public TenantMasterDataResponse findLeaveRequestTypeById(UUID id) {
		return findById(id, leaveRequestTypeRepository, "Leave request type");
	}

	@Transactional
	public TenantMasterDataResponse createLeaveRequestType(TenantMasterDataRequest request) {
		return create(request, LeaveRequestType::new, leaveRequestTypeRepository, leaveRequestTypeRepository::existsByTenantIdAndCode, "Leave request type");
	}

	@Transactional
	public TenantMasterDataResponse updateLeaveRequestType(UUID id, TenantMasterDataRequest request) {
		return update(id, request, leaveRequestTypeRepository, leaveRequestTypeRepository::existsByTenantIdAndCodeAndIdNot, "Leave request type");
	}

	@Transactional
	public void disableLeaveRequestType(UUID id) {
		disable(id, leaveRequestTypeRepository, "Leave request type");
	}

	public List<TenantMasterDataResponse> findDocumentTypes() {
		return findAll(documentTypeRepository);
	}

	public TenantMasterDataResponse findDocumentTypeById(UUID id) {
		return findById(id, documentTypeRepository, "Document type");
	}

	@Transactional
	public TenantMasterDataResponse createDocumentType(TenantMasterDataRequest request) {
		return create(request, DocumentType::new, documentTypeRepository, documentTypeRepository::existsByTenantIdAndCode, "Document type");
	}

	@Transactional
	public TenantMasterDataResponse updateDocumentType(UUID id, TenantMasterDataRequest request) {
		return update(id, request, documentTypeRepository, documentTypeRepository::existsByTenantIdAndCodeAndIdNot, "Document type");
	}

	@Transactional
	public void disableDocumentType(UUID id) {
		disable(id, documentTypeRepository, "Document type");
	}

	public List<TenantMasterDataResponse> findDeviceTypes() {
		return findAll(deviceTypeRepository);
	}

	public TenantMasterDataResponse findDeviceTypeById(UUID id) {
		return findById(id, deviceTypeRepository, "Device type");
	}

	@Transactional
	public TenantMasterDataResponse createDeviceType(TenantMasterDataRequest request) {
		return create(request, DeviceType::new, deviceTypeRepository, deviceTypeRepository::existsByTenantIdAndCode, "Device type");
	}

	@Transactional
	public TenantMasterDataResponse updateDeviceType(UUID id, TenantMasterDataRequest request) {
		return update(id, request, deviceTypeRepository, deviceTypeRepository::existsByTenantIdAndCodeAndIdNot, "Device type");
	}

	@Transactional
	public void disableDeviceType(UUID id) {
		disable(id, deviceTypeRepository, "Device type");
	}

	public List<TenantMasterDataResponse> findDeviceBrands() {
		return findAll(deviceBrandRepository);
	}

	public TenantMasterDataResponse findDeviceBrandById(UUID id) {
		return findById(id, deviceBrandRepository, "Device brand");
	}

	@Transactional
	public TenantMasterDataResponse createDeviceBrand(TenantMasterDataRequest request) {
		return create(request, DeviceBrand::new, deviceBrandRepository, deviceBrandRepository::existsByTenantIdAndCode, "Device brand");
	}

	@Transactional
	public TenantMasterDataResponse updateDeviceBrand(UUID id, TenantMasterDataRequest request) {
		return update(id, request, deviceBrandRepository, deviceBrandRepository::existsByTenantIdAndCodeAndIdNot, "Device brand");
	}

	@Transactional
	public void disableDeviceBrand(UUID id) {
		disable(id, deviceBrandRepository, "Device brand");
	}

	public List<TenantMasterDataResponse> findDeviceStatuses() {
		return findAll(deviceStatusRepository);
	}

	public TenantMasterDataResponse findDeviceStatusById(UUID id) {
		return findById(id, deviceStatusRepository, "Device status");
	}

	@Transactional
	public TenantMasterDataResponse createDeviceStatus(TenantMasterDataRequest request) {
		return create(request, DeviceStatus::new, deviceStatusRepository, deviceStatusRepository::existsByTenantIdAndCode, "Device status");
	}

	@Transactional
	public TenantMasterDataResponse updateDeviceStatus(UUID id, TenantMasterDataRequest request) {
		return update(id, request, deviceStatusRepository, deviceStatusRepository::existsByTenantIdAndCodeAndIdNot, "Device status");
	}

	@Transactional
	public void disableDeviceStatus(UUID id) {
		disable(id, deviceStatusRepository, "Device status");
	}

	private <T extends BaseTenantMasterEntity> List<TenantMasterDataResponse> findAll(JpaRepository<T, UUID> repository) {
		return repository.findAll().stream()
				.sorted(Comparator.comparing(BaseTenantMasterEntity::getCode))
				.map(this::toResponse)
				.toList();
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse findById(UUID id, JpaRepository<T, UUID> repository, String label) {
		return toResponse(findEntity(id, repository, label));
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse create(
			TenantMasterDataRequest request,
			Supplier<T> factory,
			JpaRepository<T, UUID> repository,
			BiPredicate<UUID, String> existsByTenantIdAndCode,
			String label) {
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (existsByTenantIdAndCode.test(request.tenantId(), code)) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
		T entity = factory.get();
		applyTenantMasterData(entity, request, code);
		return toResponse(repository.save(entity));
	}

	private <T extends BaseTenantMasterEntity> TenantMasterDataResponse update(
			UUID id,
			TenantMasterDataRequest request,
			JpaRepository<T, UUID> repository,
			TenantCodeExcludingIdExists existsByTenantIdAndCodeAndIdNot,
			String label) {
		T entity = findEntity(id, repository, label);
		validateTenant(request.tenantId());
		String code = cleanUpper(request.code());
		if (existsByTenantIdAndCodeAndIdNot.exists(request.tenantId(), code, id)) {
			throw new ResourceConflictException(label + " code already exists for tenant: " + code);
		}
		applyTenantMasterData(entity, request, code);
		return toResponse(repository.save(entity));
	}

	private <T extends BaseTenantMasterEntity> void disable(UUID id, JpaRepository<T, UUID> repository, String label) {
		T entity = findEntity(id, repository, label);
		entity.setActive(false);
		repository.save(entity);
	}

	private <T extends BaseTenantMasterEntity> T findEntity(UUID id, JpaRepository<T, UUID> repository, String label) {
		return repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException(label + " not found: " + id));
	}

	private void validateTenant(UUID tenantId) {
		if (!tenantRepository.existsById(tenantId)) {
			throw new ResourceNotFoundException("Tenant not found: " + tenantId);
		}
	}

	private void applyTenantMasterData(BaseTenantMasterEntity entity, TenantMasterDataRequest request, String code) {
		entity.setTenantId(request.tenantId());
		entity.setCode(code);
		entity.setName(clean(request.name()));
		entity.setActive(activeOrDefault(request.active()));
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

	@FunctionalInterface
	private interface TenantCodeExcludingIdExists {
		boolean exists(UUID tenantId, String code, UUID id);
	}
}
