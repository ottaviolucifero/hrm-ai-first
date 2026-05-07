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
import com.odsoftware.hrm.repository.master.AreaRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.repository.master.GenderRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import com.odsoftware.hrm.repository.master.MaritalStatusRepository;
import com.odsoftware.hrm.repository.master.NationalIdentifierTypeRepository;
import com.odsoftware.hrm.repository.master.RegionRepository;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.function.Function;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MasterDataGlobalService {

	private final CountryRepository countryRepository;
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
			RegionRepository regionRepository,
			AreaRepository areaRepository,
			GlobalZipCodeRepository globalZipCodeRepository,
			CurrencyRepository currencyRepository,
			GenderRepository genderRepository,
			MaritalStatusRepository maritalStatusRepository,
			NationalIdentifierTypeRepository nationalIdentifierTypeRepository,
			ItalianZipCodeImportService italianZipCodeImportService) {
		this.countryRepository = countryRepository;
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
				MasterDataQuerySupport.searchSpecification(search, "isoCode", "name", "phoneCode"),
				this::toCountryResponse);
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

	public MasterDataPageResponse<RegionResponse> findRegions(Integer page, Integer size, String search) {
		return findPage(
				regionRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				MasterDataQuerySupport.searchSpecification(search, "code", "name", "country.isoCode", "country.name"),
				this::toRegionResponse);
	}

	public RegionResponse findRegionById(UUID id) {
		return toRegionResponse(findRegion(id));
	}

	@Transactional
	public RegionResponse createRegion(RegionRequest request) {
		Country country = findCountry(request.countryId());
		String code = cleanUpper(request.code());
		if (regionRepository.existsByCountry_IdAndCode(country.getId(), code)) {
			throw new ResourceConflictException("Region code already exists for country: " + code);
		}
		Region region = new Region();
		applyRegion(region, request, country, code);
		return toRegionResponse(regionRepository.save(region));
	}

	@Transactional
	public RegionResponse updateRegion(UUID id, RegionRequest request) {
		Region region = findRegion(id);
		Country country = findCountry(request.countryId());
		String code = cleanUpper(request.code());
		if (regionRepository.existsByCountry_IdAndCodeAndIdNot(country.getId(), code, id)) {
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

	public MasterDataPageResponse<AreaResponse> findAreas(Integer page, Integer size, String search) {
		return findPage(
				areaRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")),
				MasterDataQuerySupport.searchSpecification(search, "code", "name", "country.isoCode", "country.name", "region.code", "region.name"),
				this::toAreaResponse);
	}

	public AreaResponse findAreaById(UUID id) {
		return toAreaResponse(findArea(id));
	}

	@Transactional
	public AreaResponse createArea(AreaRequest request) {
		Country country = findCountry(request.countryId());
		Region region = findRegion(request.regionId());
		validateRegionCountry(region, country);
		String code = cleanUpper(request.code());
		if (areaRepository.existsByRegion_IdAndCode(region.getId(), code)) {
			throw new ResourceConflictException("Area code already exists for region: " + code);
		}
		Area area = new Area();
		applyArea(area, request, country, region, code);
		return toAreaResponse(areaRepository.save(area));
	}

	@Transactional
	public AreaResponse updateArea(UUID id, AreaRequest request) {
		Area area = findArea(id);
		Country country = findCountry(request.countryId());
		Region region = findRegion(request.regionId());
		validateRegionCountry(region, country);
		String code = cleanUpper(request.code());
		if (areaRepository.existsByRegion_IdAndCodeAndIdNot(region.getId(), code, id)) {
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

	public MasterDataPageResponse<GlobalZipCodeResponse> findGlobalZipCodes(Integer page, Integer size, String search) {
		return findPage(
				globalZipCodeRepository,
				page,
				size,
				search,
				MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("postalCode").ascending().and(Sort.by("city"))),
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
						"area.name"),
				this::toGlobalZipCodeResponse);
	}

	public GlobalZipCodeResponse findGlobalZipCodeById(UUID id) {
		return toGlobalZipCodeResponse(findGlobalZipCode(id));
	}

	@Transactional
	public GlobalZipCodeResponse createGlobalZipCode(GlobalZipCodeRequest request) {
		ZipCodeRelations relations = resolveZipCodeRelations(request);
		String postalCode = cleanUpper(request.postalCode());
		String city = clean(request.city());
		if (globalZipCodeRepository.existsByCountry_IdAndPostalCodeAndCity(relations.country().getId(), postalCode, city)) {
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
		if (globalZipCodeRepository.existsByCountry_IdAndPostalCodeAndCityAndIdNot(relations.country().getId(), postalCode, city, id)) {
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
		region.setCountry(country);
		region.setName(clean(request.name()));
		region.setCode(code);
		region.setActive(activeOrDefault(request.active()));
	}

	private void applyArea(Area area, AreaRequest request, Country country, Region region, String code) {
		area.setCountry(country);
		area.setRegion(region);
		area.setName(clean(request.name()));
		area.setCode(code);
		area.setActive(activeOrDefault(request.active()));
	}

	private void applyGlobalZipCode(GlobalZipCode globalZipCode, GlobalZipCodeRequest request, ZipCodeRelations relations, String postalCode, String city) {
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
		Region region = request.regionId() == null ? null : findRegion(request.regionId());
		Area area = request.areaId() == null ? null : findArea(request.areaId());
		if (region != null) {
			validateRegionCountry(region, country);
		}
		if (area != null) {
			if (region == null) {
				throw new InvalidRequestException("areaId requires regionId");
			}
			validateAreaRelations(area, country, region);
		}
		return new ZipCodeRelations(country, region, area);
	}

	private void validateRegionCountry(Region region, Country country) {
		if (!region.getCountry().getId().equals(country.getId())) {
			throw new InvalidRequestException("Region does not belong to the selected country");
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

	private RegionResponse toRegionResponse(Region region) {
		return new RegionResponse(
				region.getId(),
				toCountryReference(region.getCountry()),
				region.getName(),
				region.getCode(),
				region.getActive(),
				region.getCreatedAt(),
				region.getUpdatedAt());
	}

	private AreaResponse toAreaResponse(Area area) {
		return new AreaResponse(
				area.getId(),
				toCountryReference(area.getCountry()),
				toRegionReference(area.getRegion()),
				area.getName(),
				area.getCode(),
				area.getActive(),
				area.getCreatedAt(),
				area.getUpdatedAt());
	}

	private GlobalZipCodeResponse toGlobalZipCodeResponse(GlobalZipCode globalZipCode) {
		return new GlobalZipCodeResponse(
				globalZipCode.getId(),
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

	private record ZipCodeRelations(Country country, Region region, Area area) {
	}
}
