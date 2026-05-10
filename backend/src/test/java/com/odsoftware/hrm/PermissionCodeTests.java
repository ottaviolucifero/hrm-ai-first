package com.odsoftware.hrm;

import com.odsoftware.hrm.security.permission.PermissionAction;
import com.odsoftware.hrm.security.permission.PermissionCode;
import com.odsoftware.hrm.security.permission.PermissionResource;
import com.odsoftware.hrm.security.permission.PermissionScope;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PermissionCodeTests {

	@Test
	void permissionCodeUsesScopeResourceActionFormat() {
		assertThat(PermissionCode.of(PermissionScope.PLATFORM, PermissionResource.TENANT, PermissionAction.MANAGE))
				.isEqualTo("PLATFORM.TENANT.MANAGE");
		assertThat(PermissionCode.of(PermissionScope.TENANT, PermissionResource.MASTER_DATA, PermissionAction.READ))
				.isEqualTo("TENANT.MASTER_DATA.READ");
	}

	@Test
	void permissionCodeValidationRejectsSingleMasterDataEntityGranularity() {
		assertThat(PermissionCode.isValid("TENANT.MASTER_DATA.MANAGE")).isTrue();
		assertThat(PermissionCode.isValid("TENANT.MASTER_DATA.WORK_MODE.CREATE")).isFalse();
		assertThat(PermissionCode.isValid("EMPLOYEE_READ")).isFalse();
	}
}
