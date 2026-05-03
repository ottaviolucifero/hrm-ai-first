CREATE TABLE leave_requests (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    leave_request_type_id UUID NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_days NUMERIC(6, 2),
    deduct_from_balance BOOLEAN NOT NULL DEFAULT TRUE,
    deducted_days NUMERIC(6, 3),
    reason VARCHAR(1000),
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    approver_employee_id UUID,
    comments VARCHAR(1000),
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
    urgent_reason VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_leave_requests PRIMARY KEY (id),
    CONSTRAINT fk_leave_requests_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_leave_requests_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_leave_requests_employee FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT fk_leave_requests_leave_request_type FOREIGN KEY (leave_request_type_id) REFERENCES leave_request_types (id),
    CONSTRAINT fk_leave_requests_approver_employee FOREIGN KEY (approver_employee_id) REFERENCES employees (id),
    CONSTRAINT ck_leave_requests_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CONSTRAINT ck_leave_requests_duration_days CHECK (duration_days IS NULL OR duration_days >= 0),
    CONSTRAINT ck_leave_requests_deducted_days CHECK (deducted_days IS NULL OR deducted_days >= 0),
    CONSTRAINT ck_leave_requests_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')),
    CONSTRAINT ck_leave_requests_urgent_reason CHECK (is_urgent = FALSE OR urgent_reason IS NOT NULL)
);

CREATE INDEX idx_leave_requests_tenant_id ON leave_requests (tenant_id);
CREATE INDEX idx_leave_requests_company_profile_id ON leave_requests (company_profile_id);
CREATE INDEX idx_leave_requests_employee_id ON leave_requests (employee_id);
CREATE INDEX idx_leave_requests_leave_request_type_id ON leave_requests (leave_request_type_id);
CREATE INDEX idx_leave_requests_approver_employee_id ON leave_requests (approver_employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests (status);
CREATE INDEX idx_leave_requests_date_range ON leave_requests (start_date, end_date);
