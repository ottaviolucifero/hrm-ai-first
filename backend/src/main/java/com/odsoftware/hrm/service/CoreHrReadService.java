package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.corehr.AuditLogResponse;
import com.odsoftware.hrm.dto.corehr.ContractResponse;
import com.odsoftware.hrm.dto.corehr.CoreHrReferenceResponse;
import com.odsoftware.hrm.dto.corehr.DeviceResponse;
import com.odsoftware.hrm.dto.corehr.EmployeeDisciplinaryActionResponse;
import com.odsoftware.hrm.dto.corehr.EmployeeResponse;
import com.odsoftware.hrm.dto.corehr.HolidayCalendarResponse;
import com.odsoftware.hrm.dto.corehr.LeaveRequestResponse;
import com.odsoftware.hrm.dto.corehr.PayrollDocumentResponse;
import com.odsoftware.hrm.entity.audit.AuditLog;
import com.odsoftware.hrm.entity.calendar.HolidayCalendar;
import com.odsoftware.hrm.entity.contract.Contract;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.OfficeLocation;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.device.Device;
import com.odsoftware.hrm.entity.disciplinary.EmployeeDisciplinaryAction;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.leave.LeaveRequest;
import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.AuditActionType;
import com.odsoftware.hrm.entity.master.ContractType;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Currency;
import com.odsoftware.hrm.entity.master.DeviceBrand;
import com.odsoftware.hrm.entity.master.DeviceStatus;
import com.odsoftware.hrm.entity.master.DeviceType;
import com.odsoftware.hrm.entity.master.DisciplinaryActionType;
import com.odsoftware.hrm.entity.master.DocumentType;
import com.odsoftware.hrm.entity.master.LeaveRequestType;
import com.odsoftware.hrm.entity.master.Region;
import com.odsoftware.hrm.entity.payroll.PayrollDocument;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.audit.AuditLogRepository;
import com.odsoftware.hrm.repository.calendar.HolidayCalendarRepository;
import com.odsoftware.hrm.repository.contract.ContractRepository;
import com.odsoftware.hrm.repository.device.DeviceRepository;
import com.odsoftware.hrm.repository.disciplinary.EmployeeDisciplinaryActionRepository;
import com.odsoftware.hrm.repository.employee.EmployeeRepository;
import com.odsoftware.hrm.repository.leave.LeaveRequestRepository;
import com.odsoftware.hrm.repository.payroll.PayrollDocumentRepository;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CoreHrReadService {

	private final EmployeeRepository employeeRepository;
	private final ContractRepository contractRepository;
	private final DeviceRepository deviceRepository;
	private final PayrollDocumentRepository payrollDocumentRepository;
	private final LeaveRequestRepository leaveRequestRepository;
	private final HolidayCalendarRepository holidayCalendarRepository;
	private final AuditLogRepository auditLogRepository;
	private final EmployeeDisciplinaryActionRepository employeeDisciplinaryActionRepository;

	public CoreHrReadService(
			EmployeeRepository employeeRepository,
			ContractRepository contractRepository,
			DeviceRepository deviceRepository,
			PayrollDocumentRepository payrollDocumentRepository,
			LeaveRequestRepository leaveRequestRepository,
			HolidayCalendarRepository holidayCalendarRepository,
			AuditLogRepository auditLogRepository,
			EmployeeDisciplinaryActionRepository employeeDisciplinaryActionRepository) {
		this.employeeRepository = employeeRepository;
		this.contractRepository = contractRepository;
		this.deviceRepository = deviceRepository;
		this.payrollDocumentRepository = payrollDocumentRepository;
		this.leaveRequestRepository = leaveRequestRepository;
		this.holidayCalendarRepository = holidayCalendarRepository;
		this.auditLogRepository = auditLogRepository;
		this.employeeDisciplinaryActionRepository = employeeDisciplinaryActionRepository;
	}

	public List<EmployeeResponse> findEmployees() {
		return employeeRepository.findAll().stream()
				.sorted(Comparator.comparing(Employee::getEmployeeCode))
				.map(this::toEmployeeResponse)
				.toList();
	}

	public EmployeeResponse findEmployeeById(UUID id) {
		return employeeRepository.findById(id)
				.map(this::toEmployeeResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
	}

	public List<ContractResponse> findContracts() {
		return contractRepository.findAll().stream()
				.sorted(Comparator.comparing(contract -> contract.getId().toString()))
				.map(this::toContractResponse)
				.toList();
	}

	public ContractResponse findContractById(UUID id) {
		return contractRepository.findById(id)
				.map(this::toContractResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Contract not found: " + id));
	}

	public List<DeviceResponse> findDevices() {
		return deviceRepository.findAll().stream()
				.sorted(Comparator.comparing(Device::getName))
				.map(this::toDeviceResponse)
				.toList();
	}

	public DeviceResponse findDeviceById(UUID id) {
		return deviceRepository.findById(id)
				.map(this::toDeviceResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Device not found: " + id));
	}

	public List<PayrollDocumentResponse> findPayrollDocuments() {
		return payrollDocumentRepository.findAll().stream()
				.sorted(Comparator.comparing(payrollDocument -> payrollDocument.getId().toString()))
				.map(this::toPayrollDocumentResponse)
				.toList();
	}

	public PayrollDocumentResponse findPayrollDocumentById(UUID id) {
		return payrollDocumentRepository.findById(id)
				.map(this::toPayrollDocumentResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Payroll document not found: " + id));
	}

	public List<LeaveRequestResponse> findLeaveRequests() {
		return leaveRequestRepository.findAll().stream()
				.sorted(Comparator.comparing(leaveRequest -> leaveRequest.getId().toString()))
				.map(this::toLeaveRequestResponse)
				.toList();
	}

	public LeaveRequestResponse findLeaveRequestById(UUID id) {
		return leaveRequestRepository.findById(id)
				.map(this::toLeaveRequestResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + id));
	}

	public List<HolidayCalendarResponse> findHolidayCalendars() {
		return holidayCalendarRepository.findAll().stream()
				.sorted(Comparator.comparing(HolidayCalendar::getName))
				.map(this::toHolidayCalendarResponse)
				.toList();
	}

	public HolidayCalendarResponse findHolidayCalendarById(UUID id) {
		return holidayCalendarRepository.findById(id)
				.map(this::toHolidayCalendarResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Holiday calendar not found: " + id));
	}

	public List<AuditLogResponse> findAuditLogs() {
		return auditLogRepository.findAll().stream()
				.sorted(Comparator.comparing(AuditLog::getCreatedAt))
				.map(this::toAuditLogResponse)
				.toList();
	}

	public AuditLogResponse findAuditLogById(UUID id) {
		return auditLogRepository.findById(id)
				.map(this::toAuditLogResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Audit log not found: " + id));
	}

	public List<EmployeeDisciplinaryActionResponse> findEmployeeDisciplinaryActions() {
		return employeeDisciplinaryActionRepository.findAll().stream()
				.sorted(Comparator.comparing(EmployeeDisciplinaryAction::getActionDate))
				.map(this::toEmployeeDisciplinaryActionResponse)
				.toList();
	}

	public EmployeeDisciplinaryActionResponse findEmployeeDisciplinaryActionById(UUID id) {
		return employeeDisciplinaryActionRepository.findById(id)
				.map(this::toEmployeeDisciplinaryActionResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Employee disciplinary action not found: " + id));
	}

	private EmployeeResponse toEmployeeResponse(Employee employee) {
		return new EmployeeResponse(
				employee.getId(),
				toReference(employee.getTenant()),
				toReference(employee.getCompany()),
				toReference(employee.getOffice()),
				employee.getEmployeeCode(),
				employee.getFirstName(),
				employee.getLastName(),
				employee.getEmail(),
				employee.getDepartment(),
				employee.getJobTitle(),
				employee.getEmploymentStatus(),
				employee.getHireDate(),
				employee.getTerminationDate(),
				employee.getActive());
	}

	private ContractResponse toContractResponse(Contract contract) {
		return new ContractResponse(
				contract.getId(),
				toReference(contract.getTenant()),
				toReference(contract.getCompanyProfile()),
				toReference(contract.getEmployee()),
				toReference(contract.getContractType()),
				toReference(contract.getCurrency()),
				contract.getStartDate(),
				contract.getEndDate(),
				contract.getBaseSalary(),
				contract.getWeeklyHours(),
				contract.getActive());
	}

	private DeviceResponse toDeviceResponse(Device device) {
		return new DeviceResponse(
				device.getId(),
				toReference(device.getTenant()),
				toReference(device.getCompanyProfile()),
				device.getName(),
				toReference(device.getType()),
				toReference(device.getBrand()),
				device.getModel(),
				device.getSerialNumber(),
				device.getPurchaseDate(),
				device.getWarrantyEndDate(),
				toReference(device.getDeviceStatus()),
				toReference(device.getAssignedTo()),
				device.getAssignedAt(),
				device.getActive());
	}

	private PayrollDocumentResponse toPayrollDocumentResponse(PayrollDocument payrollDocument) {
		return new PayrollDocumentResponse(
				payrollDocument.getId(),
				toReference(payrollDocument.getTenant()),
				toReference(payrollDocument.getCompanyProfile()),
				toReference(payrollDocument.getEmployee()),
				toReference(payrollDocument.getContract()),
				toReference(payrollDocument.getDocumentType()),
				toReference(payrollDocument.getUploadedBy()),
				payrollDocument.getOriginalFilename(),
				payrollDocument.getContentType(),
				payrollDocument.getFileSizeBytes(),
				payrollDocument.getPeriodYear(),
				payrollDocument.getPeriodMonth(),
				payrollDocument.getStatus(),
				payrollDocument.getPublishedAt(),
				payrollDocument.getIssuerName(),
				payrollDocument.getUploadedAt());
	}

	private LeaveRequestResponse toLeaveRequestResponse(LeaveRequest leaveRequest) {
		return new LeaveRequestResponse(
				leaveRequest.getId(),
				toReference(leaveRequest.getTenant()),
				toReference(leaveRequest.getCompanyProfile()),
				toReference(leaveRequest.getEmployee()),
				toReference(leaveRequest.getLeaveRequestType()),
				leaveRequest.getStartDate(),
				leaveRequest.getEndDate(),
				leaveRequest.getDurationDays(),
				leaveRequest.getDeductFromBalance(),
				leaveRequest.getDeductedDays(),
				leaveRequest.getReason(),
				leaveRequest.getStatus(),
				toReference(leaveRequest.getApprover()),
				leaveRequest.getUrgent());
	}

	private HolidayCalendarResponse toHolidayCalendarResponse(HolidayCalendar holidayCalendar) {
		return new HolidayCalendarResponse(
				holidayCalendar.getId(),
				toReference(holidayCalendar.getCountry()),
				toReference(holidayCalendar.getRegion()),
				toReference(holidayCalendar.getArea()),
				holidayCalendar.getStartDate(),
				holidayCalendar.getEndDate(),
				holidayCalendar.getName(),
				holidayCalendar.getActive());
	}

	private AuditLogResponse toAuditLogResponse(AuditLog auditLog) {
		return new AuditLogResponse(
				auditLog.getId(),
				toReference(auditLog.getTenant()),
				toReference(auditLog.getCompanyProfile()),
				toReference(auditLog.getUserAccount()),
				toReference(auditLog.getAuditActionType()),
				toReference(auditLog.getActingTenant()),
				toReference(auditLog.getTargetTenant()),
				auditLog.getImpersonationMode(),
				auditLog.getEntityType(),
				auditLog.getEntityId(),
				auditLog.getEntityDisplayName(),
				auditLog.getDescription(),
				auditLog.getCreatedAt(),
				auditLog.getSuccess(),
				auditLog.getSeverityLevel());
	}

	private EmployeeDisciplinaryActionResponse toEmployeeDisciplinaryActionResponse(EmployeeDisciplinaryAction action) {
		return new EmployeeDisciplinaryActionResponse(
				action.getId(),
				toReference(action.getTenant()),
				toReference(action.getCompanyProfile()),
				toReference(action.getEmployee()),
				toReference(action.getDisciplinaryActionType()),
				action.getActionDate(),
				action.getTitle(),
				action.getDescription(),
				toReference(action.getIssuedBy()),
				toReference(action.getRelatedDocument()),
				action.getActive());
	}

	private CoreHrReferenceResponse toReference(Tenant tenant) {
		return tenant == null ? null : new CoreHrReferenceResponse(tenant.getId(), tenant.getCode(), tenant.getName());
	}

	private CoreHrReferenceResponse toReference(CompanyProfile companyProfile) {
		return companyProfile == null ? null : new CoreHrReferenceResponse(companyProfile.getId(), companyProfile.getCode(), companyProfile.getLegalName());
	}

	private CoreHrReferenceResponse toReference(OfficeLocation officeLocation) {
		return officeLocation == null ? null : new CoreHrReferenceResponse(officeLocation.getId(), officeLocation.getCode(), officeLocation.getName());
	}

	private CoreHrReferenceResponse toReference(Employee employee) {
		return employee == null ? null : new CoreHrReferenceResponse(employee.getId(), employee.getEmployeeCode(), employee.getFirstName() + " " + employee.getLastName());
	}

	private CoreHrReferenceResponse toReference(UserAccount userAccount) {
		return userAccount == null ? null : new CoreHrReferenceResponse(userAccount.getId(), userAccount.getEmail(), userAccount.getEmail());
	}

	private CoreHrReferenceResponse toReference(Contract contract) {
		return contract == null ? null : new CoreHrReferenceResponse(contract.getId(), contract.getId().toString(), "Contract " + contract.getStartDate());
	}

	private CoreHrReferenceResponse toReference(PayrollDocument payrollDocument) {
		return payrollDocument == null ? null : new CoreHrReferenceResponse(payrollDocument.getId(), payrollDocument.getOriginalFilename(), payrollDocument.getOriginalFilename());
	}

	private CoreHrReferenceResponse toReference(Country country) {
		return country == null ? null : new CoreHrReferenceResponse(country.getId(), country.getIsoCode(), country.getName());
	}

	private CoreHrReferenceResponse toReference(Region region) {
		return region == null ? null : new CoreHrReferenceResponse(region.getId(), region.getCode(), region.getName());
	}

	private CoreHrReferenceResponse toReference(Area area) {
		return area == null ? null : new CoreHrReferenceResponse(area.getId(), area.getCode(), area.getName());
	}

	private CoreHrReferenceResponse toReference(ContractType contractType) {
		return contractType == null ? null : new CoreHrReferenceResponse(contractType.getId(), contractType.getCode(), contractType.getName());
	}

	private CoreHrReferenceResponse toReference(Currency currency) {
		return currency == null ? null : new CoreHrReferenceResponse(currency.getId(), currency.getCode(), currency.getName());
	}

	private CoreHrReferenceResponse toReference(DeviceType deviceType) {
		return deviceType == null ? null : new CoreHrReferenceResponse(deviceType.getId(), deviceType.getCode(), deviceType.getName());
	}

	private CoreHrReferenceResponse toReference(DeviceBrand deviceBrand) {
		return deviceBrand == null ? null : new CoreHrReferenceResponse(deviceBrand.getId(), deviceBrand.getCode(), deviceBrand.getName());
	}

	private CoreHrReferenceResponse toReference(DeviceStatus deviceStatus) {
		return deviceStatus == null ? null : new CoreHrReferenceResponse(deviceStatus.getId(), deviceStatus.getCode(), deviceStatus.getName());
	}

	private CoreHrReferenceResponse toReference(DocumentType documentType) {
		return documentType == null ? null : new CoreHrReferenceResponse(documentType.getId(), documentType.getCode(), documentType.getName());
	}

	private CoreHrReferenceResponse toReference(LeaveRequestType leaveRequestType) {
		return leaveRequestType == null ? null : new CoreHrReferenceResponse(leaveRequestType.getId(), leaveRequestType.getCode(), leaveRequestType.getName());
	}

	private CoreHrReferenceResponse toReference(AuditActionType auditActionType) {
		return auditActionType == null ? null : new CoreHrReferenceResponse(auditActionType.getId(), auditActionType.getCode(), auditActionType.getName());
	}

	private CoreHrReferenceResponse toReference(DisciplinaryActionType disciplinaryActionType) {
		return disciplinaryActionType == null ? null : new CoreHrReferenceResponse(disciplinaryActionType.getId(), disciplinaryActionType.getCode(), disciplinaryActionType.getName());
	}
}
