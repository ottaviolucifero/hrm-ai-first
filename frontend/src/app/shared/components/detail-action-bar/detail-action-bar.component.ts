import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AppButtonComponent, AppButtonVariant } from '../button/app-button.component';

export interface DetailActionBarAction {
  readonly id: string;
  readonly label: string;
  readonly loadingLabel?: string;
  readonly icon?: string;
  readonly ariaLabel?: string;
  readonly title?: string;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly visible?: boolean;
  readonly variant?: AppButtonVariant;
}

@Component({
  selector: 'app-detail-action-bar',
  imports: [AppButtonComponent],
  templateUrl: './detail-action-bar.component.html',
  styleUrl: './detail-action-bar.component.scss'
})
export class DetailActionBarComponent {
  @Input() ariaLabel = '';
  @Input() backLabel = '';
  @Input() backIcon = 'ki-filled ki-arrow-left';
  @Input() backDisabled = false;
  @Input() secondaryActions: readonly DetailActionBarAction[] = [];
  @Input() primaryAction: DetailActionBarAction | null = null;
  @Input() destructiveActions: readonly DetailActionBarAction[] = [];

  @Output() backPressed = new EventEmitter<void>();
  @Output() actionPressed = new EventEmitter<string>();

  protected visibleActions(actions: readonly DetailActionBarAction[]): readonly DetailActionBarAction[] {
    return actions.filter((action) => action.visible !== false);
  }

  protected visiblePrimaryAction(): DetailActionBarAction | null {
    return this.primaryAction?.visible === false ? null : this.primaryAction;
  }

  protected showDestructiveSeparator(): boolean {
    return this.visibleActions(this.destructiveActions).length > 0;
  }

  protected emitBack(): void {
    if (!this.backDisabled) {
      this.backPressed.emit();
    }
  }

  protected emitAction(action: DetailActionBarAction): void {
    if (action.disabled || action.loading) {
      return;
    }

    this.actionPressed.emit(action.id);
  }

  protected resolvedVariant(
    action: DetailActionBarAction,
    fallback: AppButtonVariant
  ): AppButtonVariant {
    return action.variant ?? fallback;
  }
}
