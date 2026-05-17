ALTER TABLE holiday_calendars ADD COLUMN scope VARCHAR(50);
ALTER TABLE holiday_calendars ADD COLUMN tenant_id UUID;
ALTER TABLE holiday_calendars ADD COLUMN company_profile_id UUID;

UPDATE holiday_calendars
SET scope = 'GLOBAL'
WHERE scope IS NULL;

ALTER TABLE holiday_calendars ALTER COLUMN scope SET NOT NULL;

ALTER TABLE holiday_calendars
    ADD CONSTRAINT fk_holiday_calendars_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE holiday_calendars
    ADD CONSTRAINT fk_holiday_calendars_company_profile FOREIGN KEY (company_profile_id) REFERENCES company_profiles (id);

ALTER TABLE holiday_calendars
    ADD CONSTRAINT ck_holiday_calendars_scope_context CHECK (
        (scope = 'GLOBAL' AND tenant_id IS NULL AND company_profile_id IS NULL)
        OR (scope = 'TENANT' AND tenant_id IS NOT NULL AND company_profile_id IS NULL)
        OR (scope = 'COMPANY_PROFILE' AND tenant_id IS NOT NULL AND company_profile_id IS NOT NULL)
    );

ALTER TABLE holiday_calendars DROP CONSTRAINT uk_holiday_calendars_country_year;

CREATE INDEX idx_holiday_calendars_scope_country_year ON holiday_calendars (scope, country_id, calendar_year);
CREATE INDEX idx_holiday_calendars_tenant_id ON holiday_calendars (tenant_id);
CREATE INDEX idx_holiday_calendars_company_profile_id ON holiday_calendars (company_profile_id);
