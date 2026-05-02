package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.AuthenticationMethod;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationMethodRepository extends JpaRepository<AuthenticationMethod, UUID> {
}
