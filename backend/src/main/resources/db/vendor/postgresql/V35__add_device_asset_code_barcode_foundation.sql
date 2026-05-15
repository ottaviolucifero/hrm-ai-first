ALTER TABLE devices
    ADD COLUMN asset_code VARCHAR(50),
    ADD COLUMN barcode_value VARCHAR(50);

WITH generated_codes AS (
    SELECT d.id,
           'DEV' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY d.tenant_id ORDER BY d.created_at, d.id) AS VARCHAR), 6, '0') AS generated_asset_code
    FROM devices d
)
UPDATE devices d
SET asset_code = generated_codes.generated_asset_code,
    barcode_value = generated_codes.generated_asset_code,
    updated_at = CURRENT_TIMESTAMP
FROM generated_codes
WHERE d.id = generated_codes.id;

ALTER TABLE devices
    ALTER COLUMN asset_code SET NOT NULL,
    ALTER COLUMN barcode_value SET NOT NULL;

ALTER TABLE devices
    ADD CONSTRAINT uk_devices_tenant_asset_code UNIQUE (tenant_id, asset_code),
    ADD CONSTRAINT uk_devices_tenant_barcode_value UNIQUE (tenant_id, barcode_value);
