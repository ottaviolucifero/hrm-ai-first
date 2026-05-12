DROP TABLE IF EXISTS tmp_company_profile_type_code_map;
CREATE TEMP TABLE tmp_company_profile_type_code_map AS
SELECT id,
       tenant_id,
       code AS old_code,
       'CP' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM company_profile_types;

UPDATE company_profile_types
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_company_profile_type_code_map
    WHERE old_code <> new_code
);

UPDATE company_profile_types
SET code = (
    SELECT map.new_code
    FROM tmp_company_profile_type_code_map map
    WHERE map.id = company_profile_types.id
)
WHERE id IN (
    SELECT id
    FROM tmp_company_profile_type_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_office_location_type_code_map;
CREATE TEMP TABLE tmp_office_location_type_code_map AS
SELECT id,
       tenant_id,
       code AS old_code,
       'OL' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM office_location_types;

UPDATE office_location_types
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_office_location_type_code_map
    WHERE old_code <> new_code
);

UPDATE office_location_types
SET code = (
    SELECT map.new_code
    FROM tmp_office_location_type_code_map map
    WHERE map.id = office_location_types.id
)
WHERE id IN (
    SELECT id
    FROM tmp_office_location_type_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_disciplinary_action_type_code_map;
CREATE TEMP TABLE tmp_disciplinary_action_type_code_map AS
SELECT id,
       code AS old_code,
       'DA' || LPAD(CAST(ROW_NUMBER() OVER (ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM disciplinary_action_types;

UPDATE disciplinary_action_types
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_disciplinary_action_type_code_map
    WHERE old_code <> new_code
);

UPDATE disciplinary_action_types
SET code = (
    SELECT map.new_code
    FROM tmp_disciplinary_action_type_code_map map
    WHERE map.id = disciplinary_action_types.id
)
WHERE id IN (
    SELECT id
    FROM tmp_disciplinary_action_type_code_map
    WHERE old_code <> new_code
);

DROP TABLE IF EXISTS tmp_company_profile_type_code_map;
DROP TABLE IF EXISTS tmp_office_location_type_code_map;
DROP TABLE IF EXISTS tmp_disciplinary_action_type_code_map;
