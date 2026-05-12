package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.auth.AuthenticatedUserResponse;
import com.odsoftware.hrm.dto.auth.LoginRequest;
import com.odsoftware.hrm.dto.auth.LoginResponse;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.exception.AuthenticationFailedException;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.rbac.UserRoleRepository;
import com.odsoftware.hrm.repository.rbac.UserTenantAccessRepository;
import com.odsoftware.hrm.security.HrmUserDetails;
import com.odsoftware.hrm.security.JwtService;
import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

	private static final String AUTHENTICATION_FAILED_MESSAGE = "Invalid email or password";
	private static final String ACCOUNT_INACTIVE_MESSAGE = "Account inactive";
	private static final String ACCOUNT_LOCKED_MESSAGE = "Account locked";
	private static final String AUTHENTICATION_FAILED_CODE = "AUTH_INVALID_CREDENTIALS";
	private static final String ACCOUNT_INACTIVE_CODE = "AUTH_ACCOUNT_INACTIVE";
	private static final String ACCOUNT_LOCKED_CODE = "AUTH_ACCOUNT_LOCKED";
	private static final String TOKEN_TYPE = "Bearer";
	private static final String USER_TYPE_AUTHORITY_PREFIX = "USER_TYPE_";

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UserAccountRepository userAccountRepository;
	private final UserRoleRepository userRoleRepository;
	private final UserTenantAccessRepository userTenantAccessRepository;
	private final PasswordEncoder passwordEncoder;

	public AuthService(
			AuthenticationManager authenticationManager,
			JwtService jwtService,
			UserAccountRepository userAccountRepository,
			UserRoleRepository userRoleRepository,
			UserTenantAccessRepository userTenantAccessRepository,
			PasswordEncoder passwordEncoder) {
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.userAccountRepository = userAccountRepository;
		this.userRoleRepository = userRoleRepository;
		this.userTenantAccessRepository = userTenantAccessRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public LoginResponse login(LoginRequest request) {
		String email = normalizeEmail(request == null ? null : request.email());
		String password = request == null ? null : request.password();
		if (email.isBlank() || password == null || password.isBlank()) {
			throw invalidCredentials();
		}

		UserAccount userAccount = userAccountRepository.findByEmailIgnoreCase(email)
				.orElseThrow(this::invalidCredentials);
		if (userAccount.getPasswordHash() == null || userAccount.getPasswordHash().isBlank()) {
			throw invalidCredentials();
		}
		if (!passwordEncoder.matches(password, userAccount.getPasswordHash())) {
			throw invalidCredentials();
		}
		if (!Boolean.TRUE.equals(userAccount.getActive())) {
			throw new AuthenticationFailedException(ACCOUNT_INACTIVE_MESSAGE, ACCOUNT_INACTIVE_CODE);
		}
		if (Boolean.TRUE.equals(userAccount.getLocked())) {
			throw new AuthenticationFailedException(ACCOUNT_LOCKED_MESSAGE, ACCOUNT_LOCKED_CODE);
		}
		try {
			Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
			HrmUserDetails userDetails = (HrmUserDetails) authentication.getPrincipal();
			updateLastLoginAt(userDetails.id());
			return new LoginResponse(
					jwtService.generateAccessToken(userDetails),
					TOKEN_TYPE,
					jwtService.expiresIn(),
					toUserResponse(userDetails));
		} catch (AuthenticationException exception) {
			throw invalidCredentials();
		}
	}

	public AuthenticatedUserResponse me(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof Jwt jwt)) {
			throw new AuthenticationFailedException("Authentication required");
		}
		return toUserResponse(
				UUID.fromString(jwt.getClaimAsString("userId")),
				UUID.fromString(jwt.getClaimAsString("tenantId")),
				normalizeEmail(jwt.getSubject()),
				jwt.getClaimAsString("userType"));
	}

	private void updateLastLoginAt(UUID userId) {
		UserAccount userAccount = userAccountRepository.findById(userId)
				.orElseThrow(() -> new AuthenticationFailedException(AUTHENTICATION_FAILED_MESSAGE));
		userAccount.setLastLoginAt(OffsetDateTime.now());
	}

	private AuthenticatedUserResponse toUserResponse(HrmUserDetails userDetails) {
		return toUserResponse(
				userDetails.id(),
				userDetails.tenantId(),
				userDetails.email(),
				userDetails.userType());
	}

	private AuthenticatedUserResponse toUserResponse(UUID userId, UUID tenantId, String email, String userType) {
		List<String> grantedPermissionCodes = resolveGrantedPermissionCodes(userId, tenantId);
		List<String> authorities = buildAuthorities(userType, grantedPermissionCodes);
		List<String> permissions = buildFrontendPermissions(grantedPermissionCodes);
		return new AuthenticatedUserResponse(
				userId,
				tenantId,
				email,
				userType,
				authorities,
				permissions);
	}

	private List<String> resolveGrantedPermissionCodes(UUID userId, UUID tenantId) {
		if (!userTenantAccessRepository.existsByUserAccount_IdAndTenant_IdAndActiveTrue(userId, tenantId)) {
			return List.of();
		}
		return userRoleRepository.findGrantedPermissionCodesByUserAccountIdAndTenantId(userId, tenantId);
	}

	private List<String> buildAuthorities(String userType, List<String> grantedPermissionCodes) {
		LinkedHashSet<String> authorities = new LinkedHashSet<>();
		authorities.add(USER_TYPE_AUTHORITY_PREFIX + userType);
		authorities.addAll(grantedPermissionCodes);
		return List.copyOf(authorities);
	}

	private List<String> buildFrontendPermissions(List<String> grantedPermissionCodes) {
		LinkedHashSet<String> permissions = new LinkedHashSet<>();
		for (String code : grantedPermissionCodes) {
			String normalizedPermissionCode = normalizeFrontendPermissionCode(code);
			if (normalizedPermissionCode != null) {
				permissions.add(normalizedPermissionCode);
			}
		}
		return List.copyOf(permissions);
	}

	private String normalizeFrontendPermissionCode(String code) {
		if (code == null || code.isBlank()) {
			return null;
		}

		String[] parts = code.trim().toUpperCase(Locale.ROOT).split("\\.");
		if (parts.length != 3) {
			return null;
		}

		String action = switch (parts[2]) {
			case "READ" -> "VIEW";
			case "CREATE", "UPDATE", "DELETE" -> parts[2];
			default -> null;
		};
		if (action == null) {
			return null;
		}

		return parts[0] + "." + parts[1] + "." + action;
	}

	private String normalizeEmail(String email) {
		if (email == null) {
			return "";
		}
		return email.trim().toLowerCase(Locale.ROOT);
	}

	private AuthenticationFailedException invalidCredentials() {
		return new AuthenticationFailedException(AUTHENTICATION_FAILED_MESSAGE, AUTHENTICATION_FAILED_CODE);
	}
}
