ALTER TABLE devices
    ADD COLUMN asset_code VARCHAR(50);

ALTER TABLE devices
    ADD COLUMN barcode_value VARCHAR(50);

MERGE INTO devices AS target
USING (
    WITH generated_codes AS (
        SELECT d.id,
               'DEV' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY d.tenant_id ORDER BY d.created_at, d.id) AS VARCHAR), 6, '0') AS generated_asset_code
        FROM devices d
    )
    SELECT generated_codes.id,
           generated_codes.generated_asset_code
    FROM generated_codes
) AS source
ON target.id = source.id
WHEN MATCHED THEN UPDATE
SET target.asset_code = source.generated_asset_code,
    target.barcode_value = source.generated_asset_code,
    target.updated_at = CURRENT_TIMESTAMP;

ALTER TABLE devices
    ALTER COLUMN asset_code SET NOT NULL;

ALTER TABLE devices
    ALTER COLUMN barcode_value SET NOT NULL;

ALTER TABLE devices
    ADD CONSTRAINT uk_devices_tenant_asset_code UNIQUE (tenant_id, asset_code);

ALTER TABLE devices
    ADD CONSTRAINT uk_devices_tenant_barcode_value UNIQUE (tenant_id, barcode_value);
