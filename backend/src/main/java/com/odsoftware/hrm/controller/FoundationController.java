package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.foundation.CompanyProfileResponse;
import com.odsoftware.hrm.dto.foundation.OfficeLocationResponse;
import com.odsoftware.hrm.dto.foundation.SmtpConfigurationResponse;
import com.odsoftware.hrm.dto.foundation.TenantResponse;
import com.odsoftware.hrm.service.FoundationReadService;
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
@RequestMapping("/api/foundation")
@Tag(name = "Foundation", description = "Read-only tenant/company/office/SMTP foundation API")
@Validated
public class FoundationController {

	private final FoundationReadService foundationReadService;

	public FoundationController(FoundationReadService foundationReadService) {
		this.foundationReadService = foundationReadService;
	}

	@GetMapping("/tenants")
	@Operation(summary = "List tenants")
	public List<TenantResponse> findTenants() {
		return foundationReadService.findTenants();
	}

	@GetMapping("/tenants/{id}")
	@Operation(summary = "Get tenant by id")
	public TenantResponse findTenantById(@PathVariable UUID id) {
		return foundationReadService.findTenantById(id);
	}

	@GetMapping("/company-profiles")
	@Operation(summary = "List company profiles")
	public List<CompanyProfileResponse> findCompanyProfiles() {
		return foundationReadService.findCompanyProfiles();
	}

	@GetMapping("/offices")
	@Operation(summary = "List office locations")
	public List<OfficeLocationResponse> findOfficeLocations() {
		return foundationReadService.findOfficeLocations();
	}

	@GetMapping("/smtp-configurations")
	@Operation(summary = "List SMTP configurations without encrypted passwords")
	public List<SmtpConfigurationResponse> findSmtpConfigurations() {
		return foundationReadService.findSmtpConfigurations();
	}
}
