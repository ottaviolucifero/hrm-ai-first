package com.odsoftware.hrm.entity.master;

import com.odsoftware.hrm.entity.common.BaseMasterEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "time_zones", uniqueConstraints = @UniqueConstraint(name = "uk_time_zones_code", columnNames = "code"))
public class TimeZone extends BaseMasterEntity {

	@NotBlank
	@Size(max = 100)
	@Column(name = "code", nullable = false, length = 100)
	private String code;

	@NotBlank
	@Size(max = 100)
	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@NotBlank
	@Size(max = 10)
	@Column(name = "utc_offset", nullable = false, length = 10)
	private String utcOffset;

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

	public String getUtcOffset() {
		return utcOffset;
	}

	public void setUtcOffset(String utcOffset) {
		this.utcOffset = utcOffset;
	}
}
