import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';

import { I18nKey } from '../../../core/i18n/i18n.messages';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AppButtonComponent, AppButtonVariant } from '../button/app-button.component';
import { ConfirmDialogConfig, ConfirmDialogMode, ConfirmDialogSeverity } from './confirm-dialog.models';

@Component({
  selector: 'app-confirm-dialog',
  imports: [NgClass, AppButtonComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  private static nextId = 0;

  protected readonly i18n = inject(I18nService);
  private readonly dialogId = `confirm-dialog-${ConfirmDialogComponent.nextId += 1}`;

  @Input({ required: true }) config!: ConfirmDialogConfig;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  protected titleId(): string {
    return `${this.dialogId}-title`;
  }

  protected descriptionId(): string {
    return `${this.dialogId}-description`;
  }

  protected targetVisible(config: ConfirmDialogConfig): boolean {
    return this.targetValue(config) !== null;
  }

  protected targetValue(config: ConfirmDialogConfig): string | null {
    const value = config.targetValue;
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
  }

  protected cancelLabelKey(config: ConfirmDialogConfig): I18nKey {
    return config.cancelLabelKey ?? 'confirmDialog.actions.cancel';
  }

  protected confirmLabelKey(config: ConfirmDialogConfig): I18nKey {
    return config.confirmLabelKey ?? (this.mode(config) === 'message'
      ? 'confirmDialog.actions.close'
      : 'confirmDialog.actions.confirm');
  }

  protected severity(config: ConfirmDialogConfig): ConfirmDialogSeverity {
    return config.severity ?? 'info';
  }

  protected mode(config: ConfirmDialogConfig): ConfirmDialogMode {
    return config.mode ?? 'confirm';
  }

  protected iconClass(config: ConfirmDialogConfig): string {
    const icons: Record<ConfirmDialogSeverity, string> = {
      info: 'ki-filled ki-information-2',
      success: 'ki-filled ki-check-circle',
      warning: 'ki-filled ki-notification-status',
      danger: 'ki-filled ki-trash',
      error: 'ki-filled ki-cross-circle'
    };

    return icons[this.severity(config)];
  }

  protected primaryVariant(config: ConfirmDialogConfig): AppButtonVariant {
    switch (this.severity(config)) {
      case 'danger':
      case 'error':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'info':
      case 'success':
      default:
        return 'primary';
    }
  }

  protected primaryButtonClass(config: ConfirmDialogConfig): string {
    const classes = ['confirm-dialog-action', 'confirm-dialog-action-primary'];
    if (this.severity(config) === 'warning') {
      classes.push('confirm-dialog-action-warning');
    }
    if (this.mode(config) === 'message') {
      classes.push('confirm-dialog-action-single');
    }

    return classes.join(' ');
  }

  protected secondaryButtonClass(config: ConfirmDialogConfig): string {
    return this.mode(config) === 'message'
      ? 'confirm-dialog-action confirm-dialog-action-hidden'
      : 'confirm-dialog-action';
  }

  protected dialogRole(config: ConfirmDialogConfig): 'dialog' | 'alertdialog' {
    return this.mode(config) === 'message' || this.severity(config) === 'warning' || this.severity(config) === 'danger' || this.severity(config) === 'error'
      ? 'alertdialog'
      : 'dialog';
  }

  protected isBusy(config: ConfirmDialogConfig): boolean {
    return config.loading === true;
  }

  protected emitCancel(): void {
    if (this.isBusy(this.config)) {
      return;
    }

    this.cancelled.emit();
  }

  protected emitConfirm(): void {
    if (this.isBusy(this.config)) {
      return;
    }

    this.confirmed.emit();
  }
}
