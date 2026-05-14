package com.odsoftware.hrm.controller;

import com.odsoftware.hrm.dto.masterdata.global.AreaRequest;
import com.odsoftware.hrm.dto.masterdata.global.AreaResponse;
import com.odsoftware.hrm.dto.masterdata.global.CountryRequest;
import com.odsoftware.hrm.dto.masterdata.global.CountryResponse;
import com.odsoftware.hrm.dto.masterdata.global.CurrencyRequest;
import com.odsoftware.hrm.dto.masterdata.global.CurrencyResponse;
import com.odsoftware.hrm.dto.masterdata.global.GenderRequest;
import com.odsoftware.hrm.dto.masterdata.global.GenderResponse;
import com.odsoftware.hrm.dto.masterdata.global.GlobalZipCodeRequest;
import com.odsoftware.hrm.dto.masterdata.global.GlobalZipCodeResponse;
import com.odsoftware.hrm.dto.masterdata.global.ItalianZipCodeImportReport;
import com.odsoftware.hrm.dto.masterdata.global.MaritalStatusRequest;
import com.odsoftware.hrm.dto.masterdata.global.MaritalStatusResponse;
import com.odsoftware.hrm.dto.masterdata.global.NationalIdentifierTypeRequest;
import com.odsoftware.hrm.dto.masterdata.global.NationalIdentifierTypeResponse;
import com.odsoftware.hrm.dto.masterdata.global.RegionRequest;
import com.odsoftware.hrm.dto.masterdata.global.RegionResponse;
import com.odsoftware.hrm.dto.lookup.LookupOptionResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.service.MasterDataGlobalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/master-data/global")
@Tag(name = "Master Data Global", description = "CRUD API for global master data")
@Validated
public class MasterDataGlobalController {

	private final MasterDataGlobalService masterDataGlobalService;

	public MasterDataGlobalController(MasterDataGlobalService masterDataGlobalService) {
		this.masterDataGlobalService = masterDataGlobalService;
	}

	@GetMapping("/countries")
	@Operation(summary = "List countries")
	public MasterDataPageResponse<CountryResponse> findCountries(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGlobalService.findCountries(page, size, search);
	}

	@GetMapping("/countries/lookup")
	@Operation(summary = "List countries for lookup")
	public MasterDataPageResponse<LookupOptionResponse> findCountryLookups(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGlobalService.findCountryLookups(page, size, search);
	}

	@GetMapping("/countries/{id}")
	@Operation(summary = "Get country by id")
	public CountryResponse findCountryById(@PathVariable UUID id) {
		return masterDataGlobalService.findCountryById(id);
	}

	@PostMapping("/countries")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create country")
	public CountryResponse createCountry(@Valid @RequestBody CountryRequest request) {
		return masterDataGlobalService.createCountry(request);
	}

	@PutMapping("/countries/{id}")
	@Operation(summary = "Update country")
	public CountryResponse updateCountry(@PathVariable UUID id, @Valid @RequestBody CountryRequest request) {
		return masterDataGlobalService.updateCountry(id, request);
	}

	@DeleteMapping("/countries/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable country")
	public void disableCountry(@PathVariable UUID id) {
		masterDataGlobalService.disableCountry(id);
	}

	@GetMapping("/regions")
	@Operation(summary = "List regions")
	public MasterDataPageResponse<RegionResponse> findRegions(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UUID tenantId) {
		return masterDataGlobalService.findRegions(page, size, search, tenantId);
	}

	@GetMapping("/regions/lookup")
	@Operation(summary = "List regions for lookup")
	public MasterDataPageResponse<LookupOptionResponse> findRegionLookups(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UUID tenantId) {
		return masterDataGlobalService.findRegionLookups(page, size, search, tenantId);
	}

	@GetMapping("/regions/{id}")
	@Operation(summary = "Get region by id")
	public RegionResponse findRegionById(@PathVariable UUID id) {
		return masterDataGlobalService.findRegionById(id);
	}

	@PostMapping("/regions")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create region")
	public RegionResponse createRegion(@Valid @RequestBody RegionRequest request) {
		return masterDataGlobalService.createRegion(request);
	}

	@PutMapping("/regions/{id}")
	@Operation(summary = "Update region")
	public RegionResponse updateRegion(@PathVariable UUID id, @Valid @RequestBody RegionRequest request) {
		return masterDataGlobalService.updateRegion(id, request);
	}

