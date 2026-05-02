CREATE TABLE currencies (
    id UUID NOT NULL,
    code VARCHAR(3) NOT NULL,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_currencies PRIMARY KEY (id),
    CONSTRAINT uk_currencies_code UNIQUE (code)
);

CREATE TABLE countries (
    id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    iso_code VARCHAR(2) NOT NULL,
    phone_code VARCHAR(10),
    default_currency_id UUID NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_countries PRIMARY KEY (id),
    CONSTRAINT uk_countries_iso_code UNIQUE (iso_code),
    CONSTRAINT fk_countries_default_currency FOREIGN KEY (default_currency_id) REFERENCES currencies (id)
);

CREATE TABLE regions (
    id UUID NOT NULL,
    country_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_regions PRIMARY KEY (id),
    CONSTRAINT uk_regions_country_code UNIQUE (country_id, code),
    CONSTRAINT fk_regions_country FOREIGN KEY (country_id) REFERENCES countries (id)
);

CREATE TABLE areas (
    id UUID NOT NULL,
    country_id UUID NOT NULL,
    region_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_areas PRIMARY KEY (id),
    CONSTRAINT uk_areas_region_code UNIQUE (region_id, code),
    CONSTRAINT fk_areas_country FOREIGN KEY (country_id) REFERENCES countries (id),
    CONSTRAINT fk_areas_region FOREIGN KEY (region_id) REFERENCES regions (id)
);

CREATE TABLE global_zip_codes (
    id UUID NOT NULL,
    country_id UUID NOT NULL,
    region_id UUID,
    area_id UUID,
    city VARCHAR(120) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    province_code VARCHAR(20),
    province_name VARCHAR(120),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    source_type VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_global_zip_codes PRIMARY KEY (id),
    CONSTRAINT uk_global_zip_codes_country_postal_city UNIQUE (country_id, postal_code, city),
    CONSTRAINT fk_global_zip_codes_country FOREIGN KEY (country_id) REFERENCES countries (id),
    CONSTRAINT fk_global_zip_codes_region FOREIGN KEY (region_id) REFERENCES regions (id),
    CONSTRAINT fk_global_zip_codes_area FOREIGN KEY (area_id) REFERENCES areas (id),
    CONSTRAINT ck_global_zip_codes_source_type CHECK (source_type IN ('OFFICIAL_IMPORT', 'MANUAL', 'API')),
    CONSTRAINT ck_global_zip_codes_latitude CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90)),
    CONSTRAINT ck_global_zip_codes_longitude CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180))
);

CREATE TABLE time_zones (
    id UUID NOT NULL,
    code VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    utc_offset VARCHAR(10) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_time_zones PRIMARY KEY (id),
    CONSTRAINT uk_time_zones_code UNIQUE (code)
);

CREATE TABLE genders (
    id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_genders PRIMARY KEY (id),
    CONSTRAINT uk_genders_code UNIQUE (code)
);

CREATE TABLE marital_statuses (
    id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_marital_statuses PRIMARY KEY (id),
    CONSTRAINT uk_marital_statuses_code UNIQUE (code)
);

CREATE TABLE national_identifier_types (
    id UUID NOT NULL,
    country_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    regex_pattern VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_national_identifier_types PRIMARY KEY (id),
    CONSTRAINT uk_national_identifier_types_country_code UNIQUE (country_id, code),
    CONSTRAINT fk_national_identifier_types_country FOREIGN KEY (country_id) REFERENCES countries (id)
);

CREATE TABLE approval_statuses (
    id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_approval_statuses PRIMARY KEY (id),
    CONSTRAINT uk_approval_statuses_code UNIQUE (code)
);

CREATE INDEX idx_regions_country_id ON regions (country_id);
CREATE INDEX idx_areas_country_id ON areas (country_id);
CREATE INDEX idx_areas_region_id ON areas (region_id);
CREATE INDEX idx_global_zip_codes_country_id ON global_zip_codes (country_id);
CREATE INDEX idx_global_zip_codes_region_id ON global_zip_codes (region_id);
CREATE INDEX idx_global_zip_codes_area_id ON global_zip_codes (area_id);
CREATE INDEX idx_national_identifier_types_country_id ON national_identifier_types (country_id);

INSERT INTO currencies (id, code, name, symbol, active, created_at, updated_at) VALUES
    ('10000000-0000-0000-0000-000000000001', 'EUR', 'Euro', 'EUR', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('10000000-0000-0000-0000-000000000002', 'TND', 'Tunisian Dinar', 'TND', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO countries (id, name, iso_code, phone_code, default_currency_id, active, created_at, updated_at) VALUES
    ('20000000-0000-0000-0000-000000000001', 'Italy', 'IT', '+39', '10000000-0000-0000-0000-000000000001', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000002', 'France', 'FR', '+33', '10000000-0000-0000-0000-000000000001', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000003', 'Tunisia', 'TN', '+216', '10000000-0000-0000-0000-000000000002', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO genders (id, code, name, active, created_at, updated_at) VALUES
    ('30000000-0000-0000-0000-000000000001', 'MALE', 'Male', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('30000000-0000-0000-0000-000000000002', 'FEMALE', 'Female', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('30000000-0000-0000-0000-000000000003', 'OTHER', 'Other', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO marital_statuses (id, code, name, active, created_at, updated_at) VALUES
    ('40000000-0000-0000-0000-000000000001', 'SINGLE', 'Single', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('40000000-0000-0000-0000-000000000002', 'MARRIED', 'Married', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('40000000-0000-0000-0000-000000000003', 'DIVORCED', 'Divorced', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('40000000-0000-0000-0000-000000000004', 'WIDOWED', 'Widowed', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO approval_statuses (id, code, name, active, created_at, updated_at) VALUES
    ('50000000-0000-0000-0000-000000000001', 'PENDING', 'Pending', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('50000000-0000-0000-0000-000000000002', 'APPROVED', 'Approved', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('50000000-0000-0000-0000-000000000003', 'REJECTED', 'Rejected', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('50000000-0000-0000-0000-000000000004', 'CANCELLED', 'Cancelled', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
