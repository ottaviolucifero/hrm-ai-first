package com.odsoftware.hrm.exception;

public class AuthenticationFailedException extends RuntimeException {

	private final String code;

	public AuthenticationFailedException(String message) {
		this(message, null);
	}

	public AuthenticationFailedException(String message, String code) {
		super(message);
		this.code = code;
	}

	public String getCode() {
		return code;
	}
}
