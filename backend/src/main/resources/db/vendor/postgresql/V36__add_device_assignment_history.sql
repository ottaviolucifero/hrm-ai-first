CREATE TABLE device_assignments (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    device_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    assigned_from TIMESTAMP WITH TIME ZONE NOT NULL,
    assigned_to TIMESTAMP WITH TIME ZONE,
    assigned_by_user_id UUID,
    returned_at TIMESTAMP WITH TIME ZONE,
    return_note VARCHAR(1000),
    condition_on_assign VARCHAR(255),
    condition_on_return VARCHAR(255),
    notes VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_device_assignments PRIMARY KEY (id),
    CONSTRAINT fk_device_assignments_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_device_assignments_device FOREIGN KEY (device_id) REFERENCES devices (id),
    CONSTRAINT fk_device_assignments_employee FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT fk_device_assignments_assigned_by_user FOREIGN KEY (assigned_by_user_id) REFERENCES user_accounts (id),
    CONSTRAINT ck_device_assignments_closed_range CHECK (assigned_to IS NULL OR assigned_to >= assigned_from),
    CONSTRAINT ck_device_assignments_returned_at CHECK (returned_at IS NULL OR returned_at >= assigned_from)
);

CREATE INDEX idx_device_assignments_tenant_device ON device_assignments (tenant_id, device_id);
CREATE INDEX idx_device_assignments_tenant_employee ON device_assignments (tenant_id, employee_id);
CREATE INDEX idx_device_assignments_device_assigned_from ON device_assignments (device_id, assigned_from DESC);
CREATE INDEX idx_device_assignments_device_assigned_to ON device_assignments (device_id, assigned_to);

INSERT INTO device_assignments (
    id,
    tenant_id,
    device_id,
    employee_id,
    assigned_from,
    assigned_to,
    assigned_by_user_id,
    returned_at,
    return_note,
    condition_on_assign,
    condition_on_return,
    notes,
    created_at,
    updated_at
)
SELECT (
           substr(md5(device.id::text || ':device-assignment-history'), 1, 8) || '-' ||
           substr(md5(device.id::text || ':device-assignment-history'), 9, 4) || '-' ||
           substr(md5(device.id::text || ':device-assignment-history'), 13, 4) || '-' ||
           substr(md5(device.id::text || ':device-assignment-history'), 17, 4) || '-' ||
           substr(md5(device.id::text || ':device-assignment-history'), 21, 12)
       )::uuid,
       device.tenant_id,
       device.id,
       device.assigned_to_employee_id,
       COALESCE(device.assigned_at, device.created_at, CURRENT_TIMESTAMP),
       NULL,
       NULL,
       NULL,
       NULL,
       NULL,
       NULL,
       NULL,
       CURRENT_TIMESTAMP,
       CURRENT_TIMESTAMP
FROM devices device
WHERE device.assigned_to_employee_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM device_assignments existing
      WHERE existing.device_id = device.id
        AND existing.assigned_to IS NULL
  );
