CREATE TABLE contracts (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    contract_type_id UUID NOT NULL,
    currency_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    base_salary NUMERIC(19, 2) NOT NULL,
    weekly_hours NUMERIC(5, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_contracts PRIMARY KEY (id),
    CONSTRAINT fk_contracts_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_contracts_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_contracts_employee FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT fk_contracts_contract_type FOREIGN KEY (contract_type_id) REFERENCES contract_types (id),
    CONSTRAINT fk_contracts_currency FOREIGN KEY (currency_id) REFERENCES currencies (id),
    CONSTRAINT ck_contracts_date_range CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT ck_contracts_base_salary CHECK (base_salary >= 0),
    CONSTRAINT ck_contracts_weekly_hours CHECK (weekly_hours >= 0)
);

CREATE INDEX idx_contracts_tenant_id ON contracts (tenant_id);
CREATE INDEX idx_contracts_company_profile_id ON contracts (company_profile_id);
CREATE INDEX idx_contracts_employee_id ON contracts (employee_id);
CREATE INDEX idx_contracts_contract_type_id ON contracts (contract_type_id);
CREATE INDEX idx_contracts_currency_id ON contracts (currency_id);
CREATE INDEX idx_contracts_active ON contracts (active);
