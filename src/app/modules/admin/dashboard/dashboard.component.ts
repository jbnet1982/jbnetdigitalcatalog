import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as CoreUI from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { cilCalendar, cilCart, cilPeople, cilDollar } from '@coreui/icons';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CoreUI.RowComponent, CoreUI.ColComponent, CoreUI.WidgetStatAComponent, CoreUI.CardModule, CoreUI.TableModule, CoreUI.BadgeModule, IconModule, BaseChartDirective],
  template: `
    <c-row>
      <c-col xs="12" sm="6" lg="3">
        <c-widget-stat-a color="primary" [value]="stats()?.todayAppointments || 0" title="Citas Hoy">
          <ng-template cTemplateId="widgetIconTemplate">
            <svg cIcon name="cilCalendar" size="xl"/>
          </ng-template>
        </c-widget-stat-a>
      </c-col>
      <c-col xs="12" sm="6" lg="3">
        <c-widget-stat-a color="info" [value]="stats()?.totalProducts || 0" title="Productos">
          <ng-template cTemplateId="widgetIconTemplate">
            <svg cIcon name="cilCart" size="xl"/>
          </ng-template>
        </c-widget-stat-a>
      </c-col>
      <c-col xs="12" sm="6" lg="3">
        <c-widget-stat-a color="warning" [value]="stats()?.activePatients || 0" title="Pacientes">
          <ng-template cTemplateId="widgetIconTemplate">
            <svg cIcon name="cilPeople" size="xl"/>
          </ng-template>
        </c-widget-stat-a>
      </c-col>
      <c-col xs="12" sm="6" lg="3">
        <c-widget-stat-a color="success" [value]="'$' + (stats()?.estimatedRevenue || 0)" title="Ingresos">
          <ng-template cTemplateId="widgetIconTemplate">
            <svg cIcon name="cilDollar" size="xl"/>
          </ng-template>
        </c-widget-stat-a>
      </c-col>
    </c-row>
    
    <c-row class="mt-4">
      <c-col xs="12" lg="8">
        <c-card>
          <c-card-header>
            <h5 class="card-title mb-0">Citas por Día</h5>
          </c-card-header>
          <c-card-body>
            @if (chartData()) {
              <canvas baseChart [data]="chartData()!" [options]="chartOptions" type="bar" style="max-height: 300px;"></canvas>
            }
          </c-card-body>
        </c-card>
      </c-col>
      <c-col xs="12" lg="4">
        <c-card>
          <c-card-header>
            <h5 class="card-title mb-0">Últimas Citas</h5>
          </c-card-header>
          <c-card-body>
            <table cTable hover>
              <thead>
                <tr><th>Paciente</th><th>Estado</th></tr>
              </thead>
              <tbody>
                @for (apt of recent(); track apt.id) {
                  <tr>
                    <td>{{ apt.patientName }}</td>
                    <td><c-badge [color]="apt.status === 'confirmada' ? 'success' : 'warning'">{{ apt.status }}</c-badge></td>
                  </tr>
                }
              </tbody>
            </table>
          </c-card-body>
        </c-card>
      </c-col>
    </c-row>
  `
})
export class DashboardComponent implements OnInit {
  private service = inject(DashboardService);
  stats = signal<any>(null);
  recent = signal<any[]>([]);
  chartData = signal<any>(null);
  cilCalendar = cilCalendar; 
  cilCart = cilCart; 
  cilPeople = cilPeople; 
  cilDollar = cilDollar;
  
  chartOptions = { 
    responsive: true, 
    maintainAspectRatio: false, 
    plugins: { legend: { display: false } } 
  };

  ngOnInit() {
    this.service.getStats().subscribe(res => this.stats.set(res));
    this.service.getRecentAppointments(5).subscribe(res => this.recent.set(res));
    this.service.getAppointmentsByDay().subscribe(res => 
      this.chartData.set({ 
        labels: res.labels, 
        datasets: [{ data: res.data, backgroundColor: '#321fdb' }] 
      })
    );
  }
}