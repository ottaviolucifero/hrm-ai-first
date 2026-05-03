package com.odsoftware.hrm.entity.disciplinary;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.DisciplinaryActionType;
import com.odsoftware.hrm.entity.payroll.PayrollDocument;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "employee_disciplinary_actions")
public class EmployeeDisciplinaryAction {

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
	@JoinColumn(name = "disciplinary_action_type_id", nullable = false)
	private DisciplinaryActionType disciplinaryActionType;

	@NotNull
	@Column(name = "action_date", nullable = false)
	private LocalDate actionDate;

	@NotBlank
	@Size(max = 255)
	@Column(name = "title", nullable = false, length = 255)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@NotNull
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "issued_by_id", nullable = false)
	private UserAccount issuedBy;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "related_document_id")
	private PayrollDocument relatedDocument;

	@NotNull
	@Column(name = "active", nullable = false)
	private Boolean active = true;

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

	public DisciplinaryActionType getDisciplinaryActionType() {
		return disciplinaryActionType;
	}

	public void setDisciplinaryActionType(DisciplinaryActionType disciplinaryActionType) {
		this.disciplinaryActionType = disciplinaryActionType;
	}

	public LocalDate getActionDate() {
		return actionDate;
	}

	public void setActionDate(LocalDate actionDate) {
		this.actionDate = actionDate;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public UserAccount getIssuedBy() {
		return issuedBy;
	}

	public void setIssuedBy(UserAccount issuedBy) {
		this.issuedBy = issuedBy;
	}

	public PayrollDocument getRelatedDocument() {
		return relatedDocument;
	}

	public void setRelatedDocument(PayrollDocument relatedDocument) {
		this.relatedDocument = relatedDocument;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}
