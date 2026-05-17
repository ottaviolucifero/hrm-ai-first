ALTER TABLE holiday_calendars ADD COLUMN global_scope_key VARCHAR(50);
ALTER TABLE holiday_calendars ADD COLUMN tenant_scope_id UUID;
ALTER TABLE holiday_calendars ADD COLUMN company_profile_scope_id UUID;

UPDATE holiday_calendars
SET global_scope_key = CASE WHEN scope = 'GLOBAL' THEN 'GLOBAL' ELSE NULL END,
    tenant_scope_id = CASE WHEN scope = 'TENANT' THEN tenant_id ELSE NULL END,
    company_profile_scope_id = CASE WHEN scope = 'COMPANY_PROFILE' THEN company_profile_id ELSE NULL END;

ALTER TABLE holiday_calendars
    ADD CONSTRAINT uk_holiday_calendars_global_country_year UNIQUE (global_scope_key, country_id, calendar_year);

ALTER TABLE holiday_calendars
    ADD CONSTRAINT uk_holiday_calendars_tenant_country_year UNIQUE (tenant_scope_id, country_id, calendar_year);

ALTER TABLE holiday_calendars
    ADD CONSTRAINT uk_holiday_calendars_company_profile_country_year UNIQUE (company_profile_scope_id, country_id, calendar_year);
