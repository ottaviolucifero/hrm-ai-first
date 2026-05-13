package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.foundation.FoundationReferenceResponse;
import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationFormOptionsResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantCreateRequest;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantDetailResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantListItemResponse;
import com.odsoftware.hrm.dto.tenantadministration.TenantAdministrationTenantUpdateRequest;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Currency;
import com.odsoftware.hrm.exception.ResourceConflictException;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.master.CountryRepository;
import com.odsoftware.hrm.repository.master.CurrencyRepository;
import com.odsoftware.hrm.security.CurrentCallerService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.criteria.Predicate;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class TenantAdministrationService {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final String TENANT_CODE_PREFIX = "TE";

	private final TenantRepository tenantRepository;
	private final CountryRepository countryRepository;
	private final CurrencyRepository currencyRepository;
	private final CurrentCallerService currentCallerService;
	private final EntityManager entityManager;

	public TenantAdministrationService(
			TenantRepository tenantRepository,
			CountryRepository countryRepository,
			CurrencyRepository currencyRepository,
			CurrentCallerService currentCallerService,
			EntityManager entityManager) {
		this.tenantRepository = tenantRepository;
		this.countryRepository = countryRepository;
		this.currencyRepository = currencyRepository;
		this.currentCallerService = currentCallerService;
		this.entityManager = entityManager;
	}

	public MasterDataPageResponse<TenantAdministrationTenantListItemResponse> findTenants(Integer page, Integer size, String search) {
		assertPlatformCaller();
		return MasterDataQuerySupport.toPageResponse(
				tenantRepository.findAll(
						tenantSpecification(search),
						MasterDataQuerySupport.buildPageable(page, size, MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("code")))),
				this::toTenantListItemResponse);
	}

	public TenantAdministrationFormOptionsResponse findFormOptions() {
		assertPlatformCaller();
		List<FoundationReferenceResponse> countries = countryRepository.findAll().stream()
				.filter(country -> Boolean.TRUE.equals(country.getActive()))
				.sorted(Comparator.comparing(Country::getIsoCode))
				.map(this::toCountryReference)
				.toList();
		List<FoundationReferenceResponse> currencies = currencyRepository.findAll().stream()
				.filter(currency -> Boolean.TRUE.equals(currency.getActive()))
				.sorted(Comparator.comparing(Currency::getCode))
				.map(this::toCurrencyReference)
				.toList();
		return new TenantAdministrationFormOptionsResponse(countries, currencies);
	}

	public TenantAdministrationTenantDetailResponse findTenantById(UUID tenantId) {
		assertPlatformCaller();
		return toTenantDetailResponse(findTenant(tenantId));
	}

	@Transactional
	public TenantAdministrationTenantDetailResponse createTenant(TenantAdministrationTenantCreateRequest request) {
		assertPlatformCaller();
		Tenant tenant = new Tenant();
		tenant.setCode(generateNextTenantCode());
		tenant.setName(clean(request.name()));
		tenant.setLegalName(clean(request.legalName()));
		tenant.setDefaultCountry(findCountry(request.defaultCountryId()));
		tenant.setDefaultCurrency(findCurrency(request.defaultCurrencyId()));
		tenant.setActive(activeOrDefault(request.active()));
		try {
			return toTenantDetailResponse(tenantRepository.saveAndFlush(tenant));
		}
		catch (DataIntegrityViolationException exception) {
			throw new ResourceConflictException("Tenant code generation collision. Retry create operation.");
		}
	}

	@Transactional
	public TenantAdministrationTenantDetailResponse updateTenant(UUID tenantId, TenantAdministrationTenantUpdateRequest request) {
		assertPlatformCaller();
		Tenant tenant = findTenant(tenantId);
		tenant.setName(clean(request.name()));
		tenant.setLegalName(clean(request.legalName()));
		tenant.setDefaultCountry(findCountry(request.defaultCountryId()));
		tenant.setDefaultCurrency(findCurrency(request.defaultCurrencyId()));
		return toTenantDetailResponse(tenantRepository.saveAndFlush(tenant));
	}

	@Transactional
	public TenantAdministrationTenantDetailResponse activateTenant(UUID tenantId) {
		assertPlatformCaller();
		Tenant tenant = findTenant(tenantId);
		tenant.setActive(true);
		return toTenantDetailResponse(tenantRepository.saveAndFlush(tenant));
	}

	@Transactional
	public TenantAdministrationTenantDetailResponse deactivateTenant(UUID tenantId) {
		assertPlatformCaller();
		Tenant tenant = findTenant(tenantId);
		tenant.setActive(false);
		return toTenantDetailResponse(tenantRepository.saveAndFlush(tenant));
	}

	@Transactional
	public void deleteTenant(UUID tenantId) {
		assertPlatformCaller();
		Tenant tenant = findTenant(tenantId);
		if (FOUNDATION_TENANT_ID.equals(tenant.getId())) {
			throw new ResourceConflictException("Foundation tenant cannot be deleted");
		}
		if (isTenantReferenced(tenantId)) {
			throw new ResourceConflictException("Tenant cannot be deleted because it is referenced by one or more records");
		}
		tenantRepository.delete(tenant);
		tenantRepository.flush();
	}

	private Specification<Tenant> tenantSpecification(String search) {
		Specification<Tenant> searchSpecification = MasterDataQuerySupport.searchSpecification(
				search,
				"code",
				"name",
				"legalName",
				"defaultCountry.isoCode",
				"defaultCountry.name",
				"defaultCurrency.code",
				"defaultCurrency.name");
		return (root, query, criteriaBuilder) -> {
			query.distinct(true);
			if (searchSpecification == null) {
				return criteriaBuilder.conjunction();
			}
			Predicate searchPredicate = searchSpecification.toPredicate(root, query, criteriaBuilder);
			return searchPredicate == null ? criteriaBuilder.conjunction() : searchPredicate;
		};
	}

	private Tenant findTenant(UUID tenantId) {
		return tenantRepository.findById(tenantId)
				.orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + tenantId));
	}

	private Country findCountry(UUID countryId) {
		return countryRepository.findById(countryId)
				.orElseThrow(() -> new ResourceNotFoundException("Country not found: " + countryId));
	}

	private Currency findCurrency(UUID currencyId) {
		return currencyRepository.findById(currencyId)
				.orElseThrow(() -> new ResourceNotFoundException("Currency not found: " + currencyId));
	}

	private TenantAdministrationTenantListItemResponse toTenantListItemResponse(Tenant tenant) {
		return new TenantAdministrationTenantListItemResponse(
				tenant.getId(),
				tenant.getCode(),
				tenant.getName(),
				tenant.getLegalName(),
				toCountryReference(tenant.getDefaultCountry()),
				toCurrencyReference(tenant.getDefaultCurrency()),
				tenant.getActive(),
				tenant.getUpdatedAt());
	}

	private TenantAdministrationTenantDetailResponse toTenantDetailResponse(Tenant tenant) {
		return new TenantAdministrationTenantDetailResponse(
				tenant.getId(),
				tenant.getCode(),
				tenant.getName(),
				tenant.getLegalName(),
				toCountryReference(tenant.getDefaultCountry()),
				toCurrencyReference(tenant.getDefaultCurrency()),
				tenant.getActive(),
				tenant.getCreatedAt(),
				tenant.getUpdatedAt());
	}

	private FoundationReferenceResponse toCountryReference(Country country) {
		return new FoundationReferenceResponse(country.getId(), country.getIsoCode(), country.getName());
	}

	private FoundationReferenceResponse toCurrencyReference(Currency currency) {
		return new FoundationReferenceResponse(currency.getId(), currency.getCode(), currency.getName());
	}

	private boolean isTenantReferenced(UUID tenantId) {
		return existsByTenantColumn("company_profiles", "tenant_id", tenantId)
				|| existsByTenantColumn("office_locations", "tenant_id", tenantId)
				|| existsByTenantColumn("smtp_configurations", "tenant_id", tenantId)
				|| existsByTenantColumn("user_accounts", "tenant_id", tenantId)
				|| existsByTenantColumn("user_accounts", "primary_tenant_id", tenantId)
				|| existsByTenantColumn("roles", "tenant_id", tenantId)
				|| existsByTenantColumn("permissions", "tenant_id", tenantId)
				|| existsByTenantColumn("user_roles", "tenant_id", tenantId)
				|| existsByTenantColumn("role_permissions", "tenant_id", tenantId)
				|| existsByTenantColumn("user_tenant_accesses", "tenant_id", tenantId)
				|| existsByTenantColumn("employees", "tenant_id", tenantId)
				|| existsByTenantColumn("contracts", "tenant_id", tenantId)
				|| existsByTenantColumn("devices", "tenant_id", tenantId)
				|| existsByTenantColumn("payroll_documents", "tenant_id", tenantId)
				|| existsByTenantColumn("leave_requests", "tenant_id", tenantId)
				|| existsByTenantColumn("audit_logs", "tenant_id", tenantId)
				|| existsByTenantColumn("audit_logs", "acting_tenant_id", tenantId)
				|| existsByTenantColumn("audit_logs", "target_tenant_id", tenantId)
				|| existsByTenantColumn("employee_disciplinary_actions", "tenant_id", tenantId)
				|| existsByTenantColumn("departments", "tenant_id", tenantId)
				|| existsByTenantColumn("job_titles", "tenant_id", tenantId)
				|| existsByTenantColumn("contract_types", "tenant_id", tenantId)
				|| existsByTenantColumn("employment_statuses", "tenant_id", tenantId)
				|| existsByTenantColumn("work_modes", "tenant_id", tenantId)
				|| existsByTenantColumn("leave_request_types", "tenant_id", tenantId)
				|| existsByTenantColumn("document_types", "tenant_id", tenantId)
				|| existsByTenantColumn("device_types", "tenant_id", tenantId)
				|| existsByTenantColumn("device_brands", "tenant_id", tenantId)
				|| existsByTenantColumn("device_statuses", "tenant_id", tenantId)
				|| existsByTenantColumn("company_profile_types", "tenant_id", tenantId)
				|| existsByTenantColumn("office_location_types", "tenant_id", tenantId)
				|| existsByTenantColumn("regions", "tenant_id", tenantId)
				|| existsByTenantColumn("areas", "tenant_id", tenantId)
				|| existsByTenantColumn("global_zip_codes", "tenant_id", tenantId);
	}

	private boolean existsByTenantColumn(String tableName, String columnName, UUID tenantId) {
		Query query = entityManager.createNativeQuery(
				"select case when exists (select 1 from " + tableName + " where " + columnName + " = :tenantId) then 1 else 0 end");
		query.setParameter("tenantId", tenantId);
		Object rawResult = query.getSingleResult();
		if (rawResult instanceof Number number) {
			return number.intValue() == 1;
		}
		return "1".equals(String.valueOf(rawResult));
	}

	private void assertPlatformCaller() {
		if (!currentCallerService.requireCurrentCaller().isPlatformUser()) {
			throw new AccessDeniedException("Tenant administration is restricted to platform callers");
		}
	}

	private Boolean activeOrDefault(Boolean active) {
		return active == null ? Boolean.TRUE : active;
	}

	private String generateNextTenantCode() {
		List<Tenant> tenants = tenantRepository.findAll(Sort.by(Sort.Order.desc("code")));
		int maxProgressive = 0;
		for (Tenant tenant : tenants) {
			int parsedProgressive = parseProgressiveCode(tenant.getCode(), TENANT_CODE_PREFIX);
			if (parsedProgressive > maxProgressive) {
				maxProgressive = parsedProgressive;
			}
		}

		if (maxProgressive >= 999) {
			throw new ResourceConflictException("Tenant code progressive exhausted");
		}

		return TENANT_CODE_PREFIX + String.format(Locale.ROOT, "%03d", maxProgressive + 1);
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
}
