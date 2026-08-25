import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilPlus } from '@coreui/icons';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, IconModule],
  template: `
    <div class="row align-items-center mb-4">
      <div class="col">
        <h4 class="mb-0">{{ title }}</h4>
        <small *ngIf="subtitle" class="text-body-secondary">{{ subtitle }}</small>
      </div>
      <div *ngIf="showAction" class="col-auto">
        <button cButton color="primary" (click)="action.emit()">
          <svg *ngIf="actionIcon" cIcon [name]="actionIcon" class="me-1"></svg>
          {{ actionLabel }}
        </button>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showAction = false;
  @Input() actionLabel = 'Nuevo';
  @Input() actionIcon = 'cilPlus';
  @Output() action = new EventEmitter<void>();
}