package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.masterdata.MasterDataPageResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationCompanyProfileResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationEmployeeResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationReferenceResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationRoleResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationTenantAccessResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserDetailResponse;
import com.odsoftware.hrm.dto.useradministration.UserAdministrationUserListItemResponse;
import com.odsoftware.hrm.entity.core.CompanyProfile;
import com.odsoftware.hrm.entity.core.Tenant;
import com.odsoftware.hrm.entity.employee.Employee;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import com.odsoftware.hrm.entity.master.Role;
import com.odsoftware.hrm.entity.master.TimeZone;
import com.odsoftware.hrm.entity.master.UserType;
import com.odsoftware.hrm.entity.rbac.UserRole;
import com.odsoftware.hrm.entity.rbac.UserTenantAccess;
import com.odsoftware.hrm.exception.ResourceNotFoundException;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import jakarta.persistence.criteria.Predicate;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserAdministrationService {

	private final UserAccountRepository userAccountRepository;
	private final UserRoleRepository userRoleRepository;
	private final UserTenantAccessRepository userTenantAccessRepository;

	public UserAdministrationService(
			UserAccountRepository userAccountRepository,
			UserRoleRepository userRoleRepository,
			UserTenantAccessRepository userTenantAccessRepository) {
		this.userAccountRepository = userAccountRepository;
		this.userRoleRepository = userRoleRepository;
		this.userTenantAccessRepository = userTenantAccessRepository;
	}

	public MasterDataPageResponse<UserAdministrationUserListItemResponse> findUsers(UUID tenantId, Integer page, Integer size, String search) {
		Page<UserAccount> userPage = userAccountRepository.findAll(
				userSpecification(tenantId, search),
				MasterDataQuerySupport.buildPageable(
						page,
						size,
						MasterDataQuerySupport.defaultNewestFirstSort(Sort.by("email"))));
		List<UUID> userIds = userPage.getContent().stream().map(UserAccount::getId).toList();
		Map<UUID, List<UserAdministrationRoleResponse>> rolesByUserId = rolesByUserId(userIds);
		Map<UUID, List<UserAdministrationTenantAccessResponse>> accessesByUserId = accessesByUserId(userIds);

		return MasterDataQuerySupport.toPageResponse(userPage, user -> toListItemResponse(
				user,
				rolesByUserId.getOrDefault(user.getId(), List.of()),
				accessesByUserId.getOrDefault(user.getId(), List.of())));
	}

	public UserAdministrationUserDetailResponse findUserById(UUID userId) {
		UserAccount user = userAccountRepository.findWithAdministrationGraphById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User account not found: " + userId));
		List<UserAdministrationRoleResponse> roles = userRoleRepository.findWithRoleAndTenantByUserAccountId(userId).stream()
				.map(this::toRoleResponse)
				.toList();
		List<UserAdministrationTenantAccessResponse> tenantAccesses = userTenantAccessRepository.findWithTenantByUserAccountId(userId).stream()
				.map(this::toTenantAccessResponse)
				.toList();
		return toDetailResponse(user, roles, tenantAccesses);
	}

	private Specification<UserAccount> userSpecification(UUID tenantId, String search) {
		Specification<UserAccount> searchSpecification = MasterDataQuerySupport.searchSpecification(
				search,
				"email",
				"employee.firstName",
				"employee.lastName",
				"userType.code",
				"tenant.code",
				"tenant.name",
				"companyProfile.code",
				"companyProfile.legalName",
				"companyProfile.tradeName");
		if (tenantId == null) {
			return searchSpecification;
		}

		return (root, query, criteriaBuilder) -> {
			Predicate tenantPredicate = criteriaBuilder.equal(root.get("tenant").get("id"), tenantId);
			if (searchSpecification == null) {
				return tenantPredicate;
			}

			Predicate searchPredicate = searchSpecification.toPredicate(root, query, criteriaBuilder);
			return searchPredicate == null ? tenantPredicate : criteriaBuilder.and(tenantPredicate, searchPredicate);
		};
	}

	private Map<UUID, List<UserAdministrationRoleResponse>> rolesByUserId(Collection<UUID> userIds) {
		if (userIds.isEmpty()) {
			return Map.of();
		}

		return userRoleRepository.findWithRoleAndTenantByUserAccountIds(userIds).stream()
				.collect(Collectors.groupingBy(
						userRole -> userRole.getUserAccount().getId(),
						Collectors.mapping(this::toRoleResponse, Collectors.toList())));
	}

	private Map<UUID, List<UserAdministrationTenantAccessResponse>> accessesByUserId(Collection<UUID> userIds) {
		if (userIds.isEmpty()) {
			return Map.of();
		}

		return userTenantAccessRepository.findWithTenantByUserAccountIds(userIds).stream()
				.collect(Collectors.groupingBy(
						access -> access.getUserAccount().getId(),
						Collectors.mapping(this::toTenantAccessResponse, Collectors.toList())));
	}

	private UserAdministrationUserListItemResponse toListItemResponse(
			UserAccount user,
			List<UserAdministrationRoleResponse> roles,
			List<UserAdministrationTenantAccessResponse> tenantAccesses) {
		Employee employee = user.getEmployee();
		return new UserAdministrationUserListItemResponse(
				user.getId(),
				displayName(user),
				employee == null ? null : employee.getFirstName(),
				employee == null ? null : employee.getLastName(),
				user.getEmail(),
				toUserTypeResponse(user.getUserType()),
				toTenantResponse(user.getTenant()),
				toCompanyProfileResponse(user.getCompanyProfile()),
				user.getActive(),
				user.getLocked(),
				sortedRoles(roles),
				sortedTenantAccesses(tenantAccesses),
				user.getCreatedAt(),
				user.getUpdatedAt());
	}

	private UserAdministrationUserDetailResponse toDetailResponse(
			UserAccount user,
			List<UserAdministrationRoleResponse> roles,
			List<UserAdministrationTenantAccessResponse> tenantAccesses) {
		Employee employee = user.getEmployee();
		return new UserAdministrationUserDetailResponse(
				user.getId(),
				user.getEmail(),
				displayName(user),
				employee == null ? null : employee.getFirstName(),
				employee == null ? null : employee.getLastName(),
				toTenantResponse(user.getTenant()),
				toTenantResponse(user.getPrimaryTenant()),
				toCompanyProfileResponse(user.getCompanyProfile()),
				toEmployeeResponse(employee),
				toUserTypeResponse(user.getUserType()),
				toAuthenticationMethodResponse(user.getAuthenticationMethod()),
				user.getPreferredLanguage(),
				toTimeZoneResponse(user.getTimeZone()),
				user.getActive(),
				user.getLocked(),
				user.getEmailVerifiedAt(),
				user.getPasswordChangedAt(),
				user.getLastLoginAt(),
				user.getFailedLoginAttempts(),
				user.getEmailOtpEnabled(),
				user.getAppOtpEnabled(),
				user.getStrongAuthenticationRequired(),
				sortedRoles(roles),
				sortedTenantAccesses(tenantAccesses),
				user.getCreatedAt(),
				user.getUpdatedAt());
	}

	private UserAdministrationRoleResponse toRoleResponse(UserRole userRole) {
		Role role = userRole.getRole();
		Tenant tenant = userRole.getTenant();
		return new UserAdministrationRoleResponse(
				role.getId(),
				tenant.getId(),
				tenant.getCode(),
				tenant.getName(),
				role.getCode(),
				role.getName(),
				role.getSystemRole(),
				role.getActive());
	}

	private UserAdministrationTenantAccessResponse toTenantAccessResponse(UserTenantAccess tenantAccess) {
		Tenant tenant = tenantAccess.getTenant();
		return new UserAdministrationTenantAccessResponse(
				tenantAccess.getId(),
				tenant.getId(),
				tenant.getCode(),
				tenant.getName(),
				tenantAccess.getAccessRole(),
				tenantAccess.getActive(),
				tenantAccess.getCreatedAt(),
				tenantAccess.getUpdatedAt());
	}

	private UserAdministrationReferenceResponse toTenantResponse(Tenant tenant) {
		return tenant == null ? null : new UserAdministrationReferenceResponse(tenant.getId(), tenant.getCode(), tenant.getName());
	}

	private UserAdministrationReferenceResponse toUserTypeResponse(UserType userType) {
		return userType == null ? null : new UserAdministrationReferenceResponse(userType.getId(), userType.getCode(), userType.getName());
	}

	private UserAdministrationReferenceResponse toAuthenticationMethodResponse(AuthenticationMethod authenticationMethod) {
		return authenticationMethod == null
				? null
				: new UserAdministrationReferenceResponse(authenticationMethod.getId(), authenticationMethod.getCode(), authenticationMethod.getName());
	}

	private UserAdministrationReferenceResponse toTimeZoneResponse(TimeZone timeZone) {
		return timeZone == null ? null : new UserAdministrationReferenceResponse(timeZone.getId(), timeZone.getCode(), timeZone.getName());
	}

	private UserAdministrationCompanyProfileResponse toCompanyProfileResponse(CompanyProfile companyProfile) {
		return companyProfile == null
				? null
				: new UserAdministrationCompanyProfileResponse(
						companyProfile.getId(),
						companyProfile.getCode(),
						companyProfile.getLegalName(),
						companyProfile.getTradeName());
	}

	private UserAdministrationEmployeeResponse toEmployeeResponse(Employee employee) {
		return employee == null
				? null
				: new UserAdministrationEmployeeResponse(
						employee.getId(),
						employee.getEmployeeCode(),
						employee.getFirstName(),
						employee.getLastName(),
						employee.getEmail());
	}

	private String displayName(UserAccount user) {
		Employee employee = user.getEmployee();
		if (employee == null) {
			return user.getEmail();
		}

		String displayName = (safe(employee.getFirstName()) + " " + safe(employee.getLastName())).trim();
		return displayName.isEmpty() ? user.getEmail() : displayName;
	}

	private List<UserAdministrationRoleResponse> sortedRoles(List<UserAdministrationRoleResponse> roles) {
		return roles.stream()
				.sorted(Comparator.comparing(UserAdministrationRoleResponse::code))
				.toList();
	}

	private List<UserAdministrationTenantAccessResponse> sortedTenantAccesses(List<UserAdministrationTenantAccessResponse> tenantAccesses) {
		return tenantAccesses.stream()
				.sorted(Comparator.comparing(UserAdministrationTenantAccessResponse::tenantCode))
				.toList();
	}

	private String safe(String value) {
		return value == null ? "" : value;
	}
}
