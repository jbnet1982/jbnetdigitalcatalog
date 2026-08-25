import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule, TableModule, BadgeModule, ButtonModule, FormModule, GridModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilMagnifyingGlass } from '@coreui/icons';
import { AppointmentsService } from '../../../../core/services/appointments.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, BadgeModule, ButtonModule, FormModule, GridModule, IconModule],
  template: `
    <c-card>
      <c-card-header>
        <h5 class="mb-0">Listado de Citas</h5>
      </c-card-header>
      <c-card-body>
        <c-row class="mb-3">
          <c-col md="4">
            <div class="input-group">
              <span class="input-group-text"><svg cIcon name="cilMagnifyingGlass"></svg></span>
              <input cFormInput placeholder="Buscar paciente..." />
            </div>
          </c-col>
        </c-row>
        <table cTable hover responsive>
          <thead>
            <tr>
              <th>Paciente</th><th>Teléfono</th><th>Servicio</th>
              <th>Fecha</th><th>Hora</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (apt of appointments(); track apt.id) {
              <tr>
                <td>{{ apt.patientName }}</td>
                <td>{{ apt.patientPhone }}</td>
                <td>{{ apt.serviceName }}</td>
                <td>{{ apt.date }}</td>
                <td>{{ apt.time }}</td>
                <td><c-badge [color]="getStatusColor(apt.status)">{{ apt.status }}</c-badge></td>
                <td>
                  @if (apt.status === 'pendiente') {
                    <button cButton color="info" size="sm" class="me-1" (click)="updateStatus(apt, 'confirmada')">✓</button>
                  }
                  @if (apt.status === 'confirmada') {
                    <button cButton color="success" size="sm" class="me-1" (click)="updateStatus(apt, 'completada')">✔</button>
                  }
                  @if (apt.status !== 'cancelada' && apt.status !== 'completada') {
                    <button cButton color="danger" size="sm" (click)="updateStatus(apt, 'cancelada')">✕</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </c-card-body>
    </c-card>
  `
})
export class AppointmentsListComponent implements OnInit {
  private service = inject(AppointmentsService);
  private toastr = inject(ToastrService);
  cilMagnifyingGlass = cilMagnifyingGlass;
  appointments = signal<any[]>([]);

  ngOnInit() { this.load(); }
  
  load() {
    this.service.getAll().subscribe(res => this.appointments.set(res.data));
  }

  getStatusColor(status: string): string {
    const colors: any = { 
      'pendiente': 'warning', 
      'confirmada': 'info', 
      'completada': 'success', 
      'cancelada': 'danger' 
    };
    return colors[status] || 'secondary';
  }

  updateStatus(apt: any, status: string): void {
    this.service.updateStatus(apt.id, status as any).subscribe({
      next: () => {
        this.toastr.success('Estado actualizado', 'Éxito');
        this.load();
      },
      error: () => this.toastr.error('Error', 'Error')
    });
  }
}