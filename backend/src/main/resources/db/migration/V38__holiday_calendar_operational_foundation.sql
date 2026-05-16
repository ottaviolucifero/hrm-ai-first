ALTER TABLE holiday_calendars ADD COLUMN calendar_year INTEGER;
ALTER TABLE holiday_calendars ADD COLUMN created_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE holiday_calendars ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;

UPDATE holiday_calendars
SET calendar_year = CAST(EXTRACT(YEAR FROM COALESCE(start_date, end_date, CURRENT_DATE)) AS INTEGER),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)
WHERE calendar_year IS NULL
   OR created_at IS NULL
   OR updated_at IS NULL;

ALTER TABLE holiday_calendars ALTER COLUMN calendar_year SET NOT NULL;
ALTER TABLE holiday_calendars ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE holiday_calendars ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE holiday_calendars ALTER COLUMN start_date DROP NOT NULL;
ALTER TABLE holiday_calendars ALTER COLUMN end_date DROP NOT NULL;

ALTER TABLE holiday_calendars
    ADD CONSTRAINT uk_holiday_calendars_country_year UNIQUE (country_id, calendar_year);

CREATE INDEX idx_holiday_calendars_country_year ON holiday_calendars (country_id, calendar_year);

CREATE TABLE holidays (
    id UUID NOT NULL,
    holiday_calendar_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    holiday_type VARCHAR(50) NOT NULL,
    generation_rule VARCHAR(50) NOT NULL,
    description VARCHAR(1000),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT pk_holidays PRIMARY KEY (id),
    CONSTRAINT fk_holidays_holiday_calendar FOREIGN KEY (holiday_calendar_id) REFERENCES holiday_calendars (id) ON DELETE CASCADE,
    CONSTRAINT ck_holidays_date_range CHECK (end_date >= start_date)
);

CREATE INDEX idx_holidays_calendar_id ON holidays (holiday_calendar_id);
CREATE INDEX idx_holidays_date_range ON holidays (holiday_calendar_id, start_date, end_date);

INSERT INTO permissions (id, tenant_id, code, name, system_permission, active, created_at, updated_at)
SELECT CAST(seed.id AS UUID), CAST('00000000-0000-0000-0000-000000000001' AS UUID), seed.code, seed.name, TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (VALUES
    ('76100000-0000-0000-0000-000000000056', 'PLATFORM.HOLIDAY_CALENDAR.READ', 'Platform Holiday Calendar Read'),
    ('76100000-0000-0000-0000-000000000057', 'PLATFORM.HOLIDAY_CALENDAR.CREATE', 'Platform Holiday Calendar Create'),
    ('76100000-0000-0000-0000-000000000058', 'PLATFORM.HOLIDAY_CALENDAR.UPDATE', 'Platform Holiday Calendar Update'),
    ('76100000-0000-0000-0000-000000000059', 'PLATFORM.HOLIDAY_CALENDAR.DELETE', 'Platform Holiday Calendar Delete'),
    ('76100000-0000-0000-0000-000000000060', 'PLATFORM.HOLIDAY_CALENDAR.MANAGE', 'Platform Holiday Calendar Manage'),
    ('76200000-0000-0000-0000-000000000101', 'TENANT.HOLIDAY_CALENDAR.READ', 'Tenant Holiday Calendar Read'),
    ('76200000-0000-0000-0000-000000000102', 'TENANT.HOLIDAY_CALENDAR.CREATE', 'Tenant Holiday Calendar Create'),
    ('76200000-0000-0000-0000-000000000103', 'TENANT.HOLIDAY_CALENDAR.UPDATE', 'Tenant Holiday Calendar Update'),
    ('76200000-0000-0000-0000-000000000104', 'TENANT.HOLIDAY_CALENDAR.DELETE', 'Tenant Holiday Calendar Delete'),
    ('76200000-0000-0000-0000-000000000105', 'TENANT.HOLIDAY_CALENDAR.MANAGE', 'Tenant Holiday Calendar Manage')
) AS seed(id, code, name)
WHERE NOT EXISTS (
    SELECT 1
    FROM permissions existing
    WHERE existing.tenant_id = CAST('00000000-0000-0000-0000-000000000001' AS UUID)
      AND existing.code = seed.code
);
