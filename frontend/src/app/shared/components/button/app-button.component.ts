import { Component, EventEmitter, Input, Output } from '@angular/core';

export type AppButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type AppButtonSize = 'default' | 'sm';
export type AppButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './app-button.component.html',
  styleUrl: './app-button.component.scss'
})
export class AppButtonComponent {
  @Input() variant: AppButtonVariant = 'primary';
  @Input() size: AppButtonSize = 'default';
  @Input() type: AppButtonType = 'button';
  @Input() label: string | null = null;
  @Input() loadingLabel: string | null = null;
  @Input() icon: string | null = null;
  @Input() iconOnly = false;
  @Input() disabled = false;
  @Input() loading = false;
  @Input() ariaLabel: string | null = null;
  @Input() title: string | null = null;
  @Input() ariaCurrent: string | null = null;
  @Input() buttonClass = '';

  @Output() pressed = new EventEmitter<MouseEvent>();

  protected className(): string {
    this.assertIconOnlyAccessibility();

    return [
      'kt-btn',
      this.variantClass(),
      this.size === 'sm' ? 'kt-btn-sm' : '',
      this.iconOnly ? 'kt-btn-icon' : '',
      this.loading ? 'app-button-loading' : '',
      this.buttonClass.trim()
    ]
      .filter((className) => className.length > 0)
      .join(' ');
  }

  protected currentLabel(): string {
    if (this.loading && this.loadingLabel) {
      return this.loadingLabel;
    }

    return this.label ?? '';
  }

  protected resolvedAriaLabel(): string | null {
    this.assertIconOnlyAccessibility();

    const normalizedAriaLabel = this.ariaLabel?.trim();
    if (normalizedAriaLabel) {
      return normalizedAriaLabel;
    }

    const currentLabel = this.currentLabel().trim();
    return currentLabel || null;
  }

  protected resolvedTitle(): string | null {
    return this.title ?? this.resolvedAriaLabel();
  }

  protected showLabel(): boolean {
    return !this.iconOnly && this.currentLabel().trim().length > 0;
  }

  protected isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected emitClick(event: MouseEvent): void {
    if (this.isDisabled()) {
      event.preventDefault();
      return;
    }

    this.pressed.emit(event);
  }

  private assertIconOnlyAccessibility(): void {
    if (!this.iconOnly) {
      return;
    }

    if (!this.ariaLabel?.trim()) {
      throw new Error('app-button iconOnly requires a non-empty ariaLabel.');
    }
  }

  private variantClass(): string {
    switch (this.variant) {
      case 'secondary':
        return 'kt-btn-secondary';
      case 'outline':
        return 'kt-btn-outline';
      case 'ghost':
        return 'kt-btn-ghost';
      case 'destructive':
        return 'kt-btn-destructive';
      case 'primary':
      default:
        return 'kt-btn-primary';
    }
  }
}
