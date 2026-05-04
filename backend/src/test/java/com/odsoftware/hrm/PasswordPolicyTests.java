package com.odsoftware.hrm;

import com.odsoftware.hrm.security.PasswordPolicy;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PasswordPolicyTests {

	private final PasswordPolicy passwordPolicy = new PasswordPolicy();

	@Test
	void rejectsPasswordsShorterThanSixCharacters() {
		assertThat(passwordPolicy.isValid("A1!bc")).isFalse();
	}

	@Test
	void rejectsPasswordsWithoutLetter() {
		assertThat(passwordPolicy.isValid("123456!")).isFalse();
	}

	@Test
	void rejectsPasswordsWithoutNumber() {
		assertThat(passwordPolicy.isValid("Secret!")).isFalse();
	}

	@Test
	void rejectsPasswordsWithoutSymbol() {
		assertThat(passwordPolicy.isValid("Secret1")).isFalse();
	}

	@Test
	void acceptsPasswordWithLetterNumberAndSymbol() {
		assertThat(passwordPolicy.isValid("Secret1!")).isTrue();
	}
}
