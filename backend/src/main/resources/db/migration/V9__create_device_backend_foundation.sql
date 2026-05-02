CREATE TABLE devices (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    device_type_id UUID NOT NULL,
    device_brand_id UUID NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100) NOT NULL,
    purchase_date DATE,
    warranty_end_date DATE,
    device_status_id UUID NOT NULL,
    assigned_to_employee_id UUID,
    assigned_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_devices PRIMARY KEY (id),
    CONSTRAINT fk_devices_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_devices_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_devices_device_type FOREIGN KEY (device_type_id) REFERENCES device_types (id),
    CONSTRAINT fk_devices_device_brand FOREIGN KEY (device_brand_id) REFERENCES device_brands (id),
    CONSTRAINT fk_devices_device_status FOREIGN KEY (device_status_id) REFERENCES device_statuses (id),
    CONSTRAINT fk_devices_assigned_to_employee FOREIGN KEY (assigned_to_employee_id) REFERENCES employees (id),
    CONSTRAINT ck_devices_warranty_date CHECK (warranty_end_date IS NULL OR warranty_end_date >= purchase_date)
);

CREATE INDEX idx_devices_tenant_id ON devices (tenant_id);
CREATE INDEX idx_devices_company_profile_id ON devices (company_profile_id);
CREATE INDEX idx_devices_device_type_id ON devices (device_type_id);
CREATE INDEX idx_devices_device_brand_id ON devices (device_brand_id);
CREATE INDEX idx_devices_device_status_id ON devices (device_status_id);
CREATE INDEX idx_devices_assigned_to_employee_id ON devices (assigned_to_employee_id);
CREATE INDEX idx_devices_active ON devices (active);
