package com.odsoftware.hrm.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.http.HttpMethod;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authorization.AuthorizationManager;
import org.springframework.security.authorization.AuthorityAuthorizationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.RequestAuthorizationContext;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import com.odsoftware.hrm.security.JsonAccessDeniedHandler;
import com.odsoftware.hrm.security.JsonAuthenticationEntryPoint;
import com.odsoftware.hrm.security.PermissionAuthorityService;
import java.util.UUID;

@Configuration
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {

	private final JsonAuthenticationEntryPoint authenticationEntryPoint;
	private final JsonAccessDeniedHandler accessDeniedHandler;
	private final PermissionAuthorityService permissionAuthorityService;

	public SecurityConfig(
			JsonAuthenticationEntryPoint authenticationEntryPoint,
			JsonAccessDeniedHandler accessDeniedHandler,
			PermissionAuthorityService permissionAuthorityService) {
		this.authenticationEntryPoint = authenticationEntryPoint;
		this.accessDeniedHandler = accessDeniedHandler;
		this.permissionAuthorityService = permissionAuthorityService;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(AbstractHttpConfigurer::disable)
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(
								"/api/auth/login",
								"/v3/api-docs/**",
								"/swagger-ui/**",
								"/swagger-ui.html")
						.permitAll()
						.requestMatchers("/api/auth/me", "/actuator/**")
						.authenticated()
						.requestMatchers(HttpMethod.GET, "/api/admin/tenants/**")
						.access(hasAnyAuthority(
								"PLATFORM.TENANT.READ",
								"PLATFORM.TENANT.MANAGE"))
						.requestMatchers(HttpMethod.POST, "/api/admin/tenants/**")
						.access(hasAnyAuthority(
								"PLATFORM.TENANT.CREATE",
								"PLATFORM.TENANT.MANAGE"))
						.requestMatchers(HttpMethod.PUT, "/api/admin/tenants/**")
						.access(hasAnyAuthority(
								"PLATFORM.TENANT.UPDATE",
								"PLATFORM.TENANT.MANAGE"))
						.requestMatchers(HttpMethod.DELETE, "/api/admin/tenants/**")
						.access(hasAnyAuthority(
								"PLATFORM.TENANT.DELETE",
								"PLATFORM.TENANT.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/admin/users/**")
						.access(hasAnyAuthority(
								"TENANT.USER.READ",
								"TENANT.USER.MANAGE",
								"PLATFORM.USER.READ",
								"PLATFORM.USER.MANAGE"))
						.requestMatchers(HttpMethod.POST, "/api/admin/users/**")
						.access(hasAnyAuthority(
								"TENANT.USER.CREATE",
								"TENANT.USER.MANAGE",
								"PLATFORM.USER.CREATE",
								"PLATFORM.USER.MANAGE"))
						.requestMatchers(HttpMethod.PUT, "/api/admin/users/**")
						.access(hasAnyAuthority(
								"TENANT.USER.UPDATE",
								"TENANT.USER.MANAGE",
								"PLATFORM.USER.UPDATE",
								"PLATFORM.USER.MANAGE"))
						.requestMatchers(HttpMethod.PATCH, "/api/admin/users/**")
						.access(hasAnyAuthority(
								"TENANT.USER.UPDATE",
								"TENANT.USER.MANAGE",
								"PLATFORM.USER.UPDATE",
								"PLATFORM.USER.MANAGE"))
						.requestMatchers(HttpMethod.DELETE, "/api/admin/users/**")
						.access(hasAnyAuthority(
								"TENANT.USER.DELETE",
								"TENANT.USER.MANAGE",
								"PLATFORM.USER.DELETE",
								"PLATFORM.USER.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/admin/company-profiles/**")
						.access(hasAnyAuthority(
								"TENANT.COMPANY_PROFILE.READ",
								"PLATFORM.COMPANY_PROFILE.READ"))
						.requestMatchers(HttpMethod.POST, "/api/admin/company-profiles/**")
						.access(hasAnyAuthority(
								"TENANT.COMPANY_PROFILE.CREATE",
								"PLATFORM.COMPANY_PROFILE.CREATE"))
						.requestMatchers(HttpMethod.PUT, "/api/admin/company-profiles/**")
						.access(hasAnyAuthority(
								"TENANT.COMPANY_PROFILE.UPDATE",
								"PLATFORM.COMPANY_PROFILE.UPDATE"))
						.requestMatchers(HttpMethod.DELETE, "/api/admin/company-profiles/**")
						.access(hasAnyAuthority(
								"TENANT.COMPANY_PROFILE.DELETE",
								"PLATFORM.COMPANY_PROFILE.DELETE"))
						.requestMatchers(HttpMethod.GET, "/api/admin/devices/**")
						.access(hasAnyAuthority(
								"TENANT.DEVICE.READ",
								"TENANT.DEVICE.MANAGE",
								"PLATFORM.DEVICE.READ",
								"PLATFORM.DEVICE.MANAGE"))
						.requestMatchers(
								PathPatternRequestMatcher.pathPattern(HttpMethod.POST, "/api/admin/devices/{deviceId}/assignments"),
								PathPatternRequestMatcher.pathPattern(HttpMethod.POST, "/api/admin/devices/{deviceId}/assignments/return"))
						.access(hasAnyAuthority(
								"TENANT.DEVICE.UPDATE",
								"TENANT.DEVICE.MANAGE",
								"PLATFORM.DEVICE.UPDATE",
								"PLATFORM.DEVICE.MANAGE"))
						.requestMatchers(HttpMethod.POST, "/api/admin/devices/**")
						.access(hasAnyAuthority(
								"TENANT.DEVICE.CREATE",
								"TENANT.DEVICE.MANAGE",
								"PLATFORM.DEVICE.CREATE",
								"PLATFORM.DEVICE.MANAGE"))
						.requestMatchers(HttpMethod.PUT, "/api/admin/devices/**")
						.access(hasAnyAuthority(
								"TENANT.DEVICE.UPDATE",
								"TENANT.DEVICE.MANAGE",
								"PLATFORM.DEVICE.UPDATE",
								"PLATFORM.DEVICE.MANAGE"))
						.requestMatchers(HttpMethod.DELETE, "/api/admin/devices/**")
						.access(hasAnyAuthority(
								"TENANT.DEVICE.DELETE",
								"TENANT.DEVICE.MANAGE",
								"PLATFORM.DEVICE.DELETE",
								"PLATFORM.DEVICE.MANAGE"))
						.requestMatchers(
								HttpMethod.GET,
								"/api/admin/holiday-calendars",
								"/api/admin/holiday-calendars/",
								"/api/admin/holiday-calendars/*",
								"/api/admin/holiday-calendars/*/holidays",
								"/api/admin/holiday-calendars/*/holidays/",
								"/api/admin/holiday-calendars/*/holidays/*")
						.access(hasAnyAuthority(
								"TENANT.HOLIDAY_CALENDAR.READ",
								"TENANT.HOLIDAY_CALENDAR.MANAGE",
								"PLATFORM.HOLIDAY_CALENDAR.READ",
								"PLATFORM.HOLIDAY_CALENDAR.MANAGE"))
						.requestMatchers(
								HttpMethod.POST,
								"/api/admin/holiday-calendars/*/holidays",
								"/api/admin/holiday-calendars/*/holidays/")
						.access(hasAnyAuthority(
								"TENANT.HOLIDAY_CALENDAR.UPDATE",
								"TENANT.HOLIDAY_CALENDAR.MANAGE",
								"PLATFORM.HOLIDAY_CALENDAR.UPDATE",
								"PLATFORM.HOLIDAY_CALENDAR.MANAGE"))
						.requestMatchers(
								HttpMethod.POST,
								"/api/admin/holiday-calendars",
								"/api/admin/holiday-calendars/")
						.access(hasAnyAuthority(
								"TENANT.HOLIDAY_CALENDAR.CREATE",
								"TENANT.HOLIDAY_CALENDAR.MANAGE",
								"PLATFORM.HOLIDAY_CALENDAR.CREATE",
								"PLATFORM.HOLIDAY_CALENDAR.MANAGE"))
						.requestMatchers(
								HttpMethod.PUT,
								"/api/admin/holiday-calendars/*",
								"/api/admin/holiday-calendars/*/activate",
								"/api/admin/holiday-calendars/*/deactivate",
								"/api/admin/holiday-calendars/*/holidays/*")
						.access(hasAnyAuthority(
								"TENANT.HOLIDAY_CALENDAR.UPDATE",
								"TENANT.HOLIDAY_CALENDAR.MANAGE",
								"PLATFORM.HOLIDAY_CALENDAR.UPDATE",
								"PLATFORM.HOLIDAY_CALENDAR.MANAGE"))
						.requestMatchers(
								HttpMethod.DELETE,
								"/api/admin/holiday-calendars/*",
								"/api/admin/holiday-calendars/*/holidays/*")
						.access(hasAnyAuthority(
								"TENANT.HOLIDAY_CALENDAR.DELETE",
								"TENANT.HOLIDAY_CALENDAR.MANAGE",
								"PLATFORM.HOLIDAY_CALENDAR.DELETE",
								"PLATFORM.HOLIDAY_CALENDAR.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/admin/roles/**")
						.access(hasAnyAuthority(
								"TENANT.ROLE.READ",
								"TENANT.ROLE.MANAGE",
								"PLATFORM.ROLE.READ",
								"PLATFORM.ROLE.MANAGE"))
						.requestMatchers(HttpMethod.POST, "/api/admin/roles/**")
						.access(hasAnyAuthority(
								"TENANT.ROLE.CREATE",
								"TENANT.ROLE.MANAGE",
								"PLATFORM.ROLE.CREATE",
								"PLATFORM.ROLE.MANAGE"))
						.requestMatchers(HttpMethod.PUT, "/api/admin/roles/**")
						.access(hasAnyAuthority(
								"TENANT.ROLE.UPDATE",
								"TENANT.ROLE.MANAGE",
								"PLATFORM.ROLE.UPDATE",
								"PLATFORM.ROLE.MANAGE"))
						.requestMatchers(HttpMethod.DELETE, "/api/admin/roles/**")
						.access(hasAnyAuthority(
								"TENANT.ROLE.DELETE",
								"TENANT.ROLE.MANAGE",
								"PLATFORM.ROLE.DELETE",
								"PLATFORM.ROLE.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/master-data/global/**", "/api/master-data/hr-business/**", "/api/master-data/governance-security/**")
						.access(hasAnyAuthority(
								"TENANT.MASTER_DATA.READ",
								"TENANT.MASTER_DATA.MANAGE",
								"PLATFORM.MASTER_DATA.READ",
								"PLATFORM.MASTER_DATA.MANAGE"))
						.requestMatchers(HttpMethod.POST, "/api/master-data/global/**", "/api/master-data/hr-business/**", "/api/master-data/governance-security/**")
						.access(hasAnyAuthority(
								"TENANT.MASTER_DATA.CREATE",
								"TENANT.MASTER_DATA.MANAGE",
								"PLATFORM.MASTER_DATA.CREATE",
								"PLATFORM.MASTER_DATA.MANAGE"))
						.requestMatchers(HttpMethod.PUT, "/api/master-data/global/**", "/api/master-data/hr-business/**", "/api/master-data/governance-security/**")
						.access(hasAnyAuthority(
								"TENANT.MASTER_DATA.UPDATE",
								"TENANT.MASTER_DATA.MANAGE",
								"PLATFORM.MASTER_DATA.UPDATE",
								"PLATFORM.MASTER_DATA.MANAGE"))
						.requestMatchers(HttpMethod.DELETE, "/api/master-data/global/**", "/api/master-data/hr-business/**", "/api/master-data/governance-security/**")
						.access(hasAnyAuthority(
								"TENANT.MASTER_DATA.DELETE",
								"TENANT.MASTER_DATA.MANAGE",
								"PLATFORM.MASTER_DATA.DELETE",
								"PLATFORM.MASTER_DATA.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/core-hr/employees", "/api/core-hr/employees/*")
						.access(hasAnyAuthority("TENANT.EMPLOYEE.READ", "TENANT.EMPLOYEE.MANAGE", "PLATFORM.EMPLOYEE.READ", "PLATFORM.EMPLOYEE.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/core-hr/contracts", "/api/core-hr/contracts/*")
						.access(hasAnyAuthority("TENANT.CONTRACT.READ", "TENANT.CONTRACT.MANAGE", "PLATFORM.CONTRACT.READ", "PLATFORM.CONTRACT.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/core-hr/devices", "/api/core-hr/devices/*")
						.access(hasAnyAuthority("TENANT.DEVICE.READ", "TENANT.DEVICE.MANAGE", "PLATFORM.DEVICE.READ", "PLATFORM.DEVICE.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/core-hr/payroll-documents", "/api/core-hr/payroll-documents/*")
						.access(hasAnyAuthority("TENANT.PAYROLL_DOCUMENT.READ", "TENANT.PAYROLL_DOCUMENT.MANAGE", "PLATFORM.PAYROLL_DOCUMENT.READ", "PLATFORM.PAYROLL_DOCUMENT.MANAGE"))
						.requestMatchers(HttpMethod.GET, "/api/core-hr/leave-requests", "/api/core-hr/leave-requests/*")
						.access(hasAnyAuthority("TENANT.LEAVE_REQUEST.READ", "TENANT.LEAVE_REQUEST.MANAGE", "PLATFORM.LEAVE_REQUEST.READ", "PLATFORM.LEAVE_REQUEST.MANAGE"))
						.requestMatchers("/api/core-hr/holiday-calendars/**", "/api/core-hr/audit-logs/**", "/api/core-hr/employee-disciplinary-actions/**", "/api/foundation/**")
						.denyAll()
						.anyRequest()
						.denyAll())
				.httpBasic(AbstractHttpConfigurer::disable)
				.formLogin(AbstractHttpConfigurer::disable)
				.logout(AbstractHttpConfigurer::disable)
				.exceptionHandling(exceptionHandling -> exceptionHandling
						.authenticationEntryPoint(authenticationEntryPoint)
						.accessDeniedHandler(accessDeniedHandler))
				.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())))
				.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public JwtEncoder jwtEncoder(JwtProperties jwtProperties) {
		return new NimbusJwtEncoder(new ImmutableSecret<>(secretKey(jwtProperties)));
	}

	@Bean
	public JwtDecoder jwtDecoder(JwtProperties jwtProperties) {
		return NimbusJwtDecoder
				.withSecretKey(secretKey(jwtProperties))
				.macAlgorithm(MacAlgorithm.HS256)
				.build();
	}

	private JwtAuthenticationConverter jwtAuthenticationConverter() {
		JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
		converter.setJwtGrantedAuthoritiesConverter(userTypeAuthorityConverter());
		return converter;
	}

	private Converter<Jwt, Collection<GrantedAuthority>> userTypeAuthorityConverter() {
		return jwt -> {
			String userType = jwt.getClaimAsString("userType");
			String userId = jwt.getClaimAsString("userId");
			String tenantId = jwt.getClaimAsString("tenantId");
			if (userType == null || userType.isBlank() || userId == null || tenantId == null) {
				return List.of();
			}
			return permissionAuthorityService.resolveAuthorities(
					UUID.fromString(userId),
					UUID.fromString(tenantId),
					userType);
		};
	}

	private AuthorizationManager<RequestAuthorizationContext> hasAnyAuthority(String... authorities) {
		return AuthorityAuthorizationManager.hasAnyAuthority(authorities);
	}

	private SecretKey secretKey(JwtProperties jwtProperties) {
		byte[] secret = jwtProperties.secret().getBytes(StandardCharsets.UTF_8);
		if (secret.length < 32) {
			throw new IllegalStateException("JWT secret must contain at least 32 bytes");
		}
		return new SecretKeySpec(secret, "HmacSHA256");
	}
}
