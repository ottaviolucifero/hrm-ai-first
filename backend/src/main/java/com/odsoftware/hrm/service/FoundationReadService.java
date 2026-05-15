package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.foundation.CompanyProfileResponse;
import com.odsoftware.hrm.dto.foundation.FoundationReferenceResponse;
import com.odsoftware.hrm.dto.foundation.OfficeLocationResponse;
import com.odsoftware.hrm.dto.foundation.SmtpConfigurationResponse;
import com.odsoftware.hrm.dto.foundation.TenantResponse;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.OfficeLocation;
import com.odsoftware.hrm.entity.core.SmtpConfiguration;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.master.Area;
import com.odsoftware.hrm.entity.master.Country;
import com.odsoftware.hrm.entity.master.Currency;
import com.odsoftware.hrm.entity.master.GlobalZipCode;
import com.odsoftware.hrm.entity.master.Region;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.core.CompanyProfileRepository;
import com.odsoftware.hrm.repository.core.OfficeLocationRepository;
import com.odsoftware.hrm.repository.core.SmtpConfigurationRepository;
import com.odsoftware.hrm.repository.core.TenantRepository;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class FoundationReadService {

	private final TenantRepository tenantRepository;
	private final CompanyProfileRepository companyProfileRepository;
	private final OfficeLocationRepository officeLocationRepository;
	private final SmtpConfigurationRepository smtpConfigurationRepository;

	public FoundationReadService(
			TenantRepository tenantRepository,
			CompanyProfileRepository companyProfileRepository,
			OfficeLocationRepository officeLocationRepository,
			SmtpConfigurationRepository smtpConfigurationRepository) {
		this.tenantRepository = tenantRepository;
		this.companyProfileRepository = companyProfileRepository;
		this.officeLocationRepository = officeLocationRepository;
		this.smtpConfigurationRepository = smtpConfigurationRepository;
	}

	public List<TenantResponse> findTenants() {
		return tenantRepository.findAll().stream()
				.sorted(Comparator.comparing(Tenant::getCode))
				.map(this::toTenantResponse)
				.toList();
	}

	public TenantResponse findTenantById(UUID id) {
		return tenantRepository.findById(id)
				.map(this::toTenantResponse)
				.orElseThrow(() -> new ResourceNotFoundException("Tenant not found: " + id));
	}

	public List<CompanyProfileResponse> findCompanyProfiles() {
		return companyProfileRepository.findAll().stream()
				.sorted(Comparator.comparing(CompanyProfile::getCode))
				.map(this::toCompanyProfileResponse)
				.toList();
	}

	public List<OfficeLocationResponse> findOfficeLocations() {
		return officeLocationRepository.findAll().stream()
				.sorted(Comparator.comparing(OfficeLocation::getCode))
				.map(this::toOfficeLocationResponse)
				.toList();
	}

	public List<SmtpConfigurationResponse> findSmtpConfigurations() {
		return smtpConfigurationRepository.findAll().stream()
				.sorted(Comparator.comparing(SmtpConfiguration::getCode))
				.map(this::toSmtpConfigurationResponse)
				.toList();
	}

	private TenantResponse toTenantResponse(Tenant tenant) {
		return new TenantResponse(
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

	private CompanyProfileResponse toCompanyProfileResponse(CompanyProfile companyProfile) {
		return new CompanyProfileResponse(
				companyProfile.getId(),
				toTenantReference(companyProfile.getTenant()),
				toCodeNameReference(companyProfile.getCompanyProfileType().getId(), companyProfile.getCompanyProfileType().getCode(), companyProfile.getCompanyProfileType().getName()),
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

	private OfficeLocationResponse toOfficeLocationResponse(OfficeLocation officeLocation) {
		return new OfficeLocationResponse(
				officeLocation.getId(),
				toTenantReference(officeLocation.getTenant()),
				toCompanyProfileReference(officeLocation.getCompanyProfile()),
				toCodeNameReference(officeLocation.getOfficeLocationType().getId(), officeLocation.getOfficeLocationType().getCode(), officeLocation.getOfficeLocationType().getName()),
				officeLocation.getCode(),
				officeLocation.getName(),
				officeLocation.getEmail(),
				officeLocation.getPhone(),
				toCountryReference(officeLocation.getCountry()),
				toRegionReference(officeLocation.getRegion()),
				toAreaReference(officeLocation.getArea()),
				toGlobalZipCodeReference(officeLocation.getGlobalZipCode()),
				officeLocation.getStreet(),
				officeLocation.getStreetNumber(),
				officeLocation.getActive(),
				officeLocation.getCreatedAt(),
				officeLocation.getUpdatedAt());
	}

	private SmtpConfigurationResponse toSmtpConfigurationResponse(SmtpConfiguration smtpConfiguration) {
		return new SmtpConfigurationResponse(
				smtpConfiguration.getId(),
				toTenantReference(smtpConfiguration.getTenant()),
				smtpConfiguration.getCode(),
				smtpConfiguration.getHost(),
				smtpConfiguration.getPort(),
				smtpConfiguration.getUsername(),
				toCodeNameReference(smtpConfiguration.getSmtpEncryptionType().getId(), smtpConfiguration.getSmtpEncryptionType().getCode(), smtpConfiguration.getSmtpEncryptionType().getName()),
				smtpConfiguration.getSenderEmail(),
				smtpConfiguration.getSenderName(),
				smtpConfiguration.getActive(),
				smtpConfiguration.getCreatedAt(),
				smtpConfiguration.getUpdatedAt());
	}

	private FoundationReferenceResponse toTenantReference(Tenant tenant) {
		return toCodeNameReference(tenant.getId(), tenant.getCode(), tenant.getName());
	}

	private FoundationReferenceResponse toCompanyProfileReference(CompanyProfile companyProfile) {
		return toCodeNameReference(companyProfile.getId(), companyProfile.getCode(), companyProfile.getLegalName());
	}

	private FoundationReferenceResponse toCountryReference(Country country) {
		return toCodeNameReference(country.getId(), country.getIsoCode(), country.getName());
	}

	private FoundationReferenceResponse toCurrencyReference(Currency currency) {
		return toCodeNameReference(currency.getId(), currency.getCode(), currency.getName());
	}

	private FoundationReferenceResponse toRegionReference(Region region) {
		return region == null ? null : toCodeNameReference(region.getId(), region.getCode(), region.getName());
	}

	private FoundationReferenceResponse toAreaReference(Area area) {
		return area == null ? null : toCodeNameReference(area.getId(), area.getCode(), area.getName());
	}

	private FoundationReferenceResponse toGlobalZipCodeReference(GlobalZipCode globalZipCode) {
		return globalZipCode == null ? null : toCodeNameReference(globalZipCode.getId(), globalZipCode.getPostalCode(), globalZipCode.getCity());
	}

	private FoundationReferenceResponse toCodeNameReference(UUID id, String code, String name) {
		return new FoundationReferenceResponse(id, code, name);
	}
}
