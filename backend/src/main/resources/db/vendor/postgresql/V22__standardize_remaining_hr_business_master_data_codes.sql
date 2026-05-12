DROP TABLE IF EXISTS tmp_department_code_map;
CREATE TEMP TABLE tmp_department_code_map AS
SELECT id,
       tenant_id,
       code AS old_code,
       'DE' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM departments;

UPDATE departments
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_department_code_map
    WHERE old_code <> new_code
);

UPDATE departments
SET code = (
    SELECT map.new_code
    FROM tmp_department_code_map map
    WHERE map.id = departments.id
)
WHERE id IN (
    SELECT id
    FROM tmp_department_code_map
    WHERE old_code <> new_code
);

UPDATE employees
SET department = (
    SELECT map.new_code
    FROM tmp_department_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.department
)
WHERE EXISTS (
    SELECT 1
    FROM tmp_department_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.department
      AND map.old_code <> map.new_code
);

DROP TABLE IF EXISTS tmp_job_title_code_map;
CREATE TEMP TABLE tmp_job_title_code_map AS
SELECT id,
       tenant_id,
       code AS old_code,
       'JO' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM job_titles;

UPDATE job_titles
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_job_title_code_map
    WHERE old_code <> new_code
);

UPDATE job_titles
SET code = (
    SELECT map.new_code
    FROM tmp_job_title_code_map map
    WHERE map.id = job_titles.id
)
WHERE id IN (
    SELECT id
    FROM tmp_job_title_code_map
    WHERE old_code <> new_code
);

UPDATE employees
SET job_title = (
    SELECT map.new_code
    FROM tmp_job_title_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.job_title
)
WHERE EXISTS (
    SELECT 1
    FROM tmp_job_title_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.job_title
      AND map.old_code <> map.new_code
);

DROP TABLE IF EXISTS tmp_contract_type_code_map;
CREATE TEMP TABLE tmp_contract_type_code_map AS
SELECT id,
       tenant_id,
       code AS old_code,
       'CO' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM contract_types;

UPDATE contract_types
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_contract_type_code_map
    WHERE old_code <> new_code
);

UPDATE contract_types
SET code = (
    SELECT map.new_code
    FROM tmp_contract_type_code_map map
    WHERE map.id = contract_types.id
)
WHERE id IN (
    SELECT id
    FROM tmp_contract_type_code_map
    WHERE old_code <> new_code
);

UPDATE employees
SET contract_type = (
    SELECT map.new_code
    FROM tmp_contract_type_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.contract_type
)
WHERE EXISTS (
    SELECT 1
    FROM tmp_contract_type_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.contract_type
      AND map.old_code <> map.new_code
);

DROP TABLE IF EXISTS tmp_work_mode_code_map;
CREATE TEMP TABLE tmp_work_mode_code_map AS
SELECT id,
       tenant_id,
       code AS old_code,
       'WO' || LPAD(CAST(ROW_NUMBER() OVER (PARTITION BY tenant_id ORDER BY created_at, id) AS VARCHAR), 3, '0') AS new_code
FROM work_modes;

UPDATE work_modes
SET code = '__TMP__' || CAST(id AS VARCHAR)
WHERE id IN (
    SELECT id
    FROM tmp_work_mode_code_map
    WHERE old_code <> new_code
);

UPDATE work_modes
SET code = (
    SELECT map.new_code
    FROM tmp_work_mode_code_map map
    WHERE map.id = work_modes.id
)
WHERE id IN (
    SELECT id
    FROM tmp_work_mode_code_map
    WHERE old_code <> new_code
);

UPDATE employees
SET work_mode = (
    SELECT map.new_code
    FROM tmp_work_mode_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.work_mode
)
WHERE EXISTS (
    SELECT 1
    FROM tmp_work_mode_code_map map
    WHERE map.tenant_id = employees.tenant_id
      AND map.old_code = employees.work_mode
      AND map.old_code <> map.new_code
);

DROP TABLE IF EXISTS tmp_department_code_map;
DROP TABLE IF EXISTS tmp_job_title_code_map;
DROP TABLE IF EXISTS tmp_contract_type_code_map;
DROP TABLE IF EXISTS tmp_work_mode_code_map;
