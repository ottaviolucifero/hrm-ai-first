CREATE TABLE employee_disciplinary_actions (
    id UUID NOT NULL,
    tenant_id UUID NOT NULL,
    company_profile_id UUID NOT NULL,
    employee_id UUID NOT NULL,
    disciplinary_action_type_id UUID NOT NULL,
    action_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issued_by_id UUID NOT NULL,
    related_document_id UUID,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_employee_disciplinary_actions PRIMARY KEY (id),
    CONSTRAINT fk_employee_disciplinary_actions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
    CONSTRAINT fk_employee_disciplinary_actions_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id),
    CONSTRAINT fk_employee_disciplinary_actions_employee FOREIGN KEY (employee_id) REFERENCES employees (id),
    CONSTRAINT fk_employee_disciplinary_actions_type FOREIGN KEY (disciplinary_action_type_id) REFERENCES disciplinary_action_types (id),
    CONSTRAINT fk_employee_disciplinary_actions_issued_by FOREIGN KEY (issued_by_id) REFERENCES user_accounts (id),
    CONSTRAINT fk_employee_disciplinary_actions_related_document FOREIGN KEY (related_document_id) REFERENCES payroll_documents (id)
);

CREATE INDEX idx_employee_disciplinary_actions_tenant_id ON employee_disciplinary_actions (tenant_id);
CREATE INDEX idx_employee_disciplinary_actions_company_profile_id ON employee_disciplinary_actions (company_profile_id);
CREATE INDEX idx_employee_disciplinary_actions_employee_id ON employee_disciplinary_actions (employee_id);
CREATE INDEX idx_employee_disciplinary_actions_type_id ON employee_disciplinary_actions (disciplinary_action_type_id);
CREATE INDEX idx_employee_disciplinary_actions_issued_by_id ON employee_disciplinary_actions (issued_by_id);
CREATE INDEX idx_employee_disciplinary_actions_related_document_id ON employee_disciplinary_actions (related_document_id);
CREATE INDEX idx_employee_disciplinary_actions_action_date ON employee_disciplinary_actions (action_date);
CREATE INDEX idx_employee_disciplinary_actions_active ON employee_disciplinary_actions (active);
