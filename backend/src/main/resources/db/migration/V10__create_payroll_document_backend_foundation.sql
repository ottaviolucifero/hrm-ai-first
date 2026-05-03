CREATE TABLE payroll_documents (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    contract_id UUID NOT NULL,
    document_type_id UUID NOT NULL,
    uploaded_by UUID,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP WITH TIME ZONE,
    issuer_name VARCHAR(150),
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_payroll_documents PRIMARY KEY (id),
    CONSTRAINT uk_payroll_documents_tenant_employee_document_type_period UNIQUE (tenant_id, employee_id, document_type_id, period_year, period_month),
    CONSTRAINT fk_payroll_documents_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_payroll_documents_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_payroll_documents_employee FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT fk_payroll_documents_contract FOREIGN KEY (contract_id) REFERENCES contracts (id),
    CONSTRAINT fk_payroll_documents_document_type FOREIGN KEY (document_type_id) REFERENCES document_types (id),
    CONSTRAINT fk_payroll_documents_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES user_accounts (id),
    CONSTRAINT ck_payroll_documents_file_size CHECK (file_size_bytes >= 0),
    CONSTRAINT ck_payroll_documents_period_month CHECK (period_month BETWEEN 1 AND 12),
    CONSTRAINT ck_payroll_documents_period_year CHECK (period_year BETWEEN 1900 AND 2200),
    CONSTRAINT ck_payroll_documents_status CHECK (status IN ('DRAFT', 'PUBLISHED')),
    CONSTRAINT ck_payroll_documents_published_at CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)
);

CREATE INDEX idx_payroll_documents_tenant_id ON payroll_documents (tenant_id);
CREATE INDEX idx_payroll_documents_company_profile_id ON payroll_documents (company_profile_id);
CREATE INDEX idx_payroll_documents_employee_id ON payroll_documents (employee_id);
CREATE INDEX idx_payroll_documents_contract_id ON payroll_documents (contract_id);
CREATE INDEX idx_payroll_documents_document_type_id ON payroll_documents (document_type_id);
CREATE INDEX idx_payroll_documents_uploaded_by ON payroll_documents (uploaded_by);
CREATE INDEX idx_payroll_documents_period ON payroll_documents (period_year, period_month);
CREATE INDEX idx_payroll_documents_status ON payroll_documents (status);
