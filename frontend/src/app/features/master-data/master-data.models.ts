import { I18nKey } from '../../core/i18n/i18n.messages';
import {
  DataTableAction,
  DataTableColumn,
  DataTableColumnType,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export type MasterDataCategoryId = 'global' | 'hrBusiness' | 'governanceSecurity';
export type MasterDataColumnKind = DataTableColumnType;
export const DEFAULT_MASTER_DATA_PAGE_SIZE = 20;

export type MasterDataColumn = DataTableColumn<MasterDataRow>;
export type MasterDataRowAction = DataTableAction<MasterDataRow>;
export type MasterDataRowActionEvent = DataTableRowActionEvent<MasterDataRow>;
export type MasterDataFormMode = 'create' | 'edit' | 'view';
export type MasterDataDeleteMode = 'deactivate' | 'physical';
export type MasterDataFormFieldType = 'text' | 'number' | 'email' | 'boolean';

export interface MasterDataFormField {
  readonly key: string;
  readonly labelKey: I18nKey;
  readonly type?: MasterDataFormFieldType;
  readonly required?: boolean;
  readonly readOnly?: boolean;
  readonly modes?: readonly MasterDataFormMode[];
}

export interface MasterDataFormConfig {
  readonly modes: readonly MasterDataFormMode[];
  readonly fields: readonly MasterDataFormField[];
}

export interface MasterDataResource {
  readonly id: string;
  readonly titleKey: I18nKey;
  readonly endpoint: string;
  readonly columns: readonly MasterDataColumn[];
  readonly rowActions?: readonly MasterDataRowAction[];
  readonly form?: MasterDataFormConfig;
  readonly autoCode?: boolean;
}

export interface MasterDataCategory {
  readonly id: MasterDataCategoryId;
  readonly titleKey: I18nKey;
  readonly resources: readonly MasterDataResource[];
}

export type MasterDataRow = Record<string, unknown>;

export interface MasterDataQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface MasterDataPage<T> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export interface MasterDataMutationRequest {
  readonly tenantId: string;
  readonly code?: string;
  readonly name: string;
  readonly active?: boolean;
}

export const EMPTY_MASTER_DATA_PAGE: MasterDataPage<MasterDataRow> = {
  content: [],
  page: 0,
  size: DEFAULT_MASTER_DATA_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};

const CODE_COLUMN: MasterDataColumn = {
  key: 'code',
  labelKey: 'masterData.columns.code'
};

const NAME_COLUMN: MasterDataColumn = {
  key: 'name',
  labelKey: 'masterData.columns.name'
};

const ACTIVE_COLUMN: MasterDataColumn = {
  key: 'active',
  labelKey: 'masterData.columns.active',
  type: 'boolean'
};

const UPDATED_AT_COLUMN: MasterDataColumn = {
  key: 'updatedAt',
  labelKey: 'masterData.columns.updatedAt',
  type: 'datetime'
};

const TENANT_COLUMN: MasterDataColumn = {
  key: 'tenantId',
  labelKey: 'masterData.columns.tenant'
};

const COUNTRY_COLUMN: MasterDataColumn = {
  key: 'country.name',
  labelKey: 'masterData.columns.country'
};

const REGION_COLUMN: MasterDataColumn = {
  key: 'region.name',
  labelKey: 'masterData.columns.region'
};

const AREA_COLUMN: MasterDataColumn = {
  key: 'area.name',
  labelKey: 'masterData.columns.area'
};

const POSTAL_CODE_COLUMN: MasterDataColumn = {
  key: 'postalCode',
  labelKey: 'masterData.columns.postalCode'
};

const CITY_COLUMN: MasterDataColumn = {
  key: 'city',
  labelKey: 'masterData.columns.city'
};

const PROVINCE_CODE_COLUMN: MasterDataColumn = {
  key: 'provinceCode',
  labelKey: 'masterData.columns.provinceCode'
};

const REGEX_PATTERN_COLUMN: MasterDataColumn = {
  key: 'regexPattern',
  labelKey: 'masterData.columns.regexPattern'
};

const SEVERITY_LEVEL_COLUMN: MasterDataColumn = {
  key: 'severityLevel',
  labelKey: 'masterData.columns.severityLevel'
};

const STRONG_AUTH_REQUIRED_COLUMN: MasterDataColumn = {
  key: 'strongAuthRequired',
  labelKey: 'masterData.columns.strongAuthRequired',
  type: 'boolean'
};

const SYSTEM_ROLE_COLUMN: MasterDataColumn = {
  key: 'systemRole',
  labelKey: 'masterData.columns.systemFlag',
  type: 'boolean'
};

const SYSTEM_PERMISSION_COLUMN: MasterDataColumn = {
  key: 'systemPermission',
  labelKey: 'masterData.columns.systemFlag',
  type: 'boolean'
};

function describeConfirmationTarget(row: MasterDataRow): string | null {
  const name = row['name'];
  if (typeof name === 'string' && name.trim().length > 0) {
    return name;
  }

  const code = row['code'];
  if (typeof code === 'string' && code.trim().length > 0) {
    return code;
  }

  const id = row['id'];
  return typeof id === 'string' && id.trim().length > 0 ? id : null;
}

const STANDARD_CRUD_ROW_ACTIONS: readonly MasterDataRowAction[] = [
  {
    id: 'view',
    labelKey: 'masterData.actions.view'
  },
  {
    id: 'edit',
    labelKey: 'masterData.actions.edit'
  },
  {
    id: 'deactivate',
    labelKey: 'masterData.actions.delete',
    tone: 'danger',
    confirmation: {
      titleKey: 'masterData.delete.confirmTitle',
      messageKey: 'masterData.delete.confirmMessage',
      confirmLabelKey: 'masterData.delete.confirmAction',
      cancelLabelKey: 'masterData.form.cancel',
      severity: 'warning',
      targetLabelKey: 'confirmDialog.target.selectedEntity',
      targetValue: (row) => describeConfirmationTarget(row)
    }
  }
] as const;

const PHYSICAL_DELETE_ROW_ACTION: readonly MasterDataRowAction[] = [
  {
    id: 'deletePhysical',
    labelKey: 'masterData.actions.deletePhysical',
    tone: 'danger',
    confirmation: {
      titleKey: 'masterData.deletePhysical.confirmTitle',
      messageKey: 'masterData.deletePhysical.confirmMessage',
      confirmLabelKey: 'masterData.deletePhysical.confirmAction',
      cancelLabelKey: 'masterData.form.cancel',
      severity: 'danger',
      targetLabelKey: 'confirmDialog.target.selectedEntity',
      targetValue: (row) => describeConfirmationTarget(row)
    }
  } as const
];

const STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS: readonly MasterDataRowAction[] = [
  ...STANDARD_CRUD_ROW_ACTIONS,
  ...PHYSICAL_DELETE_ROW_ACTION
];

const STANDARD_CRUD_FORM: MasterDataFormConfig = {
  modes: ['create', 'edit', 'view'],
  fields: [
    {
      key: 'code',
      labelKey: 'masterData.columns.code',
      required: true
    },
    {
      key: 'name',
      labelKey: 'masterData.columns.name',
      required: true
    },
    {
      key: 'active',
      labelKey: 'masterData.columns.active',
      type: 'boolean'
    }
  ]
} as const;

const STANDARD_CRUD_AUTO_CODE_FORM: MasterDataFormConfig = {
  modes: ['create', 'edit', 'view'],
  fields: [
    {
      key: 'code',
      labelKey: 'masterData.columns.code',
      readOnly: true,
      modes: ['edit', 'view']
    },
    {
      key: 'name',
      labelKey: 'masterData.columns.name',
      required: true
    },
    {
      key: 'active',
      labelKey: 'masterData.columns.active',
      type: 'boolean'
    }
  ]
} as const;

export const MASTER_DATA_CATEGORIES: readonly MasterDataCategory[] = [
  {
    id: 'global',
    titleKey: 'masterData.category.global',
    resources: [
      {
        id: 'countries',
        titleKey: 'masterData.entities.countries',
        endpoint: '/api/master-data/global/countries',
        columns: [
          { key: 'isoCode', labelKey: 'masterData.columns.code' },
          NAME_COLUMN,
          ACTIVE_COLUMN,
          UPDATED_AT_COLUMN
        ]
      },
      {
        id: 'regions',
        titleKey: 'masterData.entities.regions',
        endpoint: '/api/master-data/global/regions',
        columns: [COUNTRY_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'areas',
        titleKey: 'masterData.entities.areas',
        endpoint: '/api/master-data/global/areas',
        columns: [COUNTRY_COLUMN, REGION_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'zip-codes',
        titleKey: 'masterData.entities.zipCodes',
        endpoint: '/api/master-data/global/zip-codes',
        columns: [
          { key: 'country.code', labelKey: 'masterData.columns.country' },
          POSTAL_CODE_COLUMN,
          CITY_COLUMN,
          PROVINCE_CODE_COLUMN,
          ACTIVE_COLUMN
        ]
      },
      {
        id: 'currencies',
        titleKey: 'masterData.entities.currencies',
        endpoint: '/api/master-data/global/currencies',
        columns: [CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'genders',
        titleKey: 'masterData.entities.genders',
        endpoint: '/api/master-data/global/genders',
        columns: [CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'marital-statuses',
        titleKey: 'masterData.entities.maritalStatuses',
        endpoint: '/api/master-data/global/marital-statuses',
        columns: [CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'national-identifier-types',
        titleKey: 'masterData.entities.nationalIdentifierTypes',
        endpoint: '/api/master-data/global/national-identifier-types',
        columns: [COUNTRY_COLUMN, CODE_COLUMN, NAME_COLUMN, REGEX_PATTERN_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      }
    ]
  },
  {
    id: 'hrBusiness',
    titleKey: 'masterData.category.hrBusiness',
    resources: [
      {
        id: 'departments',
        titleKey: 'masterData.entities.departments',
        endpoint: '/api/master-data/hr-business/departments',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_FORM
      },
      {
        id: 'job-titles',
        titleKey: 'masterData.entities.jobTitles',
        endpoint: '/api/master-data/hr-business/job-titles',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_FORM
      },
      {
        id: 'contract-types',
        titleKey: 'masterData.entities.contractTypes',
        endpoint: '/api/master-data/hr-business/contract-types',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_FORM
      },
      {
        id: 'employment-statuses',
        titleKey: 'masterData.entities.employmentStatuses',
        endpoint: '/api/master-data/hr-business/employment-statuses',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_AUTO_CODE_FORM,
        autoCode: true
      },
      {
        id: 'work-modes',
        titleKey: 'masterData.entities.workModes',
        endpoint: '/api/master-data/hr-business/work-modes',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_FORM
      },
      {
        id: 'leave-request-types',
        titleKey: 'masterData.entities.leaveRequestTypes',
        endpoint: '/api/master-data/hr-business/leave-request-types',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_AUTO_CODE_FORM,
        autoCode: true
      },
      {
        id: 'document-types',
        titleKey: 'masterData.entities.documentTypes',
        endpoint: '/api/master-data/hr-business/document-types',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_AUTO_CODE_FORM,
        autoCode: true
      },
      {
        id: 'device-types',
        titleKey: 'masterData.entities.deviceTypes',
        endpoint: '/api/master-data/hr-business/device-types',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_AUTO_CODE_FORM,
        autoCode: true
      },
      {
        id: 'device-brands',
        titleKey: 'masterData.entities.deviceBrands',
        endpoint: '/api/master-data/hr-business/device-brands',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_AUTO_CODE_FORM,
        autoCode: true
      },
      {
        id: 'device-statuses',
        titleKey: 'masterData.entities.deviceStatuses',
        endpoint: '/api/master-data/hr-business/device-statuses',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN],
        rowActions: STANDARD_CRUD_WITH_PHYSICAL_DELETE_ROW_ACTIONS,
        form: STANDARD_CRUD_AUTO_CODE_FORM,
        autoCode: true
      }
    ]
  },
  {
    id: 'governanceSecurity',
    titleKey: 'masterData.category.governanceSecurity',
    resources: [
      {
        id: 'user-types',
        titleKey: 'masterData.entities.userTypes',
        endpoint: '/api/master-data/governance-security/user-types',
        columns: [CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'authentication-methods',
        titleKey: 'masterData.entities.authenticationMethods',
        endpoint: '/api/master-data/governance-security/authentication-methods',
        columns: [CODE_COLUMN, NAME_COLUMN, STRONG_AUTH_REQUIRED_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'audit-action-types',
        titleKey: 'masterData.entities.auditActionTypes',
        endpoint: '/api/master-data/governance-security/audit-action-types',
        columns: [CODE_COLUMN, NAME_COLUMN, SEVERITY_LEVEL_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'disciplinary-action-types',
        titleKey: 'masterData.entities.disciplinaryActionTypes',
        endpoint: '/api/master-data/governance-security/disciplinary-action-types',
        columns: [CODE_COLUMN, NAME_COLUMN, SEVERITY_LEVEL_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'smtp-encryption-types',
        titleKey: 'masterData.entities.smtpEncryptionTypes',
        endpoint: '/api/master-data/governance-security/smtp-encryption-types',
        columns: [CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'roles',
        titleKey: 'masterData.entities.roles',
        endpoint: '/api/master-data/governance-security/roles',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, SYSTEM_ROLE_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'permissions',
        titleKey: 'masterData.entities.permissions',
        endpoint: '/api/master-data/governance-security/permissions',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, SYSTEM_PERMISSION_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'company-profile-types',
        titleKey: 'masterData.entities.companyProfileTypes',
        endpoint: '/api/master-data/governance-security/company-profile-types',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      },
      {
        id: 'office-location-types',
        titleKey: 'masterData.entities.officeLocationTypes',
        endpoint: '/api/master-data/governance-security/office-location-types',
        columns: [TENANT_COLUMN, CODE_COLUMN, NAME_COLUMN, ACTIVE_COLUMN, UPDATED_AT_COLUMN]
      }
    ]
  }
] as const;
