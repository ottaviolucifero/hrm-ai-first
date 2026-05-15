package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.global.AreaRequest;
import com.odsoftware.hrm.dto.masterdata.global.AreaResponse;
import com.odsoftware.hrm.dto.masterdata.global.CountryRequest;
import com.odsoftware.hrm.dto.masterdata.global.CountryResponse;
import com.odsoftware.hrm.dto.masterdata.global.CurrencyRequest;
import com.odsoftware.hrm.dto.masterdata.global.CurrencyResponse;
import com.odsoftware.hrm.dto.masterdata.global.GenderRequest;
import com.odsoftware.hrm.dto.masterdata.global.GenderResponse;
import com.odsoftware.hrm.dto.masterdata.global.GlobalMasterReferenceResponse;
import com.odsoftware.hrm.dto.masterdata.global.GlobalZipCodeRequest;
import com.odsoftware.hrm.dto.masterdata.global.GlobalZipCodeResponse;
import com.odsoftware.hrm.dto.masterdata.global.ItalianZipCodeImportReport;
import com.odsoftware.hrm.dto.masterdata.global.MaritalStatusRequest;
import com.odsoftware.hrm.dto.masterdata.global.MaritalStatusResponse;
import com.odsoftware.hrm.dto.masterdata.global.NationalIdentifierTypeRequest;
import com.odsoftware.hrm.dto.masterdata.global.NationalIdentifierTypeResponse;
import com.odsoftware.hrm.dto.masterdata.global.RegionRequest;
import com.odsoftware.hrm.dto.masterdata.global.RegionResponse;
import com.odsoftware.hrm.entity.common.BaseTenantMasterEntity;
import com.odsoftware.hrm.dto.lookup.LookupOptionResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Currency;
import com.odsoftware.hrm.entity.master.Gender;
import com.odsoftware.hrm.entity.master.GlobalZipCode;
import com.odsoftware.hrm.entity.master.MaritalStatus;
import com.odsoftware.hrm.entity.master.NationalIdentifierType;
import com.odsoftware.hrm.entity.master.Region;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.AreaRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.GenderRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import com.odsoftware.hrm.repository.master.MaritalStatusRepository;
import com.odsoftware.hrm.repository.master.NationalIdentifierTypeRepository;
import com.odsoftware.hrm.repository.master.RegionRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MasterDataGlobalService {

	private final CountryRepository countryRepository;
	private final TenantRepository tenantRepository;
	private final RegionRepository regionRepository;
	private final AreaRepository areaRepository;
	private final GlobalZipCodeRepository globalZipCodeRepository;
	private final CurrencyRepository currencyRepository;
	private final GenderRepository genderRepository;
	private final MaritalStatusRepository maritalStatusRepository;
	private final NationalIdentifierTypeRepository nationalIdentifierTypeRepository;
	private final ItalianZipCodeImportService italianZipCodeImportService;

	public MasterDataGlobalService(
			CountryRepository countryRepository,
			TenantRepository tenantRepository,
			RegionRepository regionRepository,
			AreaRepository areaRepository,
			GlobalZipCodeRepository globalZipCodeRepository,
			CurrencyRepository currencyRepository,
			GenderRepository genderRepository,
			MaritalStatusRepository maritalStatusRepository,
			NationalIdentifierTypeRepository nationalIdentifierTypeRepository,
			ItalianZipCodeImportService italianZipCodeImportService) {
		this.countryRepository = countryRepository;
		this.tenantRepository = tenantRepository;
		this.regionRepository = regionRepository;
		this.areaRepository = areaRepository;
		this.globalZipCodeRepository = globalZipCodeRepository;
		this.currencyRepository = currencyRepository;
		this.genderRepository = genderRepository;
		this.maritalStatusRepository = maritalStatusRepository;
		this.nationalIdentifierTypeRepository = nationalIdentifierTypeRepository;
		this.italianZipCodeImportService = italianZipCodeImportService;
	}

	public MasterDataPageResponse<CountryResponse> findCountries(Integer page, Integer size, String search) {
		return findPage(
				countryRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("isoCode")),
				countrySearchSpecification(search),
				this::toCountryResponse);
	}

	public MasterDataPageResponse<LookupOptionResponse> findCountryLookups(Integer page, Integer size, String search) {
		return findPage(
				countryRepository,
				page,
				size,
				search,
				Sort.by("name").ascending().and(Sort.by("isoCode")),
				MasterDataQuerySupport.and(
						MasterDataQuerySupport.activeSpecification(),
						countrySearchSpecification(search)),
				this::toCountryLookupResponse);
	}

	public CountryResponse findCountryById(UUID id) {
		return toCountryResponse(findCountry(id));
	}

	@Transactional
	public CountryResponse createCountry(CountryRequest request) {
		String isoCode = cleanUpper(request.isoCode());
		if (countryRepository.existsByIsoCode(isoCode)) {
			throw new ResourceConflictException("Country isoCode already exists: " + isoCode);
		}
		Country country = new Country();
		applyCountry(country, request, isoCode);
		return toCountryResponse(countryRepository.save(country));
	}

	@Transactional
	public CountryResponse updateCountry(UUID id, CountryRequest request) {
		Country country = findCountry(id);
		String isoCode = cleanUpper(request.isoCode());
		if (countryRepository.existsByIsoCodeAndIdNot(isoCode, id)) {
			throw new ResourceConflictException("Country isoCode already exists: " + isoCode);
		}
		applyCountry(country, request, isoCode);
		return toCountryResponse(countryRepository.save(country));
	}

	@Transactional
	public void disableCountry(UUID id) {
		Country country = findCountry(id);
		country.setActive(false);
		countryRepository.save(country);
	}

	public MasterDataPageResponse<RegionResponse> findRegions(Integer page, Integer size, String search, UUID tenantId) {
		return findPage(
				regionRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				tenantScopedSpecification(
						tenantId,
						MasterDataQuerySupport.searchSpecification(search, "code", "name", "country.isoCode", "country.name")),
				this::toRegionResponse);
	}

	public MasterDataPageResponse<LookupOptionResponse> findRegionLookups(Integer page, Integer size, String search, UUID tenantId) {
		return findPage(
				regionRepository,
				page,
				size,
				search,
				Sort.by("name").ascending().and(Sort.by("code")),
				tenantScopedSpecification(
						tenantId,
						MasterDataQuerySupport.and(
								MasterDataQuerySupport.activeSpecification(),
								MasterDataQuerySupport.searchSpecification(search, "code", "name", "country.isoCode", "country.name"))),
				this::toRegionLookupResponse);
	}

	public RegionResponse findRegionById(UUID id) {
		return toRegionResponse(findRegion(id));
	}

	@Transactional
	public RegionResponse createRegion(RegionRequest request) {
		validateTenant(request.tenantId());
		Country country = findCountry(request.countryId());
		String code = generateNextTenantCode(request.tenantId(), "RE", regionRepository, "Region");
		Region region = new Region();
		applyRegion(region, request, country, code);
		try {
			return toRegionResponse(regionRepository.save(region));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException("Region code generation collision for tenant. Retry create operation.");
		}
	}

	@Transactional
	public RegionResponse updateRegion(UUID id, RegionRequest request) {
		Region region = findRegion(id);
		validateTenant(request.tenantId());
		Country country = findCountry(request.countryId());
		String code = cleanUpper(region.getCode());
		if (regionRepository.existsByTenantIdAndCountry_IdAndCodeAndIdNot(request.tenantId(), country.getId(), code, id)) {
			throw new ResourceConflictException("Region code already exists for country: " + code);
		}
		applyRegion(region, request, country, code);
		return toRegionResponse(regionRepository.save(region));
	}

	@Transactional
	public void disableRegion(UUID id) {
		Region region = findRegion(id);
		region.setActive(false);
		regionRepository.save(region);
	}

	public MasterDataPageResponse<AreaResponse> findAreas(Integer page, Integer size, String search, UUID tenantId) {
		return findPage(
				areaRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				tenantScopedSpecification(
						tenantId,
						MasterDataQuerySupport.searchSpecification(search, "code", "name", "country.isoCode", "country.name", "region.code", "region.name")),
				this::toAreaResponse);
	}

	public MasterDataPageResponse<LookupOptionResponse> findAreaLookups(Integer page, Integer size, String search, UUID tenantId) {
		return findPage(
				areaRepository,
				page,
				size,
				search,
				Sort.by("name").ascending().and(Sort.by("code")),
				tenantScopedSpecification(
						tenantId,
						MasterDataQuerySupport.and(
								MasterDataQuerySupport.activeSpecification(),
								MasterDataQuerySupport.searchSpecification(search, "code", "name", "country.isoCode", "country.name", "region.code", "region.name"))),
				this::toAreaLookupResponse);
	}

	public AreaResponse findAreaById(UUID id) {
		return toAreaResponse(findArea(id));
	}

	@Transactional
	public AreaResponse createArea(AreaRequest request) {
		validateTenant(request.tenantId());
		Country country = findCountry(request.countryId());
		Region region = findRegion(request.regionId());
		validateRegionCountry(region, country);
		validateRegionTenant(region, request.tenantId());
		String code = generateNextTenantCode(request.tenantId(), "AR", areaRepository, "Area");
		Area area = new Area();
		applyArea(area, request, country, region, code);
		try {
			return toAreaResponse(areaRepository.save(area));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException("Area code generation collision for tenant. Retry create operation.");
		}
	}

	@Transactional
	public AreaResponse updateArea(UUID id, AreaRequest request) {
		Area area = findArea(id);
		validateTenant(request.tenantId());
		Country country = findCountry(request.countryId());
		Region region = findRegion(request.regionId());
		validateRegionCountry(region, country);
		validateRegionTenant(region, request.tenantId());
		String code = cleanUpper(area.getCode());
		if (areaRepository.existsByTenantIdAndRegion_IdAndCodeAndIdNot(request.tenantId(), region.getId(), code, id)) {
			throw new ResourceConflictException("Area code already exists for region: " + code);
		}
		applyArea(area, request, country, region, code);
		return toAreaResponse(areaRepository.save(area));
	}

	@Transactional
	public void disableArea(UUID id) {
		Area area = findArea(id);
		area.setActive(false);
		areaRepository.save(area);
	}

	public MasterDataPageResponse<GlobalZipCodeResponse> findGlobalZipCodes(Integer page, Integer size, String search, UUID tenantId) {
		return findPage(
				globalZipCodeRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("postalCode").ascending().and(Sort.by("city"))),
				zipCodeSpecification(
						tenantId,
						MasterDataQuerySupport.searchSpecification(
								search,
								"postalCode",
								"city",
								"provinceCode",
								"provinceName",
								"country.isoCode",
								"country.name",
								"region.code",
								"region.name",
								"area.code",
								"area.name")),
				this::toGlobalZipCodeResponse);
	}

	public MasterDataPageResponse<LookupOptionResponse> findGlobalZipCodeLookups(
			Integer page,
			Integer size,
			String search,
			UUID tenantId,
			UUID countryId,
			UUID regionId,
			UUID areaId) {
		return findPage(
				globalZipCodeRepository,
				page,
				size,
				search,
				Sort.by("postalCode").ascending().and(Sort.by("city")),
				zipCodeLookupSpecification(
						tenantId,
						countryId,
						regionId,
						areaId,
						MasterDataQuerySupport.and(
								MasterDataQuerySupport.activeSpecification(),
								MasterDataQuerySupport.searchSpecification(
										search,
										"postalCode",
										"city",
										"provinceCode",
										"provinceName",
										"country.isoCode",
										"country.name",
										"region.code",
										"region.name",
										"area.code",
										"area.name"))),
				this::toGlobalZipCodeLookupResponse);
	}

	public GlobalZipCodeResponse findGlobalZipCodeById(UUID id) {
		return toGlobalZipCodeResponse(findGlobalZipCode(id));
	}

	@Transactional
	public GlobalZipCodeResponse createGlobalZipCode(GlobalZipCodeRequest request) {
		ZipCodeRelations relations = resolveZipCodeRelations(request);
		String postalCode = cleanUpper(request.postalCode());
		String city = clean(request.city());
		if (globalZipCodeExists(relations.tenantId(), relations.country().getId(), postalCode, city, null)) {
			throw new ResourceConflictException("Zip code already exists for country/postalCode/city");
		}
		GlobalZipCode globalZipCode = new GlobalZipCode();
		applyGlobalZipCode(globalZipCode, request, relations, postalCode, city);
		return toGlobalZipCodeResponse(globalZipCodeRepository.save(globalZipCode));
	}

	@Transactional
	public GlobalZipCodeResponse updateGlobalZipCode(UUID id, GlobalZipCodeRequest request) {
		GlobalZipCode globalZipCode = findGlobalZipCode(id);
		ZipCodeRelations relations = resolveZipCodeRelations(request);
		String postalCode = cleanUpper(request.postalCode());
		String city = clean(request.city());
		if (globalZipCodeExists(relations.tenantId(), relations.country().getId(), postalCode, city, id)) {
			throw new ResourceConflictException("Zip code already exists for country/postalCode/city");
		}
		applyGlobalZipCode(globalZipCode, request, relations, postalCode, city);
		return toGlobalZipCodeResponse(globalZipCodeRepository.save(globalZipCode));
	}

	@Transactional
	public void disableGlobalZipCode(UUID id) {
		GlobalZipCode globalZipCode = findGlobalZipCode(id);
		globalZipCode.setActive(false);
		globalZipCodeRepository.save(globalZipCode);
	}

	public ItalianZipCodeImportReport analyzeItalianZipCodeImport() {
		return italianZipCodeImportService.analyzeDefaultCsv();
	}

	@Transactional
	public ItalianZipCodeImportReport importItalianZipCodes() {
		return italianZipCodeImportService.importDefaultCsv();
	}

	public MasterDataPageResponse<CurrencyResponse> findCurrencies(Integer page, Integer size, String search) {
		return findPage(
				currencyRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				MasterDataQuerySupport.searchSpecification(search, "code", "name", "symbol"),
				this::toCurrencyResponse);
	}

	public CurrencyResponse findCurrencyById(UUID id) {
		return toCurrencyResponse(findCurrency(id));
	}

	@Transactional
	public CurrencyResponse createCurrency(CurrencyRequest request) {
		String code = cleanUpper(request.code());
		if (currencyRepository.existsByCode(code)) {
			throw new ResourceConflictException("Currency code already exists: " + code);
		}
		Currency currency = new Currency();
		applyCurrency(currency, request, code);
		return toCurrencyResponse(currencyRepository.save(currency));
	}

	@Transactional
	public CurrencyResponse updateCurrency(UUID id, CurrencyRequest request) {
		Currency currency = findCurrency(id);
		String code = cleanUpper(request.code());
		if (currencyRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("Currency code already exists: " + code);
		}
		applyCurrency(currency, request, code);
		return toCurrencyResponse(currencyRepository.save(currency));
	}

	@Transactional
	public void disableCurrency(UUID id) {
		Currency currency = findCurrency(id);
		currency.setActive(false);
		currencyRepository.save(currency);
	}

	public MasterDataPageResponse<GenderResponse> findGenders(Integer page, Integer size, String search) {
		return findPage(
				genderRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toGenderResponse);
	}

	public GenderResponse findGenderById(UUID id) {
		return toGenderResponse(findGender(id));
	}

	@Transactional
	public GenderResponse createGender(GenderRequest request) {
		String code = cleanUpper(request.code());
		if (genderRepository.existsByCode(code)) {
			throw new ResourceConflictException("Gender code already exists: " + code);
		}
		Gender gender = new Gender();
		applyGender(gender, request, code);
		return toGenderResponse(genderRepository.save(gender));
	}

	@Transactional
	public GenderResponse updateGender(UUID id, GenderRequest request) {
		Gender gender = findGender(id);
		String code = cleanUpper(request.code());
		if (genderRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("Gender code already exists: " + code);
		}
		applyGender(gender, request, code);
		return toGenderResponse(genderRepository.save(gender));
	}

	@Transactional
	public void disableGender(UUID id) {
		Gender gender = findGender(id);
		gender.setActive(false);
		genderRepository.save(gender);
	}

	public MasterDataPageResponse<MaritalStatusResponse> findMaritalStatuses(Integer page, Integer size, String search) {
		return findPage(
				maritalStatusRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				MasterDataQuerySupport.searchSpecification(search, "code", "name"),
				this::toMaritalStatusResponse);
	}

	public MaritalStatusResponse findMaritalStatusById(UUID id) {
		return toMaritalStatusResponse(findMaritalStatus(id));
	}

	@Transactional
	public MaritalStatusResponse createMaritalStatus(MaritalStatusRequest request) {
		String code = cleanUpper(request.code());
		if (maritalStatusRepository.existsByCode(code)) {
			throw new ResourceConflictException("Marital status code already exists: " + code);
		}
		MaritalStatus maritalStatus = new MaritalStatus();
		applyMaritalStatus(maritalStatus, request, code);
		return toMaritalStatusResponse(maritalStatusRepository.save(maritalStatus));
	}

	@Transactional
	public MaritalStatusResponse updateMaritalStatus(UUID id, MaritalStatusRequest request) {
		MaritalStatus maritalStatus = findMaritalStatus(id);
		String code = cleanUpper(request.code());
		if (maritalStatusRepository.existsByCodeAndIdNot(code, id)) {
			throw new ResourceConflictException("Marital status code already exists: " + code);
		}
		applyMaritalStatus(maritalStatus, request, code);
		return toMaritalStatusResponse(maritalStatusRepository.save(maritalStatus));
	}

	@Transactional
	public void disableMaritalStatus(UUID id) {
		MaritalStatus maritalStatus = findMaritalStatus(id);
		maritalStatus.setActive(false);
		maritalStatusRepository.save(maritalStatus);
	}

	public MasterDataPageResponse<NationalIdentifierTypeResponse> findNationalIdentifierTypes(Integer page, Integer size, String search) {
		return findPage(
				nationalIdentifierTypeRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				MasterDataQuerySupport.searchSpecification(search, "code", "name", "regexPattern", "country.isoCode", "country.name"),
				this::toNationalIdentifierTypeResponse);
	}

	public NationalIdentifierTypeResponse findNationalIdentifierTypeById(UUID id) {
		return toNationalIdentifierTypeResponse(findNationalIdentifierType(id));
	}

	@Transactional
	public NationalIdentifierTypeResponse createNationalIdentifierType(NationalIdentifierTypeRequest request) {
		Country country = findCountry(request.countryId());
		String code = cleanUpper(request.code());
		if (nationalIdentifierTypeRepository.existsByCountry_IdAndCode(country.getId(), code)) {
			throw new ResourceConflictException("National identifier type code already exists for country: " + code);
		}
		NationalIdentifierType nationalIdentifierType = new NationalIdentifierType();
		applyNationalIdentifierType(nationalIdentifierType, request, country, code);
		return toNationalIdentifierTypeResponse(nationalIdentifierTypeRepository.save(nationalIdentifierType));
	}

	@Transactional
	public NationalIdentifierTypeResponse updateNationalIdentifierType(UUID id, NationalIdentifierTypeRequest request) {
		NationalIdentifierType nationalIdentifierType = findNationalIdentifierType(id);
		Country country = findCountry(request.countryId());
		String code = cleanUpper(request.code());
		if (nationalIdentifierTypeRepository.existsByCountry_IdAndCodeAndIdNot(country.getId(), code, id)) {
			throw new ResourceConflictException("National identifier type code already exists for country: " + code);
		}
		applyNationalIdentifierType(nationalIdentifierType, request, country, code);
		return toNationalIdentifierTypeResponse(nationalIdentifierTypeRepository.save(nationalIdentifierType));
	}

	@Transactional
	public void disableNationalIdentifierType(UUID id) {
		NationalIdentifierType nationalIdentifierType = findNationalIdentifierType(id);
		nationalIdentifierType.setActive(false);
		nationalIdentifierTypeRepository.save(nationalIdentifierType);
	}

	private void applyCountry(Country country, CountryRequest request, String isoCode) {
		country.setName(clean(request.name()));
		country.setIsoCode(isoCode);
		country.setPhoneCode(clean(request.phoneCode()));
		country.setDefaultCurrency(request.defaultCurrencyId() == null ? null : findCurrency(request.defaultCurrencyId()));
		country.setActive(activeOrDefault(request.active()));
	}

	private void applyRegion(Region region, RegionRequest request, Country country, String code) {
		region.setTenantId(request.tenantId());
		region.setCountry(country);
		region.setName(clean(request.name()));
		region.setCode(code);
		region.setActive(activeOrDefault(request.active()));
	}

	private void applyArea(Area area, AreaRequest request, Country country, Region region, String code) {
		area.setTenantId(request.tenantId());
		area.setCountry(country);
		area.setRegion(region);
		area.setName(clean(request.name()));
		area.setCode(code);
		area.setActive(activeOrDefault(request.active()));
	}

	private void applyGlobalZipCode(GlobalZipCode globalZipCode, GlobalZipCodeRequest request, ZipCodeRelations relations, String postalCode, String city) {
		globalZipCode.setTenantId(relations.tenantId());
		globalZipCode.setTenantScopeKey(resolveTenantScopeKey(relations.tenantId()));
		globalZipCode.setCountry(relations.country());
		globalZipCode.setRegion(relations.region());
		globalZipCode.setArea(relations.area());
		globalZipCode.setCity(city);
		globalZipCode.setPostalCode(postalCode);
		globalZipCode.setProvinceCode(cleanUpper(request.provinceCode()));
		globalZipCode.setProvinceName(clean(request.provinceName()));
		globalZipCode.setLatitude(request.latitude());
		globalZipCode.setLongitude(request.longitude());
		globalZipCode.setSourceType(request.sourceType());
		globalZipCode.setActive(activeOrDefault(request.active()));
	}

	private void applyCurrency(Currency currency, CurrencyRequest request, String code) {
		currency.setCode(code);
		currency.setName(clean(request.name()));
		currency.setSymbol(clean(request.symbol()));
		currency.setActive(activeOrDefault(request.active()));
	}

	private void applyGender(Gender gender, GenderRequest request, String code) {
		gender.setCode(code);
		gender.setName(clean(request.name()));
		gender.setActive(activeOrDefault(request.active()));
	}

	private void applyMaritalStatus(MaritalStatus maritalStatus, MaritalStatusRequest request, String code) {
		maritalStatus.setCode(code);
		maritalStatus.setName(clean(request.name()));
		maritalStatus.setActive(activeOrDefault(request.active()));
	}

	private void applyNationalIdentifierType(NationalIdentifierType nationalIdentifierType, NationalIdentifierTypeRequest request, Country country, String code) {
		nationalIdentifierType.setCountry(country);
		nationalIdentifierType.setCode(code);
		nationalIdentifierType.setName(clean(request.name()));
		nationalIdentifierType.setRegexPattern(clean(request.regexPattern()));
		nationalIdentifierType.setActive(activeOrDefault(request.active()));
	}

	private ZipCodeRelations resolveZipCodeRelations(GlobalZipCodeRequest request) {
		Country country = findCountry(request.countryId());
		UUID tenantId = request.tenantId();
		if (isItaly(country)) {
			if (tenantId != null) {
				throw new InvalidRequestException("Italian zip codes must remain global");
			}
		} else if (tenantId == null) {
			throw new InvalidRequestException("tenantId is required for non-Italian zip codes");
		}
		if (tenantId != null) {
			validateTenant(tenantId);
		}
		Region region = request.regionId() == null ? null : findRegion(request.regionId());
		Area area = request.areaId() == null ? null : findArea(request.areaId());
		if (!isItaly(country) && region == null) {
			throw new InvalidRequestException("regionId is required for non-Italian zip codes");
		}
		if (!isItaly(country) && area == null && clean(request.provinceName()) == null && clean(request.provinceCode()) == null) {
			throw new InvalidRequestException("provinceName or provinceCode is required when areaId is not provided");
		}
		if (region != null) {
			validateRegionCountry(region, country);
			validateRegionTenant(region, tenantId);
		}
		if (area != null) {
			if (region == null) {
				throw new InvalidRequestException("areaId requires regionId");
			}
			validateAreaRelations(area, country, region);
			validateAreaTenant(area, tenantId);
		}
		return new ZipCodeRelations(tenantId, country, region, area);
	}

	private void validateRegionCountry(Region region, Country country) {
		if (!region.getCountry().getId().equals(country.getId())) {
			throw new InvalidRequestException("Region does not belong to the selected country");
		}
	}

	private void validateRegionTenant(Region region, UUID tenantId) {
		if (!Objects.equals(region.getTenantId(), tenantId)) {
			throw new InvalidRequestException("Region does not belong to the selected tenant");
		}
	}

	private void validateAreaRelations(Area area, Country country, Region region) {
		if (!area.getCountry().getId().equals(country.getId())) {
			throw new InvalidRequestException("Area does not belong to the selected country");
		}
		if (!area.getRegion().getId().equals(region.getId())) {
			throw new InvalidRequestException("Area does not belong to the selected region");
		}
	}

	private void validateAreaTenant(Area area, UUID tenantId) {
		if (!Objects.equals(area.getTenantId(), tenantId)) {
			throw new InvalidRequestException("Area does not belong to the selected tenant");
		}
	}

	private void validateTenant(UUID tenantId) {
		if (!tenantRepository.existsById(tenantId)) {
			throw new ResourceNotFoundException("Tenant not found: " + tenantId);
		}
	}

	private Country findCountry(UUID id) {
		return countryRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Country not found: " + id));
	}

	private Region findRegion(UUID id) {
		return regionRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Region not found: " + id));
	}

	private Area findArea(UUID id) {
		return areaRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Area not found: " + id));
	}

	private GlobalZipCode findGlobalZipCode(UUID id) {
		return globalZipCodeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Global zip code not found: " + id));
	}

	private Currency findCurrency(UUID id) {
		return currencyRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Currency not found: " + id));
	}

	private Gender findGender(UUID id) {
		return genderRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Gender not found: " + id));
	}

	private MaritalStatus findMaritalStatus(UUID id) {
		return maritalStatusRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Marital status not found: " + id));
	}

	private NationalIdentifierType findNationalIdentifierType(UUID id) {
		return nationalIdentifierTypeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("National identifier type not found: " + id));
	}

	private CountryResponse toCountryResponse(Country country) {
		return new CountryResponse(
				country.getId(),
				country.getName(),
				country.getIsoCode(),
				country.getPhoneCode(),
				toCurrencyReference(country.getDefaultCurrency()),
				country.getActive(),
				country.getCreatedAt(),
				country.getUpdatedAt());
	}

	private LookupOptionResponse toCountryLookupResponse(Country country) {
		String phoneCode = clean(country.getPhoneCode());
		return new LookupOptionResponse(
				country.getId(),
				country.getIsoCode(),
				country.getName(),
				phoneCode,
				lookupMetadata(
						"isoCode", country.getIsoCode(),
						"phoneCode", phoneCode));
	}

	private RegionResponse toRegionResponse(Region region) {
		return new RegionResponse(
				region.getId(),
				region.getTenantId(),
				toCountryReference(region.getCountry()),
				region.getName(),
				region.getCode(),
				region.getActive(),
				region.getCreatedAt(),
				region.getUpdatedAt());
	}

	private LookupOptionResponse toRegionLookupResponse(Region region) {
		return new LookupOptionResponse(
				region.getId(),
				region.getCode(),
				region.getName(),
				region.getCountry().getName(),
				lookupMetadata(
						"tenantId", region.getTenantId() == null ? null : region.getTenantId().toString(),
						"countryId", region.getCountry().getId().toString(),
						"countryCode", region.getCountry().getIsoCode(),
						"countryName", region.getCountry().getName()));
	}

	private AreaResponse toAreaResponse(Area area) {
		return new AreaResponse(
				area.getId(),
				area.getTenantId(),
				toCountryReference(area.getCountry()),
				toRegionReference(area.getRegion()),
				area.getName(),
				area.getCode(),
				area.getActive(),
				area.getCreatedAt(),
				area.getUpdatedAt());
	}

	private LookupOptionResponse toAreaLookupResponse(Area area) {
		return new LookupOptionResponse(
				area.getId(),
				area.getCode(),
				area.getName(),
				area.getRegion().getName(),
				lookupMetadata(
						"tenantId", area.getTenantId() == null ? null : area.getTenantId().toString(),
						"countryId", area.getCountry().getId().toString(),
						"countryCode", area.getCountry().getIsoCode(),
						"regionId", area.getRegion().getId().toString(),
						"regionCode", area.getRegion().getCode(),
						"regionName", area.getRegion().getName()));
	}

	private GlobalZipCodeResponse toGlobalZipCodeResponse(GlobalZipCode globalZipCode) {
		return new GlobalZipCodeResponse(
				globalZipCode.getId(),
				globalZipCode.getTenantId(),
				toCountryReference(globalZipCode.getCountry()),
				toRegionReference(globalZipCode.getRegion()),
				toAreaReference(globalZipCode.getArea()),
				globalZipCode.getCity(),
				globalZipCode.getPostalCode(),
				globalZipCode.getProvinceCode(),
				globalZipCode.getProvinceName(),
				globalZipCode.getLatitude(),
				globalZipCode.getLongitude(),
				globalZipCode.getSourceType(),
				globalZipCode.getActive(),
				globalZipCode.getCreatedAt(),
				globalZipCode.getUpdatedAt());
	}

	private LookupOptionResponse toGlobalZipCodeLookupResponse(GlobalZipCode globalZipCode) {
		String provinceLabel = provinceLabel(globalZipCode);
		return new LookupOptionResponse(
				globalZipCode.getId(),
				globalZipCode.getPostalCode(),
				globalZipCode.getCity(),
				provinceLabel,
				lookupMetadata(
						"tenantId", globalZipCode.getTenantId() == null ? null : globalZipCode.getTenantId().toString(),
						"countryId", globalZipCode.getCountry().getId().toString(),
						"countryCode", globalZipCode.getCountry().getIsoCode(),
						"countryName", globalZipCode.getCountry().getName(),
						"regionId", globalZipCode.getRegion() == null ? null : globalZipCode.getRegion().getId().toString(),
						"regionCode", globalZipCode.getRegion() == null ? null : globalZipCode.getRegion().getCode(),
						"regionName", globalZipCode.getRegion() == null ? null : globalZipCode.getRegion().getName(),
						"areaId", globalZipCode.getArea() == null ? null : globalZipCode.getArea().getId().toString(),
						"areaCode", globalZipCode.getArea() == null ? null : globalZipCode.getArea().getCode(),
						"areaName", globalZipCode.getArea() == null ? null : globalZipCode.getArea().getName(),
						"provinceCode", globalZipCode.getProvinceCode(),
						"provinceName", globalZipCode.getProvinceName()));
	}

	private CurrencyResponse toCurrencyResponse(Currency currency) {
		return new CurrencyResponse(
				currency.getId(),
				currency.getCode(),
				currency.getName(),
				currency.getSymbol(),
				currency.getActive(),
				currency.getCreatedAt(),
				currency.getUpdatedAt());
	}

	private GenderResponse toGenderResponse(Gender gender) {
		return new GenderResponse(
				gender.getId(),
				gender.getCode(),
				gender.getName(),
				gender.getActive(),
				gender.getCreatedAt(),
				gender.getUpdatedAt());
	}

	private MaritalStatusResponse toMaritalStatusResponse(MaritalStatus maritalStatus) {
		return new MaritalStatusResponse(
				maritalStatus.getId(),
				maritalStatus.getCode(),
				maritalStatus.getName(),
				maritalStatus.getActive(),
				maritalStatus.getCreatedAt(),
				maritalStatus.getUpdatedAt());
	}

	private NationalIdentifierTypeResponse toNationalIdentifierTypeResponse(NationalIdentifierType nationalIdentifierType) {
		return new NationalIdentifierTypeResponse(
				nationalIdentifierType.getId(),
				toCountryReference(nationalIdentifierType.getCountry()),
				nationalIdentifierType.getCode(),
				nationalIdentifierType.getName(),
				nationalIdentifierType.getRegexPattern(),
				nationalIdentifierType.getActive(),
				nationalIdentifierType.getCreatedAt(),
				nationalIdentifierType.getUpdatedAt());
	}

	private GlobalMasterReferenceResponse toCurrencyReference(Currency currency) {
		return currency == null ? null : toReference(currency.getId(), currency.getCode(), currency.getName());
	}

	private GlobalMasterReferenceResponse toCountryReference(Country country) {
		return toReference(country.getId(), country.getIsoCode(), country.getName());
	}

	private GlobalMasterReferenceResponse toRegionReference(Region region) {
		return region == null ? null : toReference(region.getId(), region.getCode(), region.getName());
	}

	private GlobalMasterReferenceResponse toAreaReference(Area area) {
		return area == null ? null : toReference(area.getId(), area.getCode(), area.getName());
	}

	private GlobalMasterReferenceResponse toReference(UUID id, String code, String name) {
		return new GlobalMasterReferenceResponse(id, code, name);
	}

	private boolean globalZipCodeExists(UUID tenantId, UUID countryId, String postalCode, String city, UUID id) {
		if (tenantId == null) {
			return id == null
					? globalZipCodeRepository.existsByTenantIdIsNullAndCountry_IdAndPostalCodeAndCity(countryId, postalCode, city)
					: globalZipCodeRepository.existsByTenantIdIsNullAndCountry_IdAndPostalCodeAndCityAndIdNot(countryId, postalCode, city, id);
		}
		return id == null
				? globalZipCodeRepository.existsByTenantIdAndCountry_IdAndPostalCodeAndCity(tenantId, countryId, postalCode, city)
				: globalZipCodeRepository.existsByTenantIdAndCountry_IdAndPostalCodeAndCityAndIdNot(tenantId, countryId, postalCode, city, id);
	}

	private <T extends BaseTenantMasterEntity> String generateNextTenantCode(
			UUID tenantId,
			String codePrefix,
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			String label) {
		List<T> tenantEntities = repository.findAll(
				(root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("tenantId"), tenantId),
				Sort.by(Sort.Order.desc("code")));
		return nextProgressiveCode(codePrefix, tenantEntities, BaseTenantMasterEntity::getCode, label);
	}

	private <T> String nextProgressiveCode(
			String codePrefix,
			List<T> entities,
			Function<T, String> codeExtractor,
			String label) {
		int maxProgressive = 0;
		for (T entity : entities) {
			int parsedProgressive = parseProgressiveCode(codeExtractor.apply(entity), codePrefix);
			if (parsedProgressive > maxProgressive) {
				maxProgressive = parsedProgressive;
			}
		}

		if (maxProgressive >= 999) {
			throw new ResourceConflictException(label + " code progressive exhausted for tenant");
		}

		return codePrefix + String.format(Locale.ROOT, "%03d", maxProgressive + 1);
	}

	private int parseProgressiveCode(String code, String prefix) {
		String normalizedCode = cleanUpper(code);
		if (normalizedCode == null || !normalizedCode.startsWith(prefix)) {
			return -1;
		}
		if (normalizedCode.length() != prefix.length() + 3) {
			return -1;
		}
		String progressive = normalizedCode.substring(prefix.length());
		for (int index = 0; index < progressive.length(); index++) {
			if (!Character.isDigit(progressive.charAt(index))) {
				return -1;
			}
		}
		return Integer.parseInt(progressive);
	}

	private <T> Specification<T> tenantScopedSpecification(UUID tenantId, Specification<T> searchSpecification) {
		if (tenantId == null) {
			return searchSpecification;
		}
		Specification<T> tenantSpecification =
				(root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("tenantId"), tenantId);
		return searchSpecification == null ? tenantSpecification : tenantSpecification.and(searchSpecification);
	}

	private Specification<GlobalZipCode> zipCodeSpecification(UUID tenantId, Specification<GlobalZipCode> searchSpecification) {
		if (tenantId == null) {
			return searchSpecification;
		}
		Specification<GlobalZipCode> tenantSpecification = (root, query, criteriaBuilder) -> criteriaBuilder.or(
				criteriaBuilder.isNull(root.get("tenantId")),
				criteriaBuilder.equal(root.get("tenantId"), tenantId));
		return searchSpecification == null ? tenantSpecification : tenantSpecification.and(searchSpecification);
	}

	private Specification<GlobalZipCode> zipCodeLookupSpecification(
			UUID tenantId,
			UUID countryId,
			UUID regionId,
			UUID areaId,
			Specification<GlobalZipCode> searchSpecification) {
		Specification<GlobalZipCode> specification = zipCodeSpecification(tenantId, searchSpecification);
		Specification<GlobalZipCode> filterSpecification = (root, query, criteriaBuilder) -> {
			query.distinct(true);
			var predicate = criteriaBuilder.conjunction();
			if (countryId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("country").get("id"), countryId));
			}
			if (regionId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(
						criteriaBuilder.isNull(root.get("region")),
						criteriaBuilder.equal(root.get("region").get("id"), regionId)));
			}
			if (areaId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.or(
						criteriaBuilder.isNull(root.get("area")),
						criteriaBuilder.equal(root.get("area").get("id"), areaId)));
			}
			return predicate;
		};
		return specification == null ? filterSpecification : specification.and(filterSpecification);
	}

	private boolean isItaly(Country country) {
		return "IT".equalsIgnoreCase(country.getIsoCode());
	}

	private UUID resolveTenantScopeKey(UUID tenantId) {
		return tenantId == null
				? UUID.fromString("00000000-0000-0000-0000-000000000000")
				: tenantId;
	}

	private String provinceLabel(GlobalZipCode globalZipCode) {
		String provinceName = clean(globalZipCode.getProvinceName());
		String provinceCode = clean(globalZipCode.getProvinceCode());
		if (provinceName != null && provinceCode != null) {
			return provinceName + " (" + provinceCode + ")";
		}
		if (provinceName != null) {
			return provinceName;
		}
		if (provinceCode != null) {
			return provinceCode;
		}
		return globalZipCode.getArea() == null ? null : globalZipCode.getArea().getName();
	}

	private Boolean activeOrDefault(Boolean active) {
		return active == null ? Boolean.TRUE : active;
	}

	private String cleanUpper(String value) {
		String cleaned = clean(value);
		return cleaned == null ? null : cleaned.toUpperCase(Locale.ROOT);
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}

	private Map<String, String> lookupMetadata(String... entries) {
		Map<String, String> metadata = new LinkedHashMap<>();
		for (int index = 0; index < entries.length; index += 2) {
			String value = entries[index + 1];
			if (value != null && !value.isBlank()) {
				metadata.put(entries[index], value);
			}
		}
		return metadata;
	}

	private <T, R> MasterDataPageResponse<R> findPage(
			com.odsoftware.hrm.repository.master.MasterDataRepository<T> repository,
			Integer page,
			Integer size,
			String search,
			Sort sort,
			Specification<T> specification,
			Function<T, R> mapper) {
		return MasterDataQuerySupport.toPageResponse(
				repository.findAll(specification, MasterDataQuerySupport.buildPageable(page, size, sort)),
				mapper);
	}

	private Specification<Country> countrySearchSpecification(String search) {
		return MasterDataQuerySupport.or(
				MasterDataQuerySupport.searchSpecification(search, "isoCode", "name"),
				MasterDataQuerySupport.digitsOnlyStartsWithSpecification(search, "phoneCode"));
	}

	private record ZipCodeRelations(UUID tenantId, Country country, Region region, Area area) {
	}
}
