package com.odsoftware.hrm.dto.auth;

public record LoginRequest(
		String email,
		String password) {
}
