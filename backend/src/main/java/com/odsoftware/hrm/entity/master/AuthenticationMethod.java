package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "authentication_methods", uniqueConstraints = @UniqueConstraint(name = "uk_authentication_methods_code", columnNames = "code"))
public class AuthenticationMethod extends BaseMasterEntity {

	@NotBlank
	@Size(max = 50)
	@Column(name = "code", nullable = false, length = 50)
	private String code;

	@NotBlank
	@Size(max = 100)
	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@NotNull
	@Column(name = "strong_auth_required", nullable = false)
	private Boolean strongAuthRequired = false;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getStrongAuthRequired() {
		return strongAuthRequired;
	}

	public void setStrongAuthRequired(Boolean strongAuthRequired) {
		this.strongAuthRequired = strongAuthRequired;
	}
}
