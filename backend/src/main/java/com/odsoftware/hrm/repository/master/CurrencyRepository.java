package com.odsoftware.hrm.repository.master;

import com.odsoftware.hrm.entity.master.Currency;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CurrencyRepository extends JpaRepository<Currency, UUID> {
}
