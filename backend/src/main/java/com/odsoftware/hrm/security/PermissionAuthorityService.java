package com.odsoftware.hrm.security;

import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PermissionAuthorityService {

	private static final String USER_TYPE_AUTHORITY_PREFIX = "USER_TYPE_";

	private final UserAccountRepository userAccountRepository;
	private final UserTenantAccessRepository userTenantAccessRepository;
	private final UserRoleRepository userRoleRepository;

	public PermissionAuthorityService(
			UserAccountRepository userAccountRepository,
			UserTenantAccessRepository userTenantAccessRepository,
			UserRoleRepository userRoleRepository) {
		this.userAccountRepository = userAccountRepository;
		this.userTenantAccessRepository = userTenantAccessRepository;
		this.userRoleRepository = userRoleRepository;
	}

	@Transactional(readOnly = true)
	public List<GrantedAuthority> resolveAuthorities(UUID userId, UUID tenantId, String userType) {
		LinkedHashSet<GrantedAuthority> authorities = new LinkedHashSet<>();
		String normalizedUserType = normalize(userType);
		if (normalizedUserType != null) {
			authorities.add(new SimpleGrantedAuthority(USER_TYPE_AUTHORITY_PREFIX + normalizedUserType));
		}

		UserAccount userAccount = userAccountRepository.findById(userId).orElse(null);
		if (!isEligibleForRbac(userAccount)) {
			return List.copyOf(authorities);
		}
		if (!userTenantAccessRepository.existsByUserAccount_IdAndTenant_IdAndActiveTrue(userId, tenantId)) {
			return List.copyOf(authorities);
		}

		userRoleRepository.findGrantedPermissionCodesByUserAccountIdAndTenantId(userId, tenantId).stream()
				.map(PermissionAuthorityService::normalize)
				.filter(code -> code != null && !code.isBlank())
				.map(SimpleGrantedAuthority::new)
				.forEach(authorities::add);
		return List.copyOf(authorities);
	}

	private boolean isEligibleForRbac(UserAccount userAccount) {
		return userAccount != null
				&& Boolean.TRUE.equals(userAccount.getActive())
				&& !Boolean.TRUE.equals(userAccount.getLocked())
				&& userAccount.getDeletedAt() == null;
	}

	private static String normalize(String value) {
		if (value == null) {
			return null;
		}
		String normalized = value.trim().toUpperCase(Locale.ROOT);
		return normalized.isBlank() ? null : normalized;
	}
}
