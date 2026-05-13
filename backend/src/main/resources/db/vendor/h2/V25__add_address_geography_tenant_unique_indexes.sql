CREATE UNIQUE INDEX uk_regions_tenant_country_code
ON regions (tenant_id, country_id, code);

CREATE UNIQUE INDEX uk_areas_tenant_region_code
ON areas (tenant_id, region_id, code);

CREATE UNIQUE INDEX uk_global_zip_codes_global_country_postal_city
ON global_zip_codes (tenant_scope_key, country_id, postal_code, city);
