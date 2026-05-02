package com.odsoftware.hrm.entity.device;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.master.DeviceBrand;
import com.odsoftware.hrm.entity.master.DeviceStatus;
import com.odsoftware.hrm.entity.master.DeviceType;
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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "devices")
public class Device {

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

	@NotBlank
	@Size(max = 150)
	@Column(name = "name", nullable = false, length = 150)
	private String name;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "device_type_id", nullable = false)
	private DeviceType type;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "device_brand_id", nullable = false)
	private DeviceBrand brand;

	@Size(max = 100)
	@Column(name = "model", length = 100)
	private String model;

	@NotBlank
	@Size(max = 100)
	@Column(name = "serial_number", nullable = false, length = 100)
	private String serialNumber;

	@Column(name = "purchase_date")
	private LocalDate purchaseDate;

	@Column(name = "warranty_end_date")
	private LocalDate warrantyEndDate;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "device_status_id", nullable = false)
	private DeviceStatus deviceStatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assigned_to_employee_id")
	private Employee assignedTo;

	@Column(name = "assigned_at")
	private OffsetDateTime assignedAt;

	@NotNull
	@Column(name = "active", nullable = false)
	private Boolean active = true;

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@PrePersist
	void prePersist() {
		OffsetDateTime now = OffsetDateTime.now();
		this.createdAt = now;
		this.updatedAt = now;
		if (this.active == null) {
			this.active = true;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public DeviceType getType() {
		return type;
	}

	public void setType(DeviceType type) {
		this.type = type;
	}

	public DeviceBrand getBrand() {
		return brand;
	}

	public void setBrand(DeviceBrand brand) {
		this.brand = brand;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}

	public LocalDate getPurchaseDate() {
		return purchaseDate;
	}

	public void setPurchaseDate(LocalDate purchaseDate) {
		this.purchaseDate = purchaseDate;
	}

	public LocalDate getWarrantyEndDate() {
		return warrantyEndDate;
	}

	public void setWarrantyEndDate(LocalDate warrantyEndDate) {
		this.warrantyEndDate = warrantyEndDate;
	}

	public DeviceStatus getDeviceStatus() {
		return deviceStatus;
	}

	public void setDeviceStatus(DeviceStatus deviceStatus) {
		this.deviceStatus = deviceStatus;
	}

	public Employee getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(Employee assignedTo) {
		this.assignedTo = assignedTo;
	}

	public OffsetDateTime getAssignedAt() {
		return assignedAt;
	}

	public void setAssignedAt(OffsetDateTime assignedAt) {
		this.assignedAt = assignedAt;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
}
