export interface PhoneFieldValue {
  readonly dialCode: string | null;
  readonly nationalNumber: string | null;
  readonly fullNumber: string | null;
}

export type PhoneFieldEmitMode = 'structured' | 'compat-string';
