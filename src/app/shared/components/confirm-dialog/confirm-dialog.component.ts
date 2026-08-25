import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, ButtonModule } from '@coreui/angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalModule, ButtonModule],
  template: `
    <c-modal [visible]="visible()" (visibleChange)="onVisibleChange($event)">
      <c-modal-header>
        <h5 cModalTitle>{{ title() }}</h5>
      </c-modal-header>
      <c-modal-body>
        <p>{{ message() }}</p>
      </c-modal-body>
      <c-modal-footer>
        <button cButton color="secondary" (click)="onCancel()">Cancelar</button>
        <button cButton color="danger" (click)="onConfirm()" [disabled]="loading">
          @if (loading) {
            <span class="spinner-border spinner-border-sm me-1"></span>
          }
          Confirmar
        </button>
      </c-modal-footer>
    </c-modal>
  `
})
export class ConfirmDialogComponent {
  visible = input<boolean>(false);
  title = input<string>('Confirmar');
  message = input<string>('¿Está seguro?');
  loading = input<boolean>(false);
  
  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.onVisibleChange(false);
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      this.cancel.emit();
    }
  }
}