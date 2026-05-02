CREATE TABLE user_accounts (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID,
    employee_id UUID,
    user_type_id UUID NOT NULL,
    authentication_method_id UUID NOT NULL,
    primary_tenant_id UUID,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255),
    otp_secret VARCHAR(255),
    email_otp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    app_otp_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    strong_authentication_required BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    preferred_language VARCHAR(10),
    time_zone_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    updated_by UUID,
    CONSTRAINT pk_user_accounts PRIMARY KEY (id),
    CONSTRAINT uk_user_accounts_tenant_email UNIQUE (tenant_id, email),
    CONSTRAINT fk_user_accounts_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_user_accounts_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_user_accounts_employee FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT fk_user_accounts_user_type FOREIGN KEY (user_type_id) REFERENCES user_types (id),
    CONSTRAINT fk_user_accounts_authentication_method FOREIGN KEY (authentication_method_id) REFERENCES authentication_methods (id),
    CONSTRAINT fk_user_accounts_primary_tenant FOREIGN KEY (primary_tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_user_accounts_time_zone FOREIGN KEY (time_zone_id) REFERENCES time_zones (id),
    CONSTRAINT fk_user_accounts_created_by FOREIGN KEY (created_by) REFERENCES user_accounts (id),
    CONSTRAINT fk_user_accounts_updated_by FOREIGN KEY (updated_by) REFERENCES user_accounts (id),
    CONSTRAINT ck_user_accounts_failed_login_attempts CHECK (failed_login_attempts >= 0)
);

CREATE INDEX idx_user_accounts_tenant_id ON user_accounts (tenant_id);
CREATE INDEX idx_user_accounts_company_profile_id ON user_accounts (company_profile_id);
CREATE INDEX idx_user_accounts_employee_id ON user_accounts (employee_id);
CREATE INDEX idx_user_accounts_user_type_id ON user_accounts (user_type_id);
CREATE INDEX idx_user_accounts_authentication_method_id ON user_accounts (authentication_method_id);
CREATE INDEX idx_user_accounts_primary_tenant_id ON user_accounts (primary_tenant_id);
CREATE INDEX idx_user_accounts_time_zone_id ON user_accounts (time_zone_id);
CREATE INDEX idx_user_accounts_created_by ON user_accounts (created_by);
CREATE INDEX idx_user_accounts_updated_by ON user_accounts (updated_by);
CREATE INDEX idx_user_accounts_active ON user_accounts (active);
CREATE INDEX idx_user_accounts_locked ON user_accounts (locked);
