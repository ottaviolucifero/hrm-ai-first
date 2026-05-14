import {
  DataTableAction,
  DataTableColumn,
  DataTableRow,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export const DEFAULT_COMPANY_PROFILE_ADMIN_PAGE_SIZE = 20;

export interface CompanyProfileAdministrationReference {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export interface CompanyProfileAdministrationCompanyProfileTypeOption extends CompanyProfileAdministrationReference {
  readonly tenantId: string;
}

export interface CompanyProfileAdministrationRegionOption extends CompanyProfileAdministrationReference {
  readonly tenantId: string;
  readonly countryId: string;
}

export interface CompanyProfileAdministrationAreaOption extends CompanyProfileAdministrationReference {
  readonly tenantId: string;
  readonly countryId: string;
  readonly regionId: string;
}

export interface CompanyProfileAdministrationGlobalZipCodeOption extends CompanyProfileAdministrationReference {
  readonly tenantId: string | null;
  readonly countryId: string;
  readonly countryName?: string | null;
  readonly regionId: string | null;
  readonly regionName?: string | null;
  readonly areaId: string | null;
  readonly areaCode?: string | null;
  readonly areaName?: string | null;
  readonly provinceName?: string | null;
  readonly provinceCode?: string | null;
}

export interface CompanyProfileAdministrationCompanyProfileListItem extends DataTableRow {
  readonly id: string;
  readonly tenant: CompanyProfileAdministrationReference;
  readonly companyProfileType: CompanyProfileAdministrationReference;
  readonly code: string;
  readonly legalName: string;
  readonly tradeName: string;
  readonly vatNumber: string | null;
  readonly taxNumber: string | null;
  readonly taxIdentifier?: string | null;
  readonly country: CompanyProfileAdministrationReference;
  readonly active: boolean;
  readonly updatedAt: string;
}

export interface CompanyProfileAdministrationCompanyProfileDetail extends CompanyProfileAdministrationCompanyProfileListItem {
  readonly taxIdentifier: string | null;
  readonly email: string | null;
  readonly pecEmail: string | null;
  readonly phone: string | null;
  readonly sdiCode: string | null;
  readonly region: CompanyProfileAdministrationReference | null;
  readonly area: CompanyProfileAdministrationReference | null;
  readonly globalZipCode: CompanyProfileAdministrationReference | null;
  readonly street: string;
  readonly streetNumber: string;
  readonly createdAt: string;
}

export interface CompanyProfileAdministrationQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface CompanyProfileAdministrationCreateRequest {
  readonly tenantId: string;
  readonly companyProfileTypeId: string;
  readonly legalName: string;
  readonly tradeName: string;
  readonly vatNumber: string | null;
  readonly taxIdentifier: string | null;
  readonly taxNumber: string | null;
  readonly email: string | null;
  readonly pecEmail: string | null;
  readonly phone: string | null;
  readonly sdiCode: string | null;
  readonly countryId: string;
  readonly regionId: string | null;
  readonly areaId: string | null;
  readonly globalZipCodeId: string | null;
  readonly street: string;
  readonly streetNumber: string;
}

export interface CompanyProfileAdministrationUpdateRequest {
  readonly companyProfileTypeId: string;
  readonly legalName: string;
  readonly tradeName: string;
  readonly vatNumber: string | null;
  readonly taxIdentifier: string | null;
  readonly taxNumber: string | null;
  readonly email: string | null;
  readonly pecEmail: string | null;
  readonly phone: string | null;
  readonly sdiCode: string | null;
  readonly countryId: string;
  readonly regionId: string | null;
  readonly areaId: string | null;
  readonly globalZipCodeId: string | null;
  readonly street: string;
  readonly streetNumber: string;
}

export interface CompanyProfileAdministrationFormOptions {
  readonly tenants: readonly CompanyProfileAdministrationReference[];
  readonly companyProfileTypes: readonly CompanyProfileAdministrationCompanyProfileTypeOption[];
  readonly countries: readonly CompanyProfileAdministrationReference[];
  readonly regions: readonly CompanyProfileAdministrationRegionOption[];
  readonly areas: readonly CompanyProfileAdministrationAreaOption[];
  readonly globalZipCodes: readonly CompanyProfileAdministrationGlobalZipCodeOption[];
}

export interface CompanyProfileAdministrationPage<T> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export type CompanyProfileAdministrationColumn = DataTableColumn;
export type CompanyProfileAdministrationRowAction = DataTableAction;
export type CompanyProfileAdministrationRowActionEvent = DataTableRowActionEvent;

export const EMPTY_COMPANY_PROFILE_ADMIN_PAGE: CompanyProfileAdministrationPage<CompanyProfileAdministrationCompanyProfileListItem> = {
  content: [],
  page: 0,
  size: DEFAULT_COMPANY_PROFILE_ADMIN_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};
