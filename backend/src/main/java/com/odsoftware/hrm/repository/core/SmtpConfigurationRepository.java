package com.odsoftware.hrm.repository.core;

import com.odsoftware.hrm.entity.core.SmtpConfiguration;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SmtpConfigurationRepository extends JpaRepository<SmtpConfiguration, UUID> {
}
