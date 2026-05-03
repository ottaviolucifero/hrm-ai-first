package com.odsoftware.hrm.dto.masterdata.global;

import com.odsoftware.hrm.entity.master.GlobalZipCodeSourceType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.UUID;

public record GlobalZipCodeRequest(
		@NotNull UUID countryId,
		UUID regionId,
		UUID areaId,
		@NotBlank @Size(max = 120) String city,
		@NotBlank @Size(max = 20) String postalCode,
		@Size(max = 20) String provinceCode,
		@Size(max = 120) String provinceName,
		@DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude,
		@DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude,
		@NotNull GlobalZipCodeSourceType sourceType,
		Boolean active) {
}
