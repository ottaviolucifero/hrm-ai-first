package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationMethodRepository extends MasterDataRepository<AuthenticationMethod> {

	boolean existsByCode(String code);

	boolean existsByCodeAndIdNot(String code, UUID id);
}
