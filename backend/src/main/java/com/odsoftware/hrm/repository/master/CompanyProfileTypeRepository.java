package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.CompanyProfileType;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileTypeRepository extends JpaRepository<CompanyProfileType, UUID> {
}
