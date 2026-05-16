import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize, switchMap, take } from 'rxjs';

import { FROZEN_MODULE_PERMISSION_SUMMARY, ModulePermissionSummary } from '../../core/authorization/permission-summary.models';
import { PermissionSummaryService } from '../../core/authorization/permission-summary.service';
import { AuthService } from '../../core/auth/auth.service';
import { resolveApiErrorMessage } from '../../core/i18n/api-error-message.util';
import { I18nKey } from '../../core/i18n/i18n.messages';
import { I18nService } from '../../core/i18n/i18n.service';
import { AppButtonComponent } from '../../shared/components/button/app-button.component';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { NotificationService } from '../../shared/feedback/notification.service';
import {
  DEFAULT_DEVICE_ADMIN_PAGE_SIZE,
  DeviceAdministrationColumn,
  DeviceAdministrationDeviceListItem,
  DeviceAdministrationPage,
  DeviceAdministrationQuery,
  DeviceAdministrationRowAction,
  DeviceAdministrationRowActionEvent,
  EMPTY_DEVICE_ADMIN_PAGE
} from './device-administration.models';
import { DeviceAdministrationService } from './device-administration.service';

@Component({
  selector: 'app-device-administration',
  imports: [AppButtonComponent, DataTableComponent],
  templateUrl: './device-administration.component.html',
  styleUrl: './device-administration.component.scss'
})
export class DeviceAdministrationComponent implements OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly permissionSummaryService = inject(PermissionSummaryService);
  private readonly router = inject(Router);
  private readonly deviceAdministrationService = inject(DeviceAdministrationService);
  protected readonly i18n = inject(I18nService);

  private loadSubscription?: Subscription;
  private readonly searchChanges = new Subject<string>();
  private readonly searchSubscription = this.searchChanges
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((search) => {
      this.appliedSearch.set(search.trim());
      this.pageIndex.set(0);
      this.loadDevices();
    });

  protected readonly columns = computed<readonly DeviceAdministrationColumn[]>(() => [
    { key: 'name', labelKey: 'masterData.columns.name', minWidth: '14rem' },
    { key: 'assetCode', labelKey: 'deviceAdministration.fields.assetCode', minWidth: '9rem' },
    { key: 'type.name', labelKey: 'deviceAdministration.fields.deviceType', minWidth: '11rem' },
    { key: 'brand.name', labelKey: 'deviceAdministration.fields.deviceBrand', minWidth: '11rem' },
    { key: 'model', labelKey: 'deviceAdministration.fields.model', minWidth: '10rem' },
    { key: 'serialNumber', labelKey: 'deviceAdministration.fields.serialNumber', minWidth: '10rem' },
    { key: 'deviceStatus.name', labelKey: 'deviceAdministration.fields.deviceStatus', minWidth: '10rem' },
    { key: 'tenant.name', labelKey: 'masterData.columns.tenant', minWidth: '11rem' },
    { key: 'companyProfile.name', labelKey: 'deviceAdministration.fields.companyProfile', minWidth: '12rem' },
    { key: 'active', labelKey: 'masterData.columns.active', type: 'boolean', minWidth: '7rem' },
    { key: 'updatedAt', labelKey: 'masterData.columns.updatedAt', type: 'datetime', minWidth: '9rem' }
  ]);
  protected readonly rowActions = computed<readonly DeviceAdministrationRowAction[]>(() => [
    {
      id: 'view',
      labelKey: 'masterData.actions.view',
      disabled: (row) => this.loading() || this.isBusy((row as DeviceAdministrationDeviceListItem).id) || !this.modulePermissions().canView
    },
    {
      id: 'edit',
      labelKey: 'masterData.actions.edit',
      disabled: (row) => this.loading() || this.isBusy((row as DeviceAdministrationDeviceListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'activate',
      labelKey: 'deviceAdministration.actions.activate',
      visible: (row) => !(row as DeviceAdministrationDeviceListItem).active,
      disabled: (row) => this.loading() || this.isBusy((row as DeviceAdministrationDeviceListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'deactivate',
      labelKey: 'deviceAdministration.actions.deactivate',
      tone: 'danger',
      confirmation: {
        titleKey: 'deviceAdministration.deactivate.confirmTitle',
        messageKey: 'deviceAdministration.deactivate.confirmMessage',
        confirmLabelKey: 'deviceAdministration.deactivate.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'warning',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as DeviceAdministrationDeviceListItem)
      },
      visible: (row) => (row as DeviceAdministrationDeviceListItem).active,
      disabled: (row) => this.loading() || this.isBusy((row as DeviceAdministrationDeviceListItem).id) || !this.modulePermissions().canUpdate
    },
    {
      id: 'deletePhysical',
      labelKey: 'deviceAdministration.actions.deletePhysical',
      tone: 'danger',
      confirmation: {
        titleKey: 'deviceAdministration.deletePhysical.confirmTitle',
        messageKey: 'deviceAdministration.deletePhysical.confirmMessage',
        confirmLabelKey: 'deviceAdministration.deletePhysical.confirmAction',
        cancelLabelKey: 'masterData.form.cancel',
        severity: 'danger',
        targetLabelKey: 'confirmDialog.target.selectedEntity',
        targetValue: (row) => this.confirmationTarget(row as DeviceAdministrationDeviceListItem)
      },
      disabled: (row) => this.loading() || this.isBusy((row as DeviceAdministrationDeviceListItem).id) || !this.modulePermissions().canDelete
    }
  ]);
  protected readonly pageSizeOptions = [10, 20, 50] as const;
  protected readonly pageData = signal<DeviceAdministrationPage<DeviceAdministrationDeviceListItem>>(EMPTY_DEVICE_ADMIN_PAGE);
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(DEFAULT_DEVICE_ADMIN_PAGE_SIZE);
  protected readonly searchInput = signal('');
  protected readonly appliedSearch = signal('');
  protected readonly loading = signal(false);
  protected readonly deleting = signal(false);
  protected readonly hasError = signal(false);
  protected readonly actingDeviceId = signal<string | null>(null);
  protected readonly modulePermissions = signal<ModulePermissionSummary>(FROZEN_MODULE_PERMISSION_SUMMARY);
  protected readonly rows = computed(() => this.pageData().content);
  protected readonly tableEmptyMessageKey = computed<I18nKey>(() =>
    this.appliedSearch() ? 'deviceAdministration.table.noResults' : 'deviceAdministration.table.empty'
  );

  constructor() {
    this.loadDevices();
  }

  ngOnDestroy(): void {
    this.loadSubscription?.unsubscribe();
    this.searchSubscription.unsubscribe();
  }

  protected updateSearch(event: Event): void {
    const nextSearch = (event.target as HTMLInputElement).value;
    this.searchInput.set(nextSearch);
    this.searchChanges.next(nextSearch);
  }

  protected createDevice(): void {
    if (!this.modulePermissions().canCreate) {
      return;
    }

    void this.router.navigate(['/admin/devices/new']);
  }

  protected handleRowAction(event: DeviceAdministrationRowActionEvent): void {
    const row = event.row as DeviceAdministrationDeviceListItem;

    if (event.action.id === 'view' && this.modulePermissions().canView) {
      void this.router.navigate(['/admin/devices', row.id]);
      return;
    }

    if (event.action.id === 'edit' && this.modulePermissions().canUpdate) {
      void this.router.navigate(['/admin/devices', row.id, 'edit']);
      return;
    }

    if (event.action.id === 'activate' && this.modulePermissions().canUpdate) {
      this.toggleDevice(row, true);
      return;
    }

    if (event.action.id === 'deactivate' && this.modulePermissions().canUpdate) {
      this.toggleDevice(row, false);
      return;
    }

    if (event.action.id === 'deletePhysical' && this.modulePermissions().canDelete) {
      this.deleteDevice(row);
    }
  }

  protected goToPreviousPage(): void {
    if (this.loading() || this.pageData().first) {
      return;
    }

    this.pageIndex.update((page) => Math.max(0, page - 1));
    this.loadDevices();
  }

  protected goToNextPage(): void {
    if (this.loading() || this.pageData().last) {
      return;
    }

    this.pageIndex.update((page) => page + 1);
    this.loadDevices();
  }

  protected goToPage(page: number): void {
    if (this.loading() || page === this.pageIndex()) {
      return;
    }

    this.pageIndex.set(page);
    this.loadDevices();
  }

  protected updatePageSize(size: number): void {
    if (this.loading() || size === this.pageSize()) {
      return;
    }

    this.pageSize.set(size);
    this.pageIndex.set(0);
    this.loadDevices();
  }

  private loadDevices(): void {
    this.loadSubscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.loadSubscription = this.authService.loadAuthenticatedUser()
      .pipe(
        take(1),
        switchMap((user) => {
          this.modulePermissions.set(this.permissionSummaryService.summaryForModule(user, 'devices'));
          const platformScope = user.userType.startsWith('PLATFORM_');
          return this.deviceAdministrationService.findDevices(platformScope ? null : user.tenantId, this.buildQuery());
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (pageData) => this.pageData.set(pageData),
        error: () => {
          this.modulePermissions.set(FROZEN_MODULE_PERMISSION_SUMMARY);
          this.pageData.set(this.emptyPage());
          this.hasError.set(true);
        }
      });
  }

  private toggleDevice(device: DeviceAdministrationDeviceListItem, active: boolean): void {
    this.actingDeviceId.set(device.id);
    this.loadSubscription?.unsubscribe();
    const request$ = active
      ? this.deviceAdministrationService.activateDevice(device.id)
      : this.deviceAdministrationService.deactivateDevice(device.id);

    this.loadSubscription = request$
      .pipe(finalize(() => this.actingDeviceId.set(null)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.i18n.t(active
            ? 'deviceAdministration.feedback.activateSuccess'
            : 'deviceAdministration.feedback.deactivateSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadDevices();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, active
            ? 'deviceAdministration.errors.activate'
            : 'deviceAdministration.errors.deactivate'), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private deleteDevice(device: DeviceAdministrationDeviceListItem): void {
    this.deleting.set(true);
    this.actingDeviceId.set(device.id);
    this.loadSubscription?.unsubscribe();
    this.loadSubscription = this.deviceAdministrationService.deleteDevice(device.id)
      .pipe(finalize(() => {
        this.deleting.set(false);
        this.actingDeviceId.set(null);
      }))
      .subscribe({
        next: () => {
          if (this.rows().length === 1 && this.pageIndex() > 0) {
            this.pageIndex.update((page) => Math.max(0, page - 1));
          }
          this.notificationService.success(this.i18n.t('deviceAdministration.feedback.deleteSuccess'), {
            titleKey: 'alert.title.success'
          });
          this.loadDevices();
        },
        error: (error) => {
          this.notificationService.error(this.resolveApiMessage(error, 'deviceAdministration.deletePhysical.error.generic', {
            401: 'deviceAdministration.deletePhysical.error.unauthorized',
            403: 'deviceAdministration.deletePhysical.error.forbidden',
            404: 'deviceAdministration.deletePhysical.error.notFound',
            409: 'deviceAdministration.deletePhysical.error.conflict'
          }), {
            titleKey: 'alert.title.danger',
            dismissible: true
          });
        }
      });
  }

  private buildQuery(): DeviceAdministrationQuery {
    return {
      page: this.pageIndex(),
      size: this.pageSize(),
      ...(this.appliedSearch() ? { search: this.appliedSearch() } : {})
    };
  }

  private emptyPage(): DeviceAdministrationPage<DeviceAdministrationDeviceListItem> {
    return {
      ...EMPTY_DEVICE_ADMIN_PAGE,
      page: this.pageIndex(),
      size: this.pageSize()
    };
  }

  private isBusy(deviceId: string): boolean {
    return this.deleting() || this.actingDeviceId() === deviceId;
  }

  private confirmationTarget(device: DeviceAdministrationDeviceListItem): string {
    return `${device.name} (${device.assetCode})`;
  }

  private resolveApiMessage(
    error: unknown,
    fallbackKey: I18nKey,
    statusKeys?: Partial<Record<number, I18nKey>>
  ): string {
    return resolveApiErrorMessage(this.i18n, error, { fallbackKey, statusKeys });
  }
}
