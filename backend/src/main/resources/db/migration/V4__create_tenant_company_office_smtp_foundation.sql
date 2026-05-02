CREATE TABLE tenants (
    id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    legal_name VARCHAR(150) NOT NULL,
    default_country_id UUID NOT NULL,
    default_currency_id UUID NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_tenants PRIMARY KEY (id),
    CONSTRAINT uk_tenants_code UNIQUE (code),
    CONSTRAINT fk_tenants_default_country FOREIGN KEY (default_country_id) REFERENCES countries (id),
    CONSTRAINT fk_tenants_default_currency FOREIGN KEY (default_currency_id) REFERENCES currencies (id)
);

INSERT INTO tenants (id, code, name, legal_name, default_country_id, default_currency_id, active, created_at, updated_at) VALUES
    ('00000000-0000-0000-0000-000000000001', 'FOUNDATION_TENANT', 'Foundation Tenant', 'Foundation Tenant Legal Entity', '20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

ALTER TABLE departments
    ADD CONSTRAINT fk_departments_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE job_titles
    ADD CONSTRAINT fk_job_titles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE contract_types
    ADD CONSTRAINT fk_contract_types_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE employment_statuses
    ADD CONSTRAINT fk_employment_statuses_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE work_modes
    ADD CONSTRAINT fk_work_modes_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE leave_request_types
    ADD CONSTRAINT fk_leave_request_types_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE document_types
    ADD CONSTRAINT fk_document_types_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE device_types
    ADD CONSTRAINT fk_device_types_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE device_brands
    ADD CONSTRAINT fk_device_brands_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE device_statuses
    ADD CONSTRAINT fk_device_statuses_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE roles
    ADD CONSTRAINT fk_roles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE permissions
    ADD CONSTRAINT fk_permissions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE company_profile_types
    ADD CONSTRAINT fk_company_profile_types_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE office_location_types
    ADD CONSTRAINT fk_office_location_types_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

CREATE TABLE company_profiles (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_type_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    legal_name VARCHAR(150) NOT NULL,
    trade_name VARCHAR(150) NOT NULL,
    vat_number VARCHAR(50),
    tax_identifier VARCHAR(50),
    email VARCHAR(150),
    phone VARCHAR(50),
    country_id UUID NOT NULL,
    region_id UUID,
    area_id UUID,
    global_zip_code_id UUID,
    street VARCHAR(150) NOT NULL,
    street_number VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_company_profiles PRIMARY KEY (id),
    CONSTRAINT uk_company_profiles_tenant_code UNIQUE (tenant_id, code),
    CONSTRAINT fk_company_profiles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_company_profiles_company_profile_type FOREIGN KEY (company_profile_type_id) REFERENCES company_profile_types (id),
    CONSTRAINT fk_company_profiles_country FOREIGN KEY (country_id) REFERENCES countries (id),
    CONSTRAINT fk_company_profiles_region FOREIGN KEY (region_id) REFERENCES regions (id),
    CONSTRAINT fk_company_profiles_area FOREIGN KEY (area_id) REFERENCES areas (id),
    CONSTRAINT fk_company_profiles_global_zip_code FOREIGN KEY (global_zip_code_id) REFERENCES global_zip_codes (id)
);

CREATE TABLE office_locations (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID NOT NULL,
    office_location_type_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    country_id UUID NOT NULL,
    region_id UUID,
    area_id UUID,
    global_zip_code_id UUID,
    street VARCHAR(150) NOT NULL,
    street_number VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_office_locations PRIMARY KEY (id),
    CONSTRAINT uk_office_locations_tenant_code UNIQUE (tenant_id, code),
    CONSTRAINT fk_office_locations_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_office_locations_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_office_locations_office_location_type FOREIGN KEY (office_location_type_id) REFERENCES office_location_types (id),
    CONSTRAINT fk_office_locations_country FOREIGN KEY (country_id) REFERENCES countries (id),
    CONSTRAINT fk_office_locations_region FOREIGN KEY (region_id) REFERENCES regions (id),
    CONSTRAINT fk_office_locations_area FOREIGN KEY (area_id) REFERENCES areas (id),
    CONSTRAINT fk_office_locations_global_zip_code FOREIGN KEY (global_zip_code_id) REFERENCES global_zip_codes (id)
);

CREATE TABLE smtp_configurations (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    host VARCHAR(150) NOT NULL,
    port INTEGER NOT NULL,
    username VARCHAR(150),
    password_encrypted VARCHAR(500),
    smtp_encryption_type_id UUID NOT NULL,
    sender_email VARCHAR(150) NOT NULL,
    sender_name VARCHAR(150) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_smtp_configurations PRIMARY KEY (id),
    CONSTRAINT uk_smtp_configurations_tenant_code UNIQUE (tenant_id, code),
    CONSTRAINT fk_smtp_configurations_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_smtp_configurations_smtp_encryption_type FOREIGN KEY (smtp_encryption_type_id) REFERENCES smtp_encryption_types (id),
    CONSTRAINT ck_smtp_configurations_port CHECK (port >= 1 AND port <= 65535)
);

CREATE INDEX idx_company_profiles_tenant_id ON company_profiles (tenant_id);
CREATE INDEX idx_company_profiles_company_profile_type_id ON company_profiles (company_profile_type_id);
CREATE INDEX idx_company_profiles_country_id ON company_profiles (country_id);
CREATE INDEX idx_company_profiles_region_id ON company_profiles (region_id);
CREATE INDEX idx_company_profiles_area_id ON company_profiles (area_id);
CREATE INDEX idx_company_profiles_global_zip_code_id ON company_profiles (global_zip_code_id);
CREATE INDEX idx_office_locations_tenant_id ON office_locations (tenant_id);
CREATE INDEX idx_office_locations_company_profile_id ON office_locations (company_profile_id);
CREATE INDEX idx_office_locations_office_location_type_id ON office_locations (office_location_type_id);
CREATE INDEX idx_office_locations_country_id ON office_locations (country_id);
CREATE INDEX idx_office_locations_region_id ON office_locations (region_id);
CREATE INDEX idx_office_locations_area_id ON office_locations (area_id);
CREATE INDEX idx_office_locations_global_zip_code_id ON office_locations (global_zip_code_id);
CREATE INDEX idx_smtp_configurations_tenant_id ON smtp_configurations (tenant_id);
CREATE INDEX idx_smtp_configurations_smtp_encryption_type_id ON smtp_configurations (smtp_encryption_type_id);

INSERT INTO company_profiles (id, tenant_id, company_profile_type_id, code, legal_name, trade_name, vat_number, tax_identifier, email, phone, country_id, region_id, area_id, global_zip_code_id, street, street_number, active, created_at, updated_at) VALUES
    ('80000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '77000000-0000-0000-0000-000000000001', 'FOUNDATION_LEGAL_ENTITY', 'Foundation Tenant Legal Entity', 'Foundation Tenant', NULL, NULL, 'foundation@example.com', '+390000000000', '20000000-0000-0000-0000-000000000001', NULL, NULL, NULL, 'Foundation Street', '1', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO office_locations (id, tenant_id, company_profile_id, office_location_type_id, code, name, email, phone, country_id, region_id, area_id, global_zip_code_id, street, street_number, active, created_at, updated_at) VALUES
    ('81000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '80000000-0000-0000-0000-000000000001', '78000000-0000-0000-0000-000000000001', 'HEADQUARTER', 'Foundation Headquarter', 'foundation@example.com', '+390000000000', '20000000-0000-0000-0000-000000000001', NULL, NULL, NULL, 'Foundation Street', '1', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO smtp_configurations (id, tenant_id, code, host, port, username, password_encrypted, smtp_encryption_type_id, sender_email, sender_name, active, created_at, updated_at) VALUES
    ('82000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'DEFAULT_SMTP', 'smtp.example.com', 587, 'foundation@example.com', 'encrypted-placeholder', '74000000-0000-0000-0000-000000000003', 'foundation@example.com', 'Foundation Tenant', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
