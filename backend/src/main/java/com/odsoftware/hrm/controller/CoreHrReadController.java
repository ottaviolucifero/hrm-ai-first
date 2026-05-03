package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.corehr.AuditLogResponse;
import com.odsoftware.hrm.dto.corehr.ContractResponse;
import com.odsoftware.hrm.dto.corehr.DeviceResponse;
import com.odsoftware.hrm.dto.corehr.EmployeeDisciplinaryActionResponse;
import com.odsoftware.hrm.dto.corehr.EmployeeResponse;
import com.odsoftware.hrm.dto.corehr.HolidayCalendarResponse;
import com.odsoftware.hrm.dto.corehr.LeaveRequestResponse;
import com.odsoftware.hrm.dto.corehr.PayrollDocumentResponse;
import com.odsoftware.hrm.service.CoreHrReadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/core-hr")
@Tag(name = "Core HR", description = "Read-only core HR API readiness")
@Validated
public class CoreHrReadController {

	private final CoreHrReadService coreHrReadService;

	public CoreHrReadController(CoreHrReadService coreHrReadService) {
		this.coreHrReadService = coreHrReadService;
	}

	@GetMapping("/employees")
	@Operation(summary = "List employees")
	public List<EmployeeResponse> findEmployees() {
		return coreHrReadService.findEmployees();
	}

	@GetMapping("/employees/{id}")
	@Operation(summary = "Get employee by id")
	public EmployeeResponse findEmployeeById(@PathVariable UUID id) {
		return coreHrReadService.findEmployeeById(id);
	}

	@GetMapping("/contracts")
	@Operation(summary = "List contracts")
	public List<ContractResponse> findContracts() {
		return coreHrReadService.findContracts();
	}

	@GetMapping("/contracts/{id}")
	@Operation(summary = "Get contract by id")
	public ContractResponse findContractById(@PathVariable UUID id) {
		return coreHrReadService.findContractById(id);
	}

	@GetMapping("/devices")
	@Operation(summary = "List devices")
	public List<DeviceResponse> findDevices() {
		return coreHrReadService.findDevices();
	}

	@GetMapping("/devices/{id}")
	@Operation(summary = "Get device by id")
	public DeviceResponse findDeviceById(@PathVariable UUID id) {
		return coreHrReadService.findDeviceById(id);
	}

	@GetMapping("/payroll-documents")
	@Operation(summary = "List payroll documents")
	public List<PayrollDocumentResponse> findPayrollDocuments() {
		return coreHrReadService.findPayrollDocuments();
	}

	@GetMapping("/payroll-documents/{id}")
	@Operation(summary = "Get payroll document by id")
	public PayrollDocumentResponse findPayrollDocumentById(@PathVariable UUID id) {
		return coreHrReadService.findPayrollDocumentById(id);
	}

	@GetMapping("/leave-requests")
	@Operation(summary = "List leave requests")
	public List<LeaveRequestResponse> findLeaveRequests() {
		return coreHrReadService.findLeaveRequests();
	}

	@GetMapping("/leave-requests/{id}")
	@Operation(summary = "Get leave request by id")
	public LeaveRequestResponse findLeaveRequestById(@PathVariable UUID id) {
		return coreHrReadService.findLeaveRequestById(id);
	}

	@GetMapping("/holiday-calendars")
	@Operation(summary = "List holiday calendars")
	public List<HolidayCalendarResponse> findHolidayCalendars() {
		return coreHrReadService.findHolidayCalendars();
	}

	@GetMapping("/holiday-calendars/{id}")
	@Operation(summary = "Get holiday calendar by id")
	public HolidayCalendarResponse findHolidayCalendarById(@PathVariable UUID id) {
		return coreHrReadService.findHolidayCalendarById(id);
	}

	@GetMapping("/audit-logs")
	@Operation(summary = "List audit logs")
	public List<AuditLogResponse> findAuditLogs() {
		return coreHrReadService.findAuditLogs();
	}

	@GetMapping("/audit-logs/{id}")
	@Operation(summary = "Get audit log by id")
	public AuditLogResponse findAuditLogById(@PathVariable UUID id) {
		return coreHrReadService.findAuditLogById(id);
	}

	@GetMapping("/employee-disciplinary-actions")
	@Operation(summary = "List employee disciplinary actions")
	public List<EmployeeDisciplinaryActionResponse> findEmployeeDisciplinaryActions() {
		return coreHrReadService.findEmployeeDisciplinaryActions();
	}

	@GetMapping("/employee-disciplinary-actions/{id}")
	@Operation(summary = "Get employee disciplinary action by id")
	public EmployeeDisciplinaryActionResponse findEmployeeDisciplinaryActionById(@PathVariable UUID id) {
		return coreHrReadService.findEmployeeDisciplinaryActionById(id);
	}
}
