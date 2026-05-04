package com.odsoftware.hrm.service;

import com.odsoftware.hrm.dto.auth.AuthenticatedUserResponse;
import com.odsoftware.hrm.dto.auth.LoginRequest;
import com.odsoftware.hrm.dto.auth.LoginResponse;
import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.exception.AuthenticationFailedException;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.security.HrmUserDetails;
import com.odsoftware.hrm.security.JwtService;
import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AuthService {

	private static final String AUTHENTICATION_FAILED_MESSAGE = "Invalid email or password";
	private static final String TOKEN_TYPE = "Bearer";

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UserAccountRepository userAccountRepository;

	public AuthService(
			AuthenticationManager authenticationManager,
			JwtService jwtService,
			UserAccountRepository userAccountRepository) {
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.userAccountRepository = userAccountRepository;
	}

	@Transactional
	public LoginResponse login(LoginRequest request) {
		String email = normalizeEmail(request == null ? null : request.email());
		String password = request == null ? null : request.password();
		if (email.isBlank() || password == null || password.isBlank()) {
			throw new AuthenticationFailedException(AUTHENTICATION_FAILED_MESSAGE);
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
			throw new AuthenticationFailedException(AUTHENTICATION_FAILED_MESSAGE);
		}
	}

	public AuthenticatedUserResponse me(Authentication authentication) {
		if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof Jwt jwt)) {
			throw new AuthenticationFailedException("Authentication required");
		}
		return new AuthenticatedUserResponse(
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
		return new AuthenticatedUserResponse(
				userDetails.id(),
				userDetails.tenantId(),
				userDetails.email(),
				userDetails.userType());
	}

	private String normalizeEmail(String email) {
		if (email == null) {
			return "";
		}
		return email.trim().toLowerCase(Locale.ROOT);
	}
}
