import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilDataTransferDown } from '@coreui/icons';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonModule, IconModule],
  template: `
    <div class="text-center py-5">
      @if (icon()) {
        <svg cIcon [name]="icon()!" size="5xl" class="text-body-secondary mb-3"></svg>
      }
      <h5 class="text-body-secondary mb-2">{{ title() }}</h5>
      @if (message()) {
        <p class="text-body-secondary mb-3">{{ message() }}</p>
      }
      @if (actionLabel()) {
        <button cButton color="primary" (click)="action.emit()">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  icon = input<string>();
  title = input<string>('Sin datos');
  message = input<string>('');
  actionLabel = input<string>('');
  action = output<void>();
}