	@DeleteMapping("/regions/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable region")
	public void disableRegion(@PathVariable UUID id) {
		masterDataGlobalService.disableRegion(id);
	}

	@GetMapping("/areas")
	@Operation(summary = "List areas")
	public MasterDataPageResponse<AreaResponse> findAreas(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UUID tenantId) {
		return masterDataGlobalService.findAreas(page, size, search, tenantId);
	}

	@GetMapping("/areas/lookup")
	@Operation(summary = "List areas for lookup")
	public MasterDataPageResponse<LookupOptionResponse> findAreaLookups(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UUID tenantId) {
		return masterDataGlobalService.findAreaLookups(page, size, search, tenantId);
	}

	@GetMapping("/areas/{id}")
	@Operation(summary = "Get area by id")
	public AreaResponse findAreaById(@PathVariable UUID id) {
		return masterDataGlobalService.findAreaById(id);
	}

	@PostMapping("/areas")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create area")
	public AreaResponse createArea(@Valid @RequestBody AreaRequest request) {
		return masterDataGlobalService.createArea(request);
	}

	@PutMapping("/areas/{id}")
	@Operation(summary = "Update area")
	public AreaResponse updateArea(@PathVariable UUID id, @Valid @RequestBody AreaRequest request) {
		return masterDataGlobalService.updateArea(id, request);
	}

	@DeleteMapping("/areas/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable area")
	public void disableArea(@PathVariable UUID id) {
		masterDataGlobalService.disableArea(id);
	}

