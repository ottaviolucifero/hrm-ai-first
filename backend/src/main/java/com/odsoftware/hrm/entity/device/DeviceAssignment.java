package com.odsoftware.hrm.entity.device;

import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "device_assignments")
public class DeviceAssignment {

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
	@JoinColumn(name = "device_id", nullable = false)
	private Device device;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

	@NotNull
	@Column(name = "assigned_from", nullable = false)
	private OffsetDateTime assignedFrom;

	@Column(name = "assigned_to")
	private OffsetDateTime assignedTo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_by_user_id")
	private UserAccount assignedByUser;

	@Column(name = "returned_at")
	private OffsetDateTime returnedAt;

	@Size(max = 1000)
	@Column(name = "return_note", length = 1000)
	private String returnNote;

	@Size(max = 255)
	@Column(name = "condition_on_assign", length = 255)
	private String conditionOnAssign;

	@Size(max = 255)
	@Column(name = "condition_on_return", length = 255)
	private String conditionOnReturn;

	@Size(max = 1000)
	@Column(name = "notes", length = 1000)
	private String notes;

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@PrePersist
	void prePersist() {
		OffsetDateTime now = OffsetDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
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

	public Device getDevice() {
		return device;
	}

	public void setDevice(Device device) {
		this.device = device;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public OffsetDateTime getAssignedFrom() {
		return assignedFrom;
	}

	public void setAssignedFrom(OffsetDateTime assignedFrom) {
		this.assignedFrom = assignedFrom;
	}

	public OffsetDateTime getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(OffsetDateTime assignedTo) {
		this.assignedTo = assignedTo;
	}

	public UserAccount getAssignedByUser() {
		return assignedByUser;
	}

	public void setAssignedByUser(UserAccount assignedByUser) {
		this.assignedByUser = assignedByUser;
	}

	public OffsetDateTime getReturnedAt() {
		return returnedAt;
	}

	public void setReturnedAt(OffsetDateTime returnedAt) {
		this.returnedAt = returnedAt;
	}

	public String getReturnNote() {
		return returnNote;
	}

	public void setReturnNote(String returnNote) {
		this.returnNote = returnNote;
	}

	public String getConditionOnAssign() {
		return conditionOnAssign;
	}

	public void setConditionOnAssign(String conditionOnAssign) {
		this.conditionOnAssign = conditionOnAssign;
	}

	public String getConditionOnReturn() {
		return conditionOnReturn;
	}

	public void setConditionOnReturn(String conditionOnReturn) {
		this.conditionOnReturn = conditionOnReturn;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
}
