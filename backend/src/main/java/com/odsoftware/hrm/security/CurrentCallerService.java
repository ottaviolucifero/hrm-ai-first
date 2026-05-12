package com.odsoftware.hrm.security;

import java.util.UUID;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class CurrentCallerService {

	public CurrentCaller requireCurrentCaller() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof Jwt jwt)) {
			throw new AccessDeniedException("Caller authentication context is not available");
		}
		String userId = jwt.getClaimAsString("userId");
		String tenantId = jwt.getClaimAsString("tenantId");
		String userType = jwt.getClaimAsString("userType");
		if (userId == null || tenantId == null || userType == null || userType.isBlank()) {
			throw new AccessDeniedException("Caller authentication claims are not valid");
		}
		return new CurrentCaller(UUID.fromString(userId), UUID.fromString(tenantId), userType);
	}
}
