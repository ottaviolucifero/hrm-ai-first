package com.odsoftware.hrm.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.List;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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

@Configuration
@EnableConfigurationProperties(JwtProperties.class)
public class SecurityConfig {

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
						.anyRequest()
						.authenticated())
				.httpBasic(AbstractHttpConfigurer::disable)
				.formLogin(AbstractHttpConfigurer::disable)
				.logout(AbstractHttpConfigurer::disable)
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
			if (userType == null || userType.isBlank()) {
				return List.of();
			}
			return List.of(new SimpleGrantedAuthority("USER_TYPE_" + userType));
		};
	}

	private SecretKey secretKey(JwtProperties jwtProperties) {
		byte[] secret = jwtProperties.secret().getBytes(StandardCharsets.UTF_8);
		if (secret.length < 32) {
			throw new IllegalStateException("JWT secret must contain at least 32 bytes");
		}
		return new SecretKeySpec(secret, "HmacSHA256");
	}
}
