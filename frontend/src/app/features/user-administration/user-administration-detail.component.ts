import { Component, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, finalize } from 'rxjs';

import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { UserAdministrationUserDetail } from './user-administration.models';
import { UserAdministrationService } from './user-administration.service';

interface ReadOnlyField {
  readonly labelKey: I18nKey;
  readonly value: string;
}

@Component({
  selector: 'app-user-administration-detail',
  imports: [AppButtonComponent],
  templateUrl: './user-administration-detail.component.html',
  styleUrl: './user-administration-detail.component.scss'
})
export class UserAdministrationDetailComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userAdministrationService = inject(UserAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;

  protected readonly loading = signal(false);
  protected readonly hasError = signal(false);
  protected readonly user = signal<UserAdministrationUserDetail | null>(null);

  constructor() {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
  }

  protected goBack(): void {
    void this.router.navigate(['/admin/users']);
  }

  protected retry(): void {
    this.loadUser();
  }

  protected identityFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.columns.displayName', value: user.displayName },
      { labelKey: 'userAdministration.columns.email', value: user.email },
      { labelKey: 'userAdministration.columns.firstName', value: this.valueOrDash(user.firstName) },
      { labelKey: 'userAdministration.columns.lastName', value: this.valueOrDash(user.lastName) },
      { labelKey: 'userAdministration.columns.userType', value: user.userType.code },
      { labelKey: 'userAdministration.detail.employee', value: user.employee ? `${user.employee.employeeCode} - ${user.employee.firstName} ${user.employee.lastName}` : this.i18n.t('userAdministration.values.none') }
    ];
  }

  protected tenantFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'masterData.columns.tenant', value: this.referenceLabel(user.tenant) },
      { labelKey: 'userAdministration.detail.primaryTenant', value: user.primaryTenant ? this.referenceLabel(user.primaryTenant) : this.i18n.t('userAdministration.values.none') },
      { labelKey: 'userAdministration.detail.companyProfile', value: user.companyProfile ? `${user.companyProfile.code} - ${user.companyProfile.tradeName}` : this.i18n.t('userAdministration.values.none') }
    ];
  }

  protected securityFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.detail.authenticationMethod', value: user.authenticationMethod.code },
      { labelKey: 'userAdministration.detail.preferredLanguage', value: this.valueOrDash(user.preferredLanguage) },
      { labelKey: 'userAdministration.detail.timeZone', value: user.timeZone ? this.referenceLabel(user.timeZone) : this.i18n.t('userAdministration.values.none') },
      { labelKey: 'masterData.columns.active', value: this.booleanValue(user.active) },
      { labelKey: 'userAdministration.columns.locked', value: this.booleanValue(user.locked) },
      { labelKey: 'userAdministration.detail.emailVerifiedAt', value: this.dateValue(user.emailVerifiedAt) },
      { labelKey: 'userAdministration.detail.passwordChangedAt', value: this.dateValue(user.passwordChangedAt) },
      { labelKey: 'userAdministration.detail.lastLoginAt', value: this.dateValue(user.lastLoginAt) },
      { labelKey: 'userAdministration.detail.failedLoginAttempts', value: String(user.failedLoginAttempts) },
      { labelKey: 'userAdministration.detail.emailOtpEnabled', value: this.booleanValue(user.emailOtpEnabled) },
      { labelKey: 'userAdministration.detail.appOtpEnabled', value: this.booleanValue(user.appOtpEnabled) },
      { labelKey: 'masterData.columns.strongAuthRequired', value: this.booleanValue(user.strongAuthenticationRequired) }
    ];
  }

  protected auditFields(user: UserAdministrationUserDetail): readonly ReadOnlyField[] {
    return [
      { labelKey: 'userAdministration.detail.createdAt', value: this.dateValue(user.createdAt) },
      { labelKey: 'masterData.columns.updatedAt', value: this.dateValue(user.updatedAt) }
    ];
  }

  private loadUser(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (!userId) {
      this.hasError.set(true);
      return;
    }

    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.userAdministrationService.findUserById(userId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (user) => this.user.set(user),
        error: () => {
          this.user.set(null);
          this.hasError.set(true);
        }
      });
  }

  private referenceLabel(reference: { code: string; name: string }): string {
    return `${reference.code} - ${reference.name}`;
  }

  private booleanValue(value: boolean): string {
    return value ? this.i18n.t('dataTable.boolean.yes') : this.i18n.t('dataTable.boolean.no');
  }

  private dateValue(value: string | null): string {
    if (!value) {
      return this.i18n.t('userAdministration.values.none');
    }

    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat(this.i18n.language(), {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(parsedDate);
  }

  private valueOrDash(value: string | null): string {
    return value?.trim() ? value : this.i18n.t('userAdministration.values.none');
  }
}
