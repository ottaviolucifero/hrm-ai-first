package com.odsoftware.hrm.repository.master;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface MasterDataRepository<T> extends JpaRepository<T, UUID>, JpaSpecificationExecutor<T> {
}
