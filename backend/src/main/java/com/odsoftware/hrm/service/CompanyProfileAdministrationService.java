package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationAreaOptionResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileCreateRequest;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileDetailResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileListItemResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileTypeOptionResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationCompanyProfileUpdateRequest;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationGlobalZipCodeOptionResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationReferenceResponse;
import com.odsoftware.hrm.dto.companyprofileadministration.CompanyProfileAdministrationRegionOptionResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.CompanyProfileType;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.GlobalZipCode;
import com.odsoftware.hrm.entity.master.Region;
import com.odsoftware.hrm.exception.InvalidRequestException;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.AreaRepository;
import com.odsoftware.hrm.repository.master.CompanyProfileTypeRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.GlobalZipCodeRepository;
import com.odsoftware.hrm.repository.master.RegionRepository;
import com.odsoftware.hrm.security.CurrentCaller;
import com.odsoftware.hrm.security.CurrentCallerService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.Predicate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CompanyProfileAdministrationService {

	private static final String COMPANY_PROFILE_CODE_PREFIX = "CP";
	private static final Pattern LEGACY_PHONE_SPLIT_PATTERN = Pattern.compile("^(\\+\\d+)\\s+(.+)$");

	private final CompanyProfileRepository companyProfileRepository;
	private final TenantRepository tenantRepository;
	private final CompanyProfileTypeRepository companyProfileTypeRepository;
	private final CountryRepository countryRepository;
	private final RegionRepository regionRepository;
	private final AreaRepository areaRepository;
	private final GlobalZipCodeRepository globalZipCodeRepository;
	private final CurrentCallerService currentCallerService;
	private final EntityManager entityManager;

	public CompanyProfileAdministrationService(
			CompanyProfileRepository companyProfileRepository,
			TenantRepository tenantRepository,
			CompanyProfileTypeRepository companyProfileTypeRepository,
			CountryRepository countryRepository,
			RegionRepository regionRepository,
			AreaRepository areaRepository,
			GlobalZipCodeRepository globalZipCodeRepository,
			CurrentCallerService currentCallerService,
			EntityManager entityManager) {
		this.companyProfileRepository = companyProfileRepository;
		this.tenantRepository = tenantRepository;
		this.companyProfileTypeRepository = companyProfileTypeRepository;
		this.countryRepository = countryRepository;
		this.regionRepository = regionRepository;
		this.areaRepository = areaRepository;
		this.globalZipCodeRepository = globalZipCodeRepository;
		this.currentCallerService = currentCallerService;
		this.entityManager = entityManager;
	}

	public MasterDataPageResponse<CompanyProfileAdministrationCompanyProfileListItemResponse> findCompanyProfiles(
			UUID tenantId,
			Integer page,
			Integer size,
			String search) {
		UUID authorizedTenantId = resolveAuthorizedTenantFilter(tenantId);
		return MasterDataQuerySupport.toPageResponse(
				companyProfileRepository.findAll(
						companyProfileSpecification(authorizedTenantId, search),
						MasterDataQuerySupport.buildPageable(
								page,
								size,
								MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")))),
				this::toListItemResponse);
	}

	public CompanyProfileAdministrationFormOptionsResponse findFormOptions() {
		CurrentCaller caller = currentCaller();
		List<CompanyProfileAdministrationReferenceResponse> tenants = tenantRepository.findAll().stream()
				.filter(tenant -> Boolean.TRUE.equals(tenant.getActive()))
				.filter(tenant -> caller.isPlatformUser() || tenant.getId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(Tenant::getCode))
				.map(this::toTenantReference)
				.toList();
		List<CompanyProfileAdministrationCompanyProfileTypeOptionResponse> companyProfileTypes = companyProfileTypeRepository.findAll().stream()
				.filter(type -> Boolean.TRUE.equals(type.getActive()))
				.filter(type -> caller.isPlatformUser() || type.getTenantId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(CompanyProfileType::getCode))
				.map(this::toCompanyProfileTypeOption)
				.toList();
		List<CompanyProfileAdministrationReferenceResponse> countries = countryRepository.findAll().stream()
				.filter(country -> Boolean.TRUE.equals(country.getActive()))
				.sorted(Comparator.comparing(Country::getIsoCode))
				.map(this::toCountryReference)
				.toList();
		List<CompanyProfileAdministrationRegionOptionResponse> regions = regionRepository.findAll().stream()
				.filter(region -> Boolean.TRUE.equals(region.getActive()))
				.filter(region -> caller.isPlatformUser() || region.getTenantId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(Region::getCode))
				.map(this::toRegionOption)
				.toList();
		List<CompanyProfileAdministrationAreaOptionResponse> areas = areaRepository.findAll().stream()
				.filter(area -> Boolean.TRUE.equals(area.getActive()))
				.filter(area -> caller.isPlatformUser() || area.getTenantId().equals(caller.tenantId()))
				.sorted(Comparator.comparing(Area::getCode))
				.map(this::toAreaOption)
				.toList();
		List<CompanyProfileAdministrationGlobalZipCodeOptionResponse> globalZipCodes = globalZipCodeRepository.findAll().stream()
				.filter(zipCode -> Boolean.TRUE.equals(zipCode.getActive()))
				.filter(zipCode -> zipCode.getTenantId() == null || caller.isPlatformUser() || caller.tenantId().equals(zipCode.getTenantId()))
				.sorted(Comparator.comparing(GlobalZipCode::getPostalCode).thenComparing(GlobalZipCode::getCity))
				.map(this::toGlobalZipCodeOption)
				.toList();
		return new CompanyProfileAdministrationFormOptionsResponse(
				tenants,
				companyProfileTypes,
				countries,
				regions,
				areas,
				globalZipCodes);
	}

	public CompanyProfileAdministrationCompanyProfileDetailResponse findCompanyProfileById(UUID companyProfileId) {
		return toDetailResponse(findCompanyProfileForAdministration(companyProfileId));
	}

	@Transactional
	public CompanyProfileAdministrationCompanyProfileDetailResponse createCompanyProfile(
			CompanyProfileAdministrationCompanyProfileCreateRequest request) {
		assertCallerCanManageTenant(request.tenantId());
		Tenant tenant = findTenant(request.tenantId());
		CompanyProfileType companyProfileType = findCompanyProfileTypeForTenant(request.companyProfileTypeId(), tenant.getId());
		Country country = findCountry(request.countryId());
		validateFiscalIdentifierByCountry(country, request.vatNumber(), request.taxIdentifier());
		Region region = findRegionForTenantAndCountry(request.regionId(), tenant.getId(), country.getId());
		Area area = findAreaForTenantAndCountry(request.areaId(), tenant.getId(), country.getId(), region);
		GlobalZipCode globalZipCode = findGlobalZipCodeForTenantAndCountry(request.globalZipCodeId(), tenant.getId(), country.getId(), region, area);

		CompanyProfile companyProfile = new CompanyProfile();
		companyProfile.setTenant(tenant);
		companyProfile.setCompanyProfileType(companyProfileType);
		companyProfile.setCode(generateNextCompanyProfileCode(tenant.getId()));
		companyProfile.setLegalName(clean(request.legalName()));
		companyProfile.setTradeName(clean(request.tradeName()));
		companyProfile.setVatNumber(clean(request.vatNumber()));
		companyProfile.setTaxIdentifier(clean(request.taxIdentifier()));
		companyProfile.setTaxNumber(clean(request.taxNumber()));
		companyProfile.setEmail(cleanLower(request.email()));
		companyProfile.setPecEmail(cleanLower(request.pecEmail()));
		applyPhoneFields(companyProfile, request.phone(), request.phoneDialCode(), request.phoneNationalNumber());
		companyProfile.setSdiCode(clean(request.sdiCode()));
		companyProfile.setCountry(country);
		companyProfile.setRegion(region);
		companyProfile.setArea(area);
		companyProfile.setGlobalZipCode(globalZipCode);
		companyProfile.setStreet(clean(request.street()));
		companyProfile.setStreetNumber(clean(request.streetNumber()));
		companyProfile.setActive(true);
		try {
			return toDetailResponse(companyProfileRepository.saveAndFlush(companyProfile));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException("Company profile code generation collision for tenant. Retry create operation.");
		}
	}

	@Transactional
	public CompanyProfileAdministrationCompanyProfileDetailResponse updateCompanyProfile(
			UUID companyProfileId,
			CompanyProfileAdministrationCompanyProfileUpdateRequest request) {
		CompanyProfile companyProfile = findCompanyProfileForAdministration(companyProfileId);
		Tenant tenant = companyProfile.getTenant();
		CompanyProfileType companyProfileType = findCompanyProfileTypeForTenant(request.companyProfileTypeId(), tenant.getId());
		Country country = findCountry(request.countryId());
		validateFiscalIdentifierByCountry(country, request.vatNumber(), request.taxIdentifier());
		Region region = findRegionForTenantAndCountry(request.regionId(), tenant.getId(), country.getId());
		Area area = findAreaForTenantAndCountry(request.areaId(), tenant.getId(), country.getId(), region);
		GlobalZipCode globalZipCode = findGlobalZipCodeForTenantAndCountry(request.globalZipCodeId(), tenant.getId(), country.getId(), region, area);

		companyProfile.setCompanyProfileType(companyProfileType);
		companyProfile.setLegalName(clean(request.legalName()));
		companyProfile.setTradeName(clean(request.tradeName()));
		companyProfile.setVatNumber(clean(request.vatNumber()));
		companyProfile.setTaxIdentifier(clean(request.taxIdentifier()));
		companyProfile.setTaxNumber(clean(request.taxNumber()));
		companyProfile.setEmail(cleanLower(request.email()));
		companyProfile.setPecEmail(cleanLower(request.pecEmail()));
		applyPhoneFields(companyProfile, request.phone(), request.phoneDialCode(), request.phoneNationalNumber());
		companyProfile.setSdiCode(clean(request.sdiCode()));
		companyProfile.setCountry(country);
		companyProfile.setRegion(region);
		companyProfile.setArea(area);
		companyProfile.setGlobalZipCode(globalZipCode);
		companyProfile.setStreet(clean(request.street()));
		companyProfile.setStreetNumber(clean(request.streetNumber()));
		return toDetailResponse(companyProfileRepository.saveAndFlush(companyProfile));
	}

	@Transactional
	public CompanyProfileAdministrationCompanyProfileDetailResponse activateCompanyProfile(UUID companyProfileId) {
		CompanyProfile companyProfile = findCompanyProfileForAdministration(companyProfileId);
		companyProfile.setActive(true);
		return toDetailResponse(companyProfileRepository.saveAndFlush(companyProfile));
	}

	@Transactional
	public CompanyProfileAdministrationCompanyProfileDetailResponse deactivateCompanyProfile(UUID companyProfileId) {
		CompanyProfile companyProfile = findCompanyProfileForAdministration(companyProfileId);
		companyProfile.setActive(false);
		return toDetailResponse(companyProfileRepository.saveAndFlush(companyProfile));
	}

	@Transactional
	public void deleteCompanyProfile(UUID companyProfileId) {
		CompanyProfile companyProfile = findCompanyProfileForAdministration(companyProfileId);
		if (isCompanyProfileReferenced(companyProfileId)) {
			throw new ResourceConflictException("Company profile cannot be deleted because it is referenced by one or more records");
		}
		companyProfileRepository.delete(companyProfile);
		companyProfileRepository.flush();
	}

	private Specification<CompanyProfile> companyProfileSpecification(UUID tenantId, String search) {
		Specification<CompanyProfile> searchSpecification = MasterDataQuerySupport.searchSpecification(
				search,
				"code",
				"legalName",
				"tradeName",
				"vatNumber",
				"taxIdentifier",
				"taxNumber",
				"tenant.code",
				"tenant.name",
				"companyProfileType.code",
				"companyProfileType.name",
				"country.isoCode",
				"country.name");
		return (root, query, criteriaBuilder) -> {
			query.distinct(true);
			Predicate predicate = criteriaBuilder.conjunction();
			if (tenantId != null) {
				predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("tenant").get("id"), tenantId));
			}
			if (searchSpecification == null) {
				return predicate;
			}

			Predicate searchPredicate = searchSpecification.toPredicate(root, query, criteriaBuilder);
			return searchPredicate == null ? predicate : criteriaBuilder.and(predicate, searchPredicate);
		};
	}

	private CompanyProfile findCompanyProfileForAdministration(UUID companyProfileId) {
		CompanyProfile companyProfile = companyProfileRepository.findById(companyProfileId)
				.orElseThrow(() -> new ResourceNotFoundException("Company profile not found: " + companyProfileId));
		assertCallerCanManageTenant(companyProfile.getTenant().getId());
		return companyProfile;
	}

	private Tenant findTenant(UUID tenantId) {
		return tenantRepository.findById(tenantId)
				.orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + tenantId));
	}

	private CompanyProfileType findCompanyProfileTypeForTenant(UUID companyProfileTypeId, UUID tenantId) {
		CompanyProfileType companyProfileType = companyProfileTypeRepository.findById(companyProfileTypeId)
				.orElseThrow(() -> new ResourceNotFoundException("Company profile type not found: " + companyProfileTypeId));
		if (!tenantId.equals(companyProfileType.getTenantId())) {
			throw new InvalidRequestException("Company profile type does not belong to tenant: " + companyProfileTypeId);
		}
		return companyProfileType;
	}

	private Country findCountry(UUID countryId) {
		return countryRepository.findById(countryId)
				.orElseThrow(() -> new ResourceNotFoundException("Country not found: " + countryId));
	}

	private Region findRegionForTenantAndCountry(UUID regionId, UUID tenantId, UUID countryId) {
		if (regionId == null) {
			return null;
		}

		Region region = regionRepository.findById(regionId)
				.orElseThrow(() -> new ResourceNotFoundException("Region not found: " + regionId));
		if (!tenantId.equals(region.getTenantId())) {
			throw new InvalidRequestException("Region does not belong to tenant: " + regionId);
		}
		if (!countryId.equals(region.getCountry().getId())) {
			throw new InvalidRequestException("Region does not belong to country: " + regionId);
		}
		return region;
	}

	private Area findAreaForTenantAndCountry(UUID areaId, UUID tenantId, UUID countryId, Region region) {
		if (areaId == null) {
			return null;
		}

		Area area = areaRepository.findById(areaId)
				.orElseThrow(() -> new ResourceNotFoundException("Area not found: " + areaId));
		if (!tenantId.equals(area.getTenantId())) {
			throw new InvalidRequestException("Area does not belong to tenant: " + areaId);
		}
		if (!countryId.equals(area.getCountry().getId())) {
			throw new InvalidRequestException("Area does not belong to country: " + areaId);
		}
		if (region != null && !region.getId().equals(area.getRegion().getId())) {
			throw new InvalidRequestException("Area does not belong to region: " + areaId);
		}
		return area;
	}

	private GlobalZipCode findGlobalZipCodeForTenantAndCountry(
			UUID globalZipCodeId,
			UUID tenantId,
			UUID countryId,
			Region region,
			Area area) {
		if (globalZipCodeId == null) {
			return null;
		}

		GlobalZipCode globalZipCode = globalZipCodeRepository.findById(globalZipCodeId)
				.orElseThrow(() -> new ResourceNotFoundException("Global zip code not found: " + globalZipCodeId));
		if (globalZipCode.getTenantId() != null && !tenantId.equals(globalZipCode.getTenantId())) {
			throw new InvalidRequestException("Global zip code does not belong to tenant: " + globalZipCodeId);
		}
		if (!countryId.equals(globalZipCode.getCountry().getId())) {
			throw new InvalidRequestException("Global zip code does not belong to country: " + globalZipCodeId);
		}
		if (region != null && globalZipCode.getRegion() != null && !region.getId().equals(globalZipCode.getRegion().getId())) {
			throw new InvalidRequestException("Global zip code does not belong to region: " + globalZipCodeId);
		}
		if (area != null && globalZipCode.getArea() != null && !area.getId().equals(globalZipCode.getArea().getId())) {
			throw new InvalidRequestException("Global zip code does not belong to area: " + globalZipCodeId);
		}
		return globalZipCode;
	}

	private CompanyProfileAdministrationCompanyProfileListItemResponse toListItemResponse(CompanyProfile companyProfile) {
		return new CompanyProfileAdministrationCompanyProfileListItemResponse(
				companyProfile.getId(),
				toTenantReference(companyProfile.getTenant()),
				toCompanyProfileTypeReference(companyProfile.getCompanyProfileType()),
				companyProfile.getCode(),
				companyProfile.getLegalName(),
				companyProfile.getTradeName(),
				companyProfile.getVatNumber(),
				companyProfile.getTaxNumber(),
				toCountryReference(companyProfile.getCountry()),
				companyProfile.getActive(),
				companyProfile.getUpdatedAt());
	}

	private CompanyProfileAdministrationCompanyProfileDetailResponse toDetailResponse(CompanyProfile companyProfile) {
		return new CompanyProfileAdministrationCompanyProfileDetailResponse(
				companyProfile.getId(),
				toTenantReference(companyProfile.getTenant()),
				toCompanyProfileTypeReference(companyProfile.getCompanyProfileType()),
				companyProfile.getCode(),
				companyProfile.getLegalName(),
				companyProfile.getTradeName(),
				companyProfile.getVatNumber(),
				companyProfile.getTaxIdentifier(),
				companyProfile.getTaxNumber(),
				companyProfile.getEmail(),
				companyProfile.getPecEmail(),
				companyProfile.getPhoneDialCode(),
				companyProfile.getPhoneNationalNumber(),
				companyProfile.getPhone(),
				companyProfile.getSdiCode(),
				toCountryReference(companyProfile.getCountry()),
				toRegionReference(companyProfile.getRegion()),
				toAreaReference(companyProfile.getArea()),
				toGlobalZipCodeReference(companyProfile.getGlobalZipCode()),
				companyProfile.getStreet(),
				companyProfile.getStreetNumber(),
				companyProfile.getActive(),
				companyProfile.getCreatedAt(),
				companyProfile.getUpdatedAt());
	}

	private CompanyProfileAdministrationReferenceResponse toTenantReference(Tenant tenant) {
		return new CompanyProfileAdministrationReferenceResponse(tenant.getId(), tenant.getCode(), tenant.getName());
	}

	private CompanyProfileAdministrationReferenceResponse toCompanyProfileTypeReference(CompanyProfileType companyProfileType) {
		return new CompanyProfileAdministrationReferenceResponse(
				companyProfileType.getId(),
				companyProfileType.getCode(),
				companyProfileType.getName());
	}

	private CompanyProfileAdministrationReferenceResponse toCountryReference(Country country) {
		return new CompanyProfileAdministrationReferenceResponse(country.getId(), country.getIsoCode(), country.getName());
	}

	private CompanyProfileAdministrationReferenceResponse toRegionReference(Region region) {
		if (region == null) {
			return null;
		}
		return new CompanyProfileAdministrationReferenceResponse(region.getId(), region.getCode(), region.getName());
	}

	private CompanyProfileAdministrationReferenceResponse toAreaReference(Area area) {
		if (area == null) {
			return null;
		}
		return new CompanyProfileAdministrationReferenceResponse(area.getId(), area.getCode(), area.getName());
	}

	private CompanyProfileAdministrationReferenceResponse toGlobalZipCodeReference(GlobalZipCode globalZipCode) {
		if (globalZipCode == null) {
			return null;
		}
		return new CompanyProfileAdministrationReferenceResponse(
				globalZipCode.getId(),
				globalZipCode.getPostalCode(),
				globalZipCode.getCity());
	}

	private CompanyProfileAdministrationCompanyProfileTypeOptionResponse toCompanyProfileTypeOption(CompanyProfileType companyProfileType) {
		return new CompanyProfileAdministrationCompanyProfileTypeOptionResponse(
				companyProfileType.getId(),
				companyProfileType.getCode(),
				companyProfileType.getName(),
				companyProfileType.getTenantId());
	}

	private CompanyProfileAdministrationRegionOptionResponse toRegionOption(Region region) {
		return new CompanyProfileAdministrationRegionOptionResponse(
				region.getId(),
				region.getCode(),
				region.getName(),
				region.getTenantId(),
				region.getCountry().getId());
	}

	private CompanyProfileAdministrationAreaOptionResponse toAreaOption(Area area) {
		return new CompanyProfileAdministrationAreaOptionResponse(
				area.getId(),
				area.getCode(),
				area.getName(),
				area.getTenantId(),
				area.getCountry().getId(),
				area.getRegion().getId());
	}

	private CompanyProfileAdministrationGlobalZipCodeOptionResponse toGlobalZipCodeOption(GlobalZipCode globalZipCode) {
		return new CompanyProfileAdministrationGlobalZipCodeOptionResponse(
				globalZipCode.getId(),
				globalZipCode.getPostalCode(),
				globalZipCode.getCity(),
				globalZipCode.getTenantId(),
				globalZipCode.getCountry().getId(),
				globalZipCode.getRegion() == null ? null : globalZipCode.getRegion().getId(),
				globalZipCode.getArea() == null ? null : globalZipCode.getArea().getId(),
				clean(globalZipCode.getProvinceName()),
				clean(globalZipCode.getProvinceCode()));
	}

	private boolean isCompanyProfileReferenced(UUID companyProfileId) {
		return existsByCompanyProfileColumn("office_locations", "company_profile_id", companyProfileId)
				|| existsByCompanyProfileColumn("user_accounts", "company_profile_id", companyProfileId)
				|| existsByCompanyProfileColumn("employees", "company_id", companyProfileId)
				|| existsByCompanyProfileColumn("contracts", "company_profile_id", companyProfileId)
				|| existsByCompanyProfileColumn("devices", "company_profile_id", companyProfileId)
				|| existsByCompanyProfileColumn("payroll_documents", "company_profile_id", companyProfileId)
				|| existsByCompanyProfileColumn("leave_requests", "company_profile_id", companyProfileId)
				|| existsByCompanyProfileColumn("audit_logs", "company_profile_id", companyProfileId)
				|| existsByCompanyProfileColumn("employee_disciplinary_actions", "company_profile_id", companyProfileId);
	}

	private boolean existsByCompanyProfileColumn(String tableName, String columnName, UUID companyProfileId) {
		Query query = entityManager.createNativeQuery(
				"select case when exists (select 1 from " + tableName + " where " + columnName + " = :companyProfileId) then 1 else 0 end");
		query.setParameter("companyProfileId", companyProfileId);
		Object rawResult = query.getSingleResult();
		if (rawResult instanceof Number number) {
			return number.intValue() == 1;
		}
		return "1".equals(String.valueOf(rawResult));
	}

	private String generateNextCompanyProfileCode(UUID tenantId) {
		List<CompanyProfile> companyProfiles = companyProfileRepository.findAll(
				(root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("tenant").get("id"), tenantId),
				Sort.by(Sort.Order.desc("code")));
		int maxProgressive = 0;
		for (CompanyProfile companyProfile : companyProfiles) {
			int parsedProgressive = parseProgressiveCode(companyProfile.getCode(), COMPANY_PROFILE_CODE_PREFIX);
			if (parsedProgressive > maxProgressive) {
				maxProgressive = parsedProgressive;
			}
		}
		if (maxProgressive >= 999) {
			throw new ResourceConflictException("Company profile code progressive exhausted for tenant: " + tenantId);
		}
		return COMPANY_PROFILE_CODE_PREFIX + String.format(Locale.ROOT, "%03d", maxProgressive + 1);
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

	private UUID resolveAuthorizedTenantFilter(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (caller.isPlatformUser()) {
			return tenantId;
		}
		if (tenantId != null && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant company profile administration is not allowed for caller");
		}
		return caller.tenantId();
	}

	private void assertCallerCanManageTenant(UUID tenantId) {
		CurrentCaller caller = currentCaller();
		if (!caller.isPlatformUser() && !caller.tenantId().equals(tenantId)) {
			throw new AccessDeniedException("Cross-tenant company profile administration is not allowed for caller");
		}
	}

	private CurrentCaller currentCaller() {
		return currentCallerService.requireCurrentCaller();
	}

	private String cleanUpper(String value) {
		String cleaned = clean(value);
		return cleaned == null ? null : cleaned.toUpperCase(Locale.ROOT);
	}

	private void applyPhoneFields(
			CompanyProfile companyProfile,
			String legacyPhone,
			String phoneDialCode,
			String phoneNationalNumber) {
		NormalizedCompanyProfilePhone normalizedPhone = normalizeCompanyProfilePhone(legacyPhone, phoneDialCode, phoneNationalNumber);
		companyProfile.setPhoneDialCode(normalizedPhone.phoneDialCode());
		companyProfile.setPhoneNationalNumber(normalizedPhone.phoneNationalNumber());
		companyProfile.setPhone(normalizedPhone.legacyPhone());
	}

	private NormalizedCompanyProfilePhone normalizeCompanyProfilePhone(
			String legacyPhone,
			String phoneDialCode,
			String phoneNationalNumber) {
		String normalizedNationalNumber = clean(phoneNationalNumber);
		if (normalizedNationalNumber != null) {
			String normalizedDialCode = clean(phoneDialCode);
			return new NormalizedCompanyProfilePhone(
					composeLegacyPhone(normalizedDialCode, normalizedNationalNumber),
					normalizedDialCode,
					normalizedNationalNumber);
		}

		String normalizedLegacyPhone = clean(legacyPhone);
		if (normalizedLegacyPhone == null) {
			throw new InvalidRequestException("Phone number is required");
		}

		NormalizedLegacyPhoneParts parsedLegacyPhone = splitLegacyPhoneConservatively(normalizedLegacyPhone);
		if (parsedLegacyPhone == null) {
			return new NormalizedCompanyProfilePhone(normalizedLegacyPhone, null, normalizedLegacyPhone);
		}

		return new NormalizedCompanyProfilePhone(
				composeLegacyPhone(parsedLegacyPhone.phoneDialCode(), parsedLegacyPhone.phoneNationalNumber()),
				parsedLegacyPhone.phoneDialCode(),
				parsedLegacyPhone.phoneNationalNumber());
	}

	private NormalizedLegacyPhoneParts splitLegacyPhoneConservatively(String legacyPhone) {
		Matcher matcher = LEGACY_PHONE_SPLIT_PATTERN.matcher(legacyPhone);
		if (!matcher.matches()) {
			return null;
		}

		String normalizedDialCode = clean(matcher.group(1));
		String normalizedNationalNumber = clean(matcher.group(2));
		if (normalizedDialCode == null || normalizedNationalNumber == null) {
			return null;
		}

		return new NormalizedLegacyPhoneParts(normalizedDialCode, normalizedNationalNumber);
	}

	private String composeLegacyPhone(String phoneDialCode, String phoneNationalNumber) {
		String normalizedNationalNumber = clean(phoneNationalNumber);
		if (normalizedNationalNumber == null) {
			return null;
		}

		String normalizedDialCode = clean(phoneDialCode);
		return normalizedDialCode == null
				? normalizedNationalNumber
				: normalizedDialCode + " " + normalizedNationalNumber;
	}

	private void validateFiscalIdentifierByCountry(Country country, String vatNumber, String taxIdentifier) {
		if (isItalianCountry(country)) {
			if (clean(vatNumber) == null) {
				throw new InvalidRequestException("VAT number is required for Italy");
			}
			return;
		}

		if (clean(taxIdentifier) == null) {
			throw new InvalidRequestException("Tax identifier is required for non-Italian countries");
		}
	}

	private boolean isItalianCountry(Country country) {
		return country.getIsoCode() != null && "IT".equalsIgnoreCase(country.getIsoCode().trim());
	}

	private String cleanLower(String value) {
		String cleaned = clean(value);
		return cleaned == null ? null : cleaned.toLowerCase(Locale.ROOT);
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}

	private record NormalizedCompanyProfilePhone(
			String legacyPhone,
			String phoneDialCode,
			String phoneNationalNumber) {
	}

	private record NormalizedLegacyPhoneParts(
			String phoneDialCode,
			String phoneNationalNumber) {
	}
}
