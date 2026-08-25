import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from '@coreui/angular';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, BadgeModule],
  template: `
    <c-badge [color]="getColor()" [ngClass]="pill() ? 'rounded-pill' : ''">
      @if (showIcon()) {
        <span class="me-1">{{ getIcon() }}</span>
      }
      {{ label() || getStatusText(status()) }}
    </c-badge>
  `
})
export class StatusBadgeComponent {
  status = input.required<string>();
  label = input<string>('');
  pill = input<boolean>(true);
  showIcon = input<boolean>(false);

  private statusMap: Record<string, { color: string; text: string; icon: string }> = {
    'pendiente': { color: 'warning', text: 'Pendiente', icon: '' },
    'confirmada': { color: 'info', text: 'Confirmada', icon: '✓' },
    'completada': { color: 'success', text: 'Completada', icon: '✔' },
    'cancelada': { color: 'danger', text: 'Cancelada', icon: '✕' },
    'activo': { color: 'success', text: 'Activo', icon: '●' },
    'inactivo': { color: 'danger', text: 'Inactivo', icon: '○' }
  };

  getColor(): string {
    return this.statusMap[this.status()]?.color || 'secondary';
  }

  getStatusText(status: string): string {
    return this.statusMap[status]?.text || status;
  }

  getIcon(): string {
    return this.statusMap[this.status()]?.icon || '';
  }
}