	@GetMapping("/zip-codes")
	@Operation(summary = "List global zip codes")
	public MasterDataPageResponse<GlobalZipCodeResponse> findGlobalZipCodes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UUID tenantId) {
		return masterDataGlobalService.findGlobalZipCodes(page, size, search, tenantId);
	}

	@GetMapping("/zip-codes/lookup")
	@Operation(summary = "List global zip codes for lookup")
	public MasterDataPageResponse<LookupOptionResponse> findGlobalZipCodeLookups(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search,
			@RequestParam(required = false) UUID tenantId,
			@RequestParam(required = false) UUID countryId,
			@RequestParam(required = false) UUID regionId,
			@RequestParam(required = false) UUID areaId) {
		return masterDataGlobalService.findGlobalZipCodeLookups(page, size, search, tenantId, countryId, regionId, areaId);
	}

	@GetMapping("/zip-codes/{id}")
	@Operation(summary = "Get global zip code by id")
	public GlobalZipCodeResponse findGlobalZipCodeById(@PathVariable UUID id) {
		return masterDataGlobalService.findGlobalZipCodeById(id);
	}

	@PostMapping("/zip-codes")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create global zip code")
	public GlobalZipCodeResponse createGlobalZipCode(@Valid @RequestBody GlobalZipCodeRequest request) {
		return masterDataGlobalService.createGlobalZipCode(request);
	}

	@PutMapping("/zip-codes/{id}")
	@Operation(summary = "Update global zip code")
	public GlobalZipCodeResponse updateGlobalZipCode(@PathVariable UUID id, @Valid @RequestBody GlobalZipCodeRequest request) {
		return masterDataGlobalService.updateGlobalZipCode(id, request);
	}

	@DeleteMapping("/zip-codes/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable global zip code")
	public void disableGlobalZipCode(@PathVariable UUID id) {
		masterDataGlobalService.disableGlobalZipCode(id);
	}

	@GetMapping("/zip-codes/import/italy")
	@Operation(summary = "Analyze italian zip code csv import")
	public ItalianZipCodeImportReport analyzeItalianZipCodeImport() {
		return masterDataGlobalService.analyzeItalianZipCodeImport();
	}

	@PostMapping("/zip-codes/import/italy")
	@Operation(summary = "Import italian zip code csv")
	public ItalianZipCodeImportReport importItalianZipCodes() {
		return masterDataGlobalService.importItalianZipCodes();
	}

	@GetMapping("/currencies")
	@Operation(summary = "List currencies")
	public MasterDataPageResponse<CurrencyResponse> findCurrencies(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGlobalService.findCurrencies(page, size, search);
	}

	@GetMapping("/currencies/{id}")
	@Operation(summary = "Get currency by id")
	public CurrencyResponse findCurrencyById(@PathVariable UUID id) {
		return masterDataGlobalService.findCurrencyById(id);
	}

	@PostMapping("/currencies")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create currency")
	public CurrencyResponse createCurrency(@Valid @RequestBody CurrencyRequest request) {
		return masterDataGlobalService.createCurrency(request);
	}

	@PutMapping("/currencies/{id}")
	@Operation(summary = "Update currency")
	public CurrencyResponse updateCurrency(@PathVariable UUID id, @Valid @RequestBody CurrencyRequest request) {
		return masterDataGlobalService.updateCurrency(id, request);
	}

	@DeleteMapping("/currencies/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable currency")
	public void disableCurrency(@PathVariable UUID id) {
		masterDataGlobalService.disableCurrency(id);
	}

	@GetMapping("/genders")
	@Operation(summary = "List genders")
	public MasterDataPageResponse<GenderResponse> findGenders(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGlobalService.findGenders(page, size, search);
	}

	@GetMapping("/genders/{id}")
	@Operation(summary = "Get gender by id")
	public GenderResponse findGenderById(@PathVariable UUID id) {
		return masterDataGlobalService.findGenderById(id);
	}

	@PostMapping("/genders")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create gender")
	public GenderResponse createGender(@Valid @RequestBody GenderRequest request) {
		return masterDataGlobalService.createGender(request);
	}

	@PutMapping("/genders/{id}")
	@Operation(summary = "Update gender")
	public GenderResponse updateGender(@PathVariable UUID id, @Valid @RequestBody GenderRequest request) {
		return masterDataGlobalService.updateGender(id, request);
	}

	@DeleteMapping("/genders/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable gender")
	public void disableGender(@PathVariable UUID id) {
		masterDataGlobalService.disableGender(id);
	}

	@GetMapping("/marital-statuses")
	@Operation(summary = "List marital statuses")
	public MasterDataPageResponse<MaritalStatusResponse> findMaritalStatuses(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGlobalService.findMaritalStatuses(page, size, search);
	}

	@GetMapping("/marital-statuses/{id}")
	@Operation(summary = "Get marital status by id")
	public MaritalStatusResponse findMaritalStatusById(@PathVariable UUID id) {
		return masterDataGlobalService.findMaritalStatusById(id);
	}

	@PostMapping("/marital-statuses")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create marital status")
	public MaritalStatusResponse createMaritalStatus(@Valid @RequestBody MaritalStatusRequest request) {
		return masterDataGlobalService.createMaritalStatus(request);
	}

	@PutMapping("/marital-statuses/{id}")
	@Operation(summary = "Update marital status")
	public MaritalStatusResponse updateMaritalStatus(@PathVariable UUID id, @Valid @RequestBody MaritalStatusRequest request) {
		return masterDataGlobalService.updateMaritalStatus(id, request);
	}

	@DeleteMapping("/marital-statuses/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable marital status")
	public void disableMaritalStatus(@PathVariable UUID id) {
		masterDataGlobalService.disableMaritalStatus(id);
	}

	@GetMapping("/national-identifier-types")
	@Operation(summary = "List national identifier types")
	public MasterDataPageResponse<NationalIdentifierTypeResponse> findNationalIdentifierTypes(
			@RequestParam(defaultValue = "0") Integer page,
			@RequestParam(defaultValue = "25") Integer size,
			@RequestParam(required = false) String search) {
		return masterDataGlobalService.findNationalIdentifierTypes(page, size, search);
	}

	@GetMapping("/national-identifier-types/{id}")
	@Operation(summary = "Get national identifier type by id")
	public NationalIdentifierTypeResponse findNationalIdentifierTypeById(@PathVariable UUID id) {
		return masterDataGlobalService.findNationalIdentifierTypeById(id);
	}

	@PostMapping("/national-identifier-types")
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Create national identifier type")
	public NationalIdentifierTypeResponse createNationalIdentifierType(@Valid @RequestBody NationalIdentifierTypeRequest request) {
		return masterDataGlobalService.createNationalIdentifierType(request);
	}

	@PutMapping("/national-identifier-types/{id}")
	@Operation(summary = "Update national identifier type")
	public NationalIdentifierTypeResponse updateNationalIdentifierType(@PathVariable UUID id, @Valid @RequestBody NationalIdentifierTypeRequest request) {
		return masterDataGlobalService.updateNationalIdentifierType(id, request);
	}

	@DeleteMapping("/national-identifier-types/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Disable national identifier type")
	public void disableNationalIdentifierType(@PathVariable UUID id) {
		masterDataGlobalService.disableNationalIdentifierType(id);
	}
}
