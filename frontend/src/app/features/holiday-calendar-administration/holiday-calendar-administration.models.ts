import {
  DataTableAction,
  DataTableColumn,
  DataTablePage,
  DataTableRow,
  DataTableRowActionEvent
} from '../../shared/components/data-table/data-table.models';

export const DEFAULT_HOLIDAY_CALENDAR_PAGE_SIZE = 20;
export const DEFAULT_HOLIDAY_PAGE_SIZE = 10;

export interface HolidayCalendarAdministrationReference {
  readonly id: string;
  readonly code: string;
  readonly name: string;
}

export type HolidayCalendarScope = 'GLOBAL' | 'TENANT' | 'COMPANY_PROFILE';
export type HolidayType = 'FIXED' | 'MOBILE';
export type HolidayGenerationRule = 'FIXED_DATE' | 'MANUAL' | 'EASTER_BASED';

export interface HolidayCalendarAdministrationCalendarListItem extends DataTableRow {
  readonly id: string;
  readonly country: HolidayCalendarAdministrationReference;
  readonly year: number;
  readonly name: string;
  readonly scope: HolidayCalendarScope;
  readonly tenant: HolidayCalendarAdministrationReference | null;
  readonly companyProfile: HolidayCalendarAdministrationReference | null;
  readonly active: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface HolidayCalendarAdministrationCalendarDetail extends HolidayCalendarAdministrationCalendarListItem {}

export interface HolidayCalendarAdministrationCalendarCreateRequest {
  readonly countryId: string;
  readonly year: number;
  readonly name: string;
  readonly scope: HolidayCalendarScope;
  readonly tenantId: string | null;
  readonly companyProfileId: string | null;
}

export interface HolidayCalendarAdministrationCalendarUpdateRequest {
  readonly countryId: string;
  readonly year: number;
  readonly name: string;
  readonly scope: HolidayCalendarScope;
  readonly tenantId: string | null;
  readonly companyProfileId: string | null;
}

export interface HolidayCalendarAdministrationHolidayListItem extends DataTableRow {
  readonly id: string;
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly type: HolidayType;
  readonly generationRule: HolidayGenerationRule;
  readonly description: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface HolidayCalendarAdministrationHolidayDetail extends HolidayCalendarAdministrationHolidayListItem {
  readonly holidayCalendarId: string;
}

export interface HolidayCalendarAdministrationHolidayCreateRequest {
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly type: HolidayType;
  readonly generationRule: HolidayGenerationRule;
  readonly description: string | null;
}

export interface HolidayCalendarAdministrationHolidayUpdateRequest {
  readonly name: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly type: HolidayType;
  readonly generationRule: HolidayGenerationRule;
  readonly description: string | null;
}

export interface HolidayCalendarAdministrationQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface HolidayCalendarAdministrationPage<T> extends DataTablePage {
  readonly content: readonly T[];
}

export type HolidayCalendarAdministrationColumn = DataTableColumn;
export type HolidayCalendarAdministrationRowAction = DataTableAction;
export type HolidayCalendarAdministrationRowActionEvent = DataTableRowActionEvent;

export const EMPTY_HOLIDAY_CALENDAR_PAGE: HolidayCalendarAdministrationPage<HolidayCalendarAdministrationCalendarListItem> = {
  content: [],
  page: 0,
  size: DEFAULT_HOLIDAY_CALENDAR_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true
};
