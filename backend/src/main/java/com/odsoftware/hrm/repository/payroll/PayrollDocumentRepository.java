package com.odsoftware.hrm.repository.payroll;

import com.odsoftware.hrm.entity.payroll.PayrollDocument;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayrollDocumentRepository extends JpaRepository<PayrollDocument, UUID> {

	List<PayrollDocument> findByTenant_IdAndEmployee_Id(UUID tenantId, UUID employeeId);

	boolean existsByUploadedBy_Id(UUID uploadedById);

	boolean existsByDocumentType_Id(UUID documentTypeId);

	List<PayrollDocument> findByTenant_IdAndEmployee_IdAndPeriodYearAndPeriodMonth(UUID tenantId, UUID employeeId, Integer periodYear, Integer periodMonth);

	Optional<PayrollDocument> findByTenant_IdAndEmployee_IdAndDocumentType_IdAndPeriodYearAndPeriodMonth(UUID tenantId, UUID employeeId, UUID documentTypeId, Integer periodYear, Integer periodMonth);
}
