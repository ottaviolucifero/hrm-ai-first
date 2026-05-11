package com.odsoftware.hrm;

import com.odsoftware.hrm.entity.identity.UserAccount;
import com.odsoftware.hrm.repository.core.TenantRepository;
import com.odsoftware.hrm.repository.identity.UserAccountRepository;
import com.odsoftware.hrm.repository.master.AuthenticationMethodRepository;
import com.odsoftware.hrm.repository.master.UserTypeRepository;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class AuthControllerTests {

	private static final UUID FOUNDATION_TENANT_ID = UUID.fromString("00000000-0000-0000-0000-000000000001");
	private static final UUID TENANT_ADMIN_USER_TYPE_ID = UUID.fromString("70000000-0000-0000-0000-000000000003");
	private static final UUID PASSWORD_ONLY_AUTHENTICATION_METHOD_ID = UUID.fromString("71000000-0000-0000-0000-000000000001");
	private static final String VALID_PASSWORD = "Secret1!";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private UserAccountRepository userAccountRepository;

	@Autowired
	private TenantRepository tenantRepository;

	@Autowired
	private UserTypeRepository userTypeRepository;

	@Autowired
	private AuthenticationMethodRepository authenticationMethodRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	void loginWithValidEmailAndPasswordReturnsBearerToken() throws Exception {
		UserAccount userAccount = saveUser("task034.valid@example.com", VALID_PASSWORD, true, false, true);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.valid@example.com", VALID_PASSWORD))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accessToken").isString())
				.andExpect(jsonPath("$.tokenType").value("Bearer"))
				.andExpect(jsonPath("$.expiresIn").value(3600))
				.andExpect(jsonPath("$.user.id").value(userAccount.getId().toString()))
				.andExpect(jsonPath("$.user.tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.user.email").value("task034.valid@example.com"))
				.andExpect(jsonPath("$.user.userType").value("TENANT_ADMIN"));
	}

	@Test
	void loginWithDifferentEmailCaseReturnsBearerTokenWithNormalizedEmail() throws Exception {
		saveUser("task034.case@example.com", VALID_PASSWORD, true, false, true);

		MvcResult result = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("  TASK034.CASE@EXAMPLE.COM ", VALID_PASSWORD))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.user.email").value("task034.case@example.com"))
				.andReturn();

		String token = objectMapper.readTree(result.getResponse().getContentAsString()).get("accessToken").asText();
		assertThat(token).isNotBlank();
	}

	@Test
	void loginWithExistingPasswordBelowPolicyStillAuthenticates() throws Exception {
		String existingPassword = "abc";
		UserAccount userAccount = saveUser("task034.legacy.password@example.com", existingPassword, true, false, true);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.legacy.password@example.com", existingPassword))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accessToken").isString())
				.andExpect(jsonPath("$.user.id").value(userAccount.getId().toString()));
	}

	@Test
	void loginWithWrongPasswordReturnsUnauthorized() throws Exception {
		saveUser("task034.wrong.password@example.com", VALID_PASSWORD, true, false, true);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.wrong.password@example.com", "Wrong1!"))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid email or password"))
				.andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
	}

	@Test
	void loginWithUnknownEmailReturnsUnauthorized() throws Exception {
		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.unknown@example.com", VALID_PASSWORD))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid email or password"))
				.andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
	}

	@Test
	void loginWithAccountWithoutPasswordHashReturnsUnauthorized() throws Exception {
		saveUser("task034.no.password.hash@example.com", VALID_PASSWORD, true, false, false);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.no.password.hash@example.com", VALID_PASSWORD))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid email or password"))
				.andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
	}

	@Test
	void loginWithInactiveAccountReturnsUnauthorized() throws Exception {
		saveUser("task034.inactive@example.com", VALID_PASSWORD, false, false, true);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.inactive@example.com", VALID_PASSWORD))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Account inactive"))
				.andExpect(jsonPath("$.code").value("AUTH_ACCOUNT_INACTIVE"));
	}

	@Test
	void loginWithLockedAccountReturnsUnauthorized() throws Exception {
		saveUser("task034.locked@example.com", VALID_PASSWORD, true, true, true);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.locked@example.com", VALID_PASSWORD))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Account locked"))
				.andExpect(jsonPath("$.code").value("AUTH_ACCOUNT_LOCKED"));
	}

	@Test
	void loginWithInactiveAccountAndWrongPasswordStillReturnsGenericUnauthorized() throws Exception {
		saveUser("task034.inactive.wrong-password@example.com", VALID_PASSWORD, false, false, true);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.inactive.wrong-password@example.com", "Wrong1!"))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid email or password"))
				.andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
	}

	@Test
	void loginWithLockedAccountAndWrongPasswordStillReturnsGenericUnauthorized() throws Exception {
		saveUser("task034.locked.wrong-password@example.com", VALID_PASSWORD, true, true, true);

		mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest("task034.locked.wrong-password@example.com", "Wrong1!"))))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Invalid email or password"))
				.andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
	}

	@Test
	void meWithoutTokenReturnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/auth/me"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void meWithValidTokenReturnsAuthenticatedUser() throws Exception {
		UserAccount userAccount = saveUser("task034.me@example.com", VALID_PASSWORD, true, false, true);
		String token = loginAndReadToken("task034.me@example.com", VALID_PASSWORD);

		mockMvc.perform(get("/api/auth/me")
						.header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(userAccount.getId().toString()))
				.andExpect(jsonPath("$.tenantId").value(FOUNDATION_TENANT_ID.toString()))
				.andExpect(jsonPath("$.email").value("task034.me@example.com"))
				.andExpect(jsonPath("$.userType").value("TENANT_ADMIN"));
	}

	@Test
	void openApiRemainsPublicAndIncludesAuthEndpoints() throws Exception {
		mockMvc.perform(get("/v3/api-docs"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.paths['/api/auth/login']").exists())
				.andExpect(jsonPath("$.paths['/api/auth/me']").exists());
	}

	@Test
	void actuatorRemainsProtected() throws Exception {
		mockMvc.perform(get("/actuator"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void userAccountEmailUniqueConstraintIsGlobalAndCaseInsensitive() {
		saveUser("task034.unique@example.com", VALID_PASSWORD, true, false, true);

		assertThatThrownBy(() -> saveUser("TASK034.UNIQUE@example.com", VALID_PASSWORD, true, false, true))
				.isInstanceOf(DataIntegrityViolationException.class);
	}

	private String loginAndReadToken(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest(email, password))))
				.andExpect(status().isOk())
				.andReturn();
		return objectMapper.readTree(result.getResponse().getContentAsString()).get("accessToken").asText();
	}

	private Map<String, String> loginRequest(String email, String password) {
		Map<String, String> request = new LinkedHashMap<>();
		request.put("email", email);
		request.put("password", password);
		return request;
	}

	private UserAccount saveUser(String email, String password, boolean active, boolean locked, boolean withPasswordHash) {
		UserAccount userAccount = new UserAccount();
		userAccount.setTenant(tenantRepository.findById(FOUNDATION_TENANT_ID).orElseThrow());
		userAccount.setUserType(userTypeRepository.findById(TENANT_ADMIN_USER_TYPE_ID).orElseThrow());
		userAccount.setAuthenticationMethod(authenticationMethodRepository.findById(PASSWORD_ONLY_AUTHENTICATION_METHOD_ID).orElseThrow());
		userAccount.setEmail(email);
		userAccount.setPasswordHash(withPasswordHash ? passwordEncoder.encode(password) : null);
		userAccount.setActive(active);
		userAccount.setLocked(locked);
		return userAccountRepository.saveAndFlush(userAccount);
	}
}
