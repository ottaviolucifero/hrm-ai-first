import { Observable } from 'rxjs';

export interface LookupOption {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly extraLabel?: string | null;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface LookupQuery {
  readonly page: number;
  readonly size: number;
  readonly search?: string;
}

export interface LookupPage<T = LookupOption> {
  readonly content: readonly T[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
  readonly first: boolean;
  readonly last: boolean;
}

export type LookupLoadFn = (query: LookupQuery) => Observable<LookupPage<LookupOption>>;
