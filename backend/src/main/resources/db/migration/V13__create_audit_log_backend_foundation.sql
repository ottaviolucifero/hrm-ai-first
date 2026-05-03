CREATE TABLE audit_logs (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID,
    user_account_id UUID,
    audit_action_type_id UUID NOT NULL,
    acting_tenant_id UUID,
    target_tenant_id UUID,
    impersonation_mode VARCHAR(50),
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    entity_display_name VARCHAR(255),
    description VARCHAR(1000) NOT NULL,
    old_value_json TEXT,
    new_value_json TEXT,
    ip_address VARCHAR(100),
    user_agent VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL DEFAULT TRUE,
    severity_level VARCHAR(30) NOT NULL,
    CONSTRAINT pk_audit_logs PRIMARY KEY (id),
    CONSTRAINT fk_audit_logs_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_audit_logs_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_audit_logs_user_account FOREIGN KEY (user_account_id) REFERENCES user_accounts (id),
    CONSTRAINT fk_audit_logs_audit_action_type FOREIGN KEY (audit_action_type_id) REFERENCES audit_action_types (id),
    CONSTRAINT fk_audit_logs_acting_tenant FOREIGN KEY (acting_tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_audit_logs_target_tenant FOREIGN KEY (target_tenant_id) REFERENCES tenants (id),
    CONSTRAINT ck_audit_logs_impersonation_mode CHECK (impersonation_mode IS NULL OR impersonation_mode IN ('NONE', 'TENANT_SWITCH', 'IMPERSONATION')),
    CONSTRAINT ck_audit_logs_severity_level CHECK (severity_level IN ('LOW', 'MEDIUM', 'HIGH'))
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs (tenant_id);
CREATE INDEX idx_audit_logs_company_profile_id ON audit_logs (company_profile_id);
CREATE INDEX idx_audit_logs_user_account_id ON audit_logs (user_account_id);
CREATE INDEX idx_audit_logs_audit_action_type_id ON audit_logs (audit_action_type_id);
CREATE INDEX idx_audit_logs_acting_tenant_id ON audit_logs (acting_tenant_id);
CREATE INDEX idx_audit_logs_target_tenant_id ON audit_logs (target_tenant_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
CREATE INDEX idx_audit_logs_success ON audit_logs (success);
CREATE INDEX idx_audit_logs_severity_level ON audit_logs (severity_level);
