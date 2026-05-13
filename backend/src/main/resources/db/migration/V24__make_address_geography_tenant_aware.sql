ALTER TABLE regions
    ADD COLUMN tenant_id UUID;

UPDATE regions
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

ALTER TABLE regions
    ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE regions
    ADD CONSTRAINT fk_regions_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE regions
    DROP CONSTRAINT uk_regions_country_code;

CREATE INDEX idx_regions_tenant_id ON regions (tenant_id);

ALTER TABLE areas
    ADD COLUMN tenant_id UUID;

UPDATE areas
SET tenant_id = '00000000-0000-0000-0000-000000000001'
WHERE tenant_id IS NULL;

ALTER TABLE areas
    ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE areas
    ADD CONSTRAINT fk_areas_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE areas
    DROP CONSTRAINT uk_areas_region_code;

CREATE INDEX idx_areas_tenant_id ON areas (tenant_id);

ALTER TABLE global_zip_codes
    ADD COLUMN tenant_id UUID;

ALTER TABLE global_zip_codes
    ADD COLUMN tenant_scope_key UUID;

UPDATE global_zip_codes
SET tenant_scope_key = '00000000-0000-0000-0000-000000000000'
WHERE tenant_scope_key IS NULL;

ALTER TABLE global_zip_codes
    ALTER COLUMN tenant_scope_key SET NOT NULL;

ALTER TABLE global_zip_codes
    ADD CONSTRAINT fk_global_zip_codes_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id);

ALTER TABLE global_zip_codes
    DROP CONSTRAINT uk_global_zip_codes_country_postal_city;

CREATE INDEX idx_global_zip_codes_tenant_id ON global_zip_codes (tenant_id);
