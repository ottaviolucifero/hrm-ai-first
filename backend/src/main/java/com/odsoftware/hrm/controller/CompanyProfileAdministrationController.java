package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileCreateRequest;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileDetailResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileListItemResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileUpdateRequest;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.service.CompanyProfileAdministrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/company-profiles")
@Tag(name = "Company Profile Administration", description = "Foundation API for company profile administration")
@Validated
public class CompanyProfileAdministrationController {

	private final CompanyProfileAdministrationService companyProfileAdministrationService;

	public CompanyProfileAdministrationController(CompanyProfileAdministrationService companyProfileAdministrationService) {
		this.companyProfileAdministrationService = companyProfileAdministrationService;
	}

	@GetMapping
	@Operation(summary = "List company profiles for administration")
	public MasterDataPageResponse<CompanyProfileAdministrationCompanyProfileListItemResponse> findCompanyProfiles(
			@RequestParam(required = false) UUID tenantId,
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return companyProfileAdministrationService.findCompanyProfiles(tenantId, page, size, search);
	}

	@GetMapping("/form-options")
	@Operation(summary = "Get company profile administration form options")
	public CompanyProfileAdministrationFormOptionsResponse findFormOptions() {
		return companyProfileAdministrationService.findFormOptions();
	}

	@GetMapping("/{companyProfileId}")
	@Operation(summary = "Get company profile administration detail")
	public CompanyProfileAdministrationCompanyProfileDetailResponse findCompanyProfileById(@PathVariable UUID companyProfileId) {
		return companyProfileAdministrationService.findCompanyProfileById(companyProfileId);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create company profile")
	public CompanyProfileAdministrationCompanyProfileDetailResponse createCompanyProfile(
			@Valid @RequestBody CompanyProfileAdministrationCompanyProfileCreateRequest request) {
		return companyProfileAdministrationService.createCompanyProfile(request);
	}

	@PutMapping("/{companyProfileId}")
	@Operation(summary = "Update company profile")
	public CompanyProfileAdministrationCompanyProfileDetailResponse updateCompanyProfile(
			@PathVariable UUID companyProfileId,
			@Valid @RequestBody CompanyProfileAdministrationCompanyProfileUpdateRequest request) {
		return companyProfileAdministrationService.updateCompanyProfile(companyProfileId, request);
	}

	@PutMapping("/{companyProfileId}/activate")
	@Operation(summary = "Activate company profile")
	public CompanyProfileAdministrationCompanyProfileDetailResponse activateCompanyProfile(@PathVariable UUID companyProfileId) {
		return companyProfileAdministrationService.activateCompanyProfile(companyProfileId);
	}

	@PutMapping("/{companyProfileId}/deactivate")
	@Operation(summary = "Deactivate company profile")
	public CompanyProfileAdministrationCompanyProfileDetailResponse deactivateCompanyProfile(@PathVariable UUID companyProfileId) {
		return companyProfileAdministrationService.deactivateCompanyProfile(companyProfileId);
	}

	@DeleteMapping("/{companyProfileId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Permanently delete company profile when it is not referenced")
	public void deleteCompanyProfile(@PathVariable UUID companyProfileId) {
		companyProfileAdministrationService.deleteCompanyProfile(companyProfileId);
	}
}
