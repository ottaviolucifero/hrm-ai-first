package com.odsoftware.hrm.security.permission;

import java.util.Objects;

public final class PermissionCode {

	private static final String SEPARATOR = ".";

	private PermissionCode() {
	}

	public static String of(PermissionScope scope, PermissionResource resource, PermissionAction action) {
		Objects.requireNonNull(scope, "scope must not be null");
		Objects.requireNonNull(resource, "resource must not be null");
		Objects.requireNonNull(action, "action must not be null");
		return scope.name() + SEPARATOR + resource.name() + SEPARATOR + action.name();
	}

	public static boolean isValid(String code) {
		if (code == null) {
			return false;
		}
		String[] parts = code.split("\\.", -1);
		if (parts.length != 3) {
			return false;
		}
		return isEnumValue(PermissionScope.class, parts[0])
				&& isEnumValue(PermissionResource.class, parts[1])
				&& isEnumValue(PermissionAction.class, parts[2]);
	}

	private static <E extends Enum<E>> boolean isEnumValue(Class<E> enumType, String value) {
		try {
			Enum.valueOf(enumType, value);
			return true;
		} catch (IllegalArgumentException exception) {
			return false;
		}
	}
}
