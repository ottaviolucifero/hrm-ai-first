CREATE TABLE holiday_calendars (
    id UUID NOT NULL,
    country_id UUID NOT NULL,
    region_id UUID,
    area_id UUID,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_holiday_calendars PRIMARY KEY (id),
    CONSTRAINT fk_holiday_calendars_country FOREIGN KEY (country_id) REFERENCES countries (id),
    CONSTRAINT fk_holiday_calendars_region FOREIGN KEY (region_id) REFERENCES regions (id),
    CONSTRAINT fk_holiday_calendars_area FOREIGN KEY (area_id) REFERENCES areas (id),
    CONSTRAINT ck_holiday_calendars_date_range CHECK (end_date >= start_date)
);

CREATE INDEX idx_holiday_calendars_country_id ON holiday_calendars (country_id);
CREATE INDEX idx_holiday_calendars_region_id ON holiday_calendars (region_id);
CREATE INDEX idx_holiday_calendars_area_id ON holiday_calendars (area_id);
CREATE INDEX idx_holiday_calendars_active ON holiday_calendars (active);
CREATE INDEX idx_holiday_calendars_date_range ON holiday_calendars (start_date, end_date);
