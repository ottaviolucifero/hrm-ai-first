DROP TABLE IF EXISTS tmp_employment_status_code_map;
CREATE TEMP TABLE tmp_employment_status_code_map AS
SELECT id,
       tenant_id,
       code AS old_code,
       'ES' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM employment_statuses;

UPDATE employment_statuses
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_employment_status_code_map
    WHERE old_code <> new_code
);

UPDATE employment_statuses
SET code = (
    SELECT map.new_code
    FROM tmp_employment_status_code_map map
    WHERE map.id = employment_statuses.id
)
WHERE id IN (
    SELECT id
    FROM tmp_employment_status_code_map
    WHERE old_code <> new_code
);

UPDATE employees
SET employment_status = (
    SELECT map.new_code
    FROM tmp_employment_status_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.employment_status
)
WHERE EXISTS (
    SELECT 1
    FROM tmp_employment_status_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.employment_status
      AND map.old_code <> map.new_code
);

DROP TABLE IF EXISTS tmp_leave_request_type_code_map;
CREATE TEMP TABLE tmp_leave_request_type_code_map AS
SELECT id,
       code AS old_code,
       'LR' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM leave_request_types;

UPDATE leave_request_types
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_leave_request_type_code_map
    WHERE old_code <> new_code
);

UPDATE leave_request_types
SET code = (
    SELECT map.new_code
    FROM tmp_leave_request_type_code_map map
    WHERE map.id = leave_request_types.id
)
WHERE id IN (
    SELECT id
    FROM tmp_leave_request_type_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_document_type_code_map;
CREATE TEMP TABLE tmp_document_type_code_map AS
SELECT id,
       code AS old_code,
       'DT' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM document_types;

UPDATE document_types
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_document_type_code_map
    WHERE old_code <> new_code
);

UPDATE document_types
SET code = (
    SELECT map.new_code
    FROM tmp_document_type_code_map map
    WHERE map.id = document_types.id
)
WHERE id IN (
    SELECT id
    FROM tmp_document_type_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_device_type_code_map;
CREATE TEMP TABLE tmp_device_type_code_map AS
SELECT id,
       code AS old_code,
       'DV' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM device_types;

UPDATE device_types
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_device_type_code_map
    WHERE old_code <> new_code
);

UPDATE device_types
SET code = (
    SELECT map.new_code
    FROM tmp_device_type_code_map map
    WHERE map.id = device_types.id
)
WHERE id IN (
    SELECT id
    FROM tmp_device_type_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_device_brand_code_map;
CREATE TEMP TABLE tmp_device_brand_code_map AS
SELECT id,
       code AS old_code,
       'DB' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM device_brands;

UPDATE device_brands
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_device_brand_code_map
    WHERE old_code <> new_code
);

UPDATE device_brands
SET code = (
    SELECT map.new_code
    FROM tmp_device_brand_code_map map
    WHERE map.id = device_brands.id
)
WHERE id IN (
    SELECT id
    FROM tmp_device_brand_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_device_status_code_map;
CREATE TEMP TABLE tmp_device_status_code_map AS
SELECT id,
       code AS old_code,
       'DS' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM device_statuses;

UPDATE device_statuses
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_device_status_code_map
    WHERE old_code <> new_code
);

UPDATE device_statuses
SET code = (
    SELECT map.new_code
    FROM tmp_device_status_code_map map
    WHERE map.id = device_statuses.id
)
WHERE id IN (
    SELECT id
    FROM tmp_device_status_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_employment_status_code_map;
DROP TABLE IF EXISTS tmp_leave_request_type_code_map;
DROP TABLE IF EXISTS tmp_document_type_code_map;
DROP TABLE IF EXISTS tmp_device_type_code_map;
DROP TABLE IF EXISTS tmp_device_brand_code_map;
DROP TABLE IF EXISTS tmp_device_status_code_map;
