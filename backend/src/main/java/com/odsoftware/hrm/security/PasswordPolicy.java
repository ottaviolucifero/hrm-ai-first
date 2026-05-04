package com.odsoftware.hrm.security;

import org.springframework.stereotype.Component;

@Component
public class PasswordPolicy {

	private static final int MIN_LENGTH = 6;

	public boolean isValid(String password) {
		if (password == null || password.isBlank() || password.length() < MIN_LENGTH) {
			return false;
		}
		boolean hasLetter = false;
		boolean hasDigit = false;
		boolean hasSymbol = false;
		for (int index = 0; index < password.length(); index++) {
			char current = password.charAt(index);
			if (Character.isLetter(current)) {
				hasLetter = true;
			} else if (Character.isDigit(current)) {
				hasDigit = true;
			} else {
				hasSymbol = true;
			}
		}
		return hasLetter && hasDigit && hasSymbol;
	}
}
