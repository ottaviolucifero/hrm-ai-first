package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "currencies", uniqueConstraints = @UniqueConstraint(name = "uk_currencies_code", columnNames = "code"))
public class Currency extends BaseMasterEntity {

	@NotBlank
	@Size(max = 3)
	@Column(name = "code", nullable = false, length = 3)
	private String code;

	@NotBlank
	@Size(max = 100)
	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@Size(max = 10)
	@Column(name = "symbol", length = 10)
	private String symbol;

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

	public String getSymbol() {
		return symbol;
	}

	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}
}
