package com.odsoftware.hrm.entity.leave;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.master.LeaveRequestType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false, updatable = false)
	private UUID id;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tenant_id", nullable = false)
	private Tenant tenant;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "company_profile_id", nullable = false)
	private CompanyProfile companyProfile;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "leave_request_type_id", nullable = false)
	private LeaveRequestType leaveRequestType;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "end_date")
	private LocalDate endDate;

	@DecimalMin("0.00")
	@Column(name = "duration_days", precision = 6, scale = 2)
	private BigDecimal durationDays;

	@NotNull
	@Column(name = "deduct_from_balance", nullable = false)
	private Boolean deductFromBalance = true;

	@DecimalMin("0.000")
	@Column(name = "deducted_days", precision = 6, scale = 3)
	private BigDecimal deductedDays;

	@Size(max = 1000)
	@Column(name = "reason", length = 1000)
	private String reason;

	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 50)
	private LeaveRequestStatus status = LeaveRequestStatus.DRAFT;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "approver_employee_id")
	private Employee approver;

	@Size(max = 1000)
	@Column(name = "comments", length = 1000)
	private String comments;

	@NotNull
	@Column(name = "is_urgent", nullable = false)
	private Boolean urgent = false;

	@Size(max = 1000)
	@Column(name = "urgent_reason", length = 1000)
	private String urgentReason;

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@PrePersist
	void prePersist() {
		OffsetDateTime now = OffsetDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
		if (this.status == null) {
			this.status = LeaveRequestStatus.DRAFT;
		}
		if (this.deductFromBalance == null) {
			this.deductFromBalance = true;
		}
		if (this.urgent == null) {
			this.urgent = false;
		}
	}

	@PreUpdate
	void preUpdate() {
		this.updatedAt = OffsetDateTime.now();
	}

	public UUID getId() {
		return id;
	}

	public Tenant getTenant() {
		return tenant;
	}

	public void setTenant(Tenant tenant) {
		this.tenant = tenant;
	}

	public CompanyProfile getCompanyProfile() {
		return companyProfile;
	}

	public void setCompanyProfile(CompanyProfile companyProfile) {
		this.companyProfile = companyProfile;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public LeaveRequestType getLeaveRequestType() {
		return leaveRequestType;
	}

	public void setLeaveRequestType(LeaveRequestType leaveRequestType) {
		this.leaveRequestType = leaveRequestType;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getDurationDays() {
		return durationDays;
	}

	public void setDurationDays(BigDecimal durationDays) {
		this.durationDays = durationDays;
	}

	public Boolean getDeductFromBalance() {
		return deductFromBalance;
	}

	public void setDeductFromBalance(Boolean deductFromBalance) {
		this.deductFromBalance = deductFromBalance;
	}

	public BigDecimal getDeductedDays() {
		return deductedDays;
	}

	public void setDeductedDays(BigDecimal deductedDays) {
		this.deductedDays = deductedDays;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public LeaveRequestStatus getStatus() {
		return status;
	}

	public void setStatus(LeaveRequestStatus status) {
		this.status = status;
	}

	public Employee getApprover() {
		return approver;
	}

	public void setApprover(Employee approver) {
		this.approver = approver;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public Boolean getUrgent() {
		return urgent;
	}

	public void setUrgent(Boolean urgent) {
		this.urgent = urgent;
	}

	public String getUrgentReason() {
		return urgentReason;
	}

	public void setUrgentReason(String urgentReason) {
		this.urgentReason = urgentReason;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
}
