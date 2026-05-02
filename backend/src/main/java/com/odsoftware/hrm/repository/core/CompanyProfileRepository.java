package com.odsoftware.hrm.repository.core;

import com.odsoftware.hrm.entity.core.CompanyProfile;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, UUID> {
}
