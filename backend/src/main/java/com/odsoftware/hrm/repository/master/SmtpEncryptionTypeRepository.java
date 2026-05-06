package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.SmtpEncryptionType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SmtpEncryptionTypeRepository extends MasterDataRepository<SmtpEncryptionType> {

	boolean existsByCode(String code);

	boolean existsByCodeAndIdNot(String code, UUID id);
}
