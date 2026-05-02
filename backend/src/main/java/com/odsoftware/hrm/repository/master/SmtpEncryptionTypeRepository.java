package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.SmtpEncryptionType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SmtpEncryptionTypeRepository extends JpaRepository<SmtpEncryptionType, UUID> {
}
