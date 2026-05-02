CREATE TABLE user_roles (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    user_account_id UUID NOT NULL,
    role_id UUID NOT NULL,
    CONSTRAINT pk_user_roles PRIMARY KEY (id),
    CONSTRAINT uk_user_roles_tenant_user_role UNIQUE (tenant_id, user_account_id, role_id),
    CONSTRAINT fk_user_roles_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_user_roles_user_account FOREIGN KEY (user_account_id) REFERENCES user_accounts (id),
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id)
);

CREATE TABLE role_permissions (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    CONSTRAINT pk_role_permissions PRIMARY KEY (id),
    CONSTRAINT uk_role_permissions_tenant_role_permission UNIQUE (tenant_id, role_id, permission_id),
    CONSTRAINT fk_role_permissions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles (id),
    CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions (id)
);

CREATE TABLE user_tenant_accesses (
    id UUID NOT NULL,
    user_account_id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    access_role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user_tenant_accesses PRIMARY KEY (id),
    CONSTRAINT uk_user_tenant_accesses_user_tenant UNIQUE (user_account_id, tenant_id),
    CONSTRAINT fk_user_tenant_accesses_user_account FOREIGN KEY (user_account_id) REFERENCES user_accounts (id),
    CONSTRAINT fk_user_tenant_accesses_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id)
);

CREATE INDEX idx_user_roles_tenant_id ON user_roles (tenant_id);
CREATE INDEX idx_user_roles_user_account_id ON user_roles (user_account_id);
CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);
CREATE INDEX idx_role_permissions_tenant_id ON role_permissions (tenant_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions (permission_id);
CREATE INDEX idx_user_tenant_accesses_user_account_id ON user_tenant_accesses (user_account_id);
CREATE INDEX idx_user_tenant_accesses_tenant_id ON user_tenant_accesses (tenant_id);
CREATE INDEX idx_user_tenant_accesses_active ON user_tenant_accesses (active);
