import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
// Avoid importing CalendarOptions type directly due to TS module resolution issues in this project.
// Use a loose type here to prevent the "is not a module" error from @fullcalendar/core types.

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CardModule, ButtonModule } from '@coreui/angular';
import { AppointmentsService } from '../../../../core/services/appointments.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointments-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, CardModule, ButtonModule],
  template: `
    <c-card>
      <c-card-header class="d-flex justify-content-between">
        <h5 class="mb-0">Calendario de Citas</h5>
        <button cButton color="primary" size="sm" (click)="openModal()">Nueva Cita</button>
      </c-card-header>
      <c-card-body>
        <full-calendar [options]="calendarOptions"></full-calendar>
      </c-card-body>
    </c-card>
  `
})
export class CalendarComponent implements OnInit {
  private service = inject(AppointmentsService);
  private toastr = inject(ToastrService);

  // Use a loose type to avoid TS module resolution issues with @fullcalendar types
  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    events: [],
    // Use a loose 'any' type to avoid TS module resolution issues with @fullcalendar types
    dateClick: (info: any) => {
      console.log('Clicked on: ' + info.dateStr);
      // Abrir modal con esta fecha
    }
  };

  ngOnInit() {
    const now = new Date();
    this.service.getByMonth(now.getFullYear(), now.getMonth() + 1).subscribe(apps => {
      this.calendarOptions.events = apps.map(a => ({
        title: a.patientName + ' - ' + a.serviceName,
        start: a.date + 'T' + a.time,
        backgroundColor: a.status === 'confirmada' ? '#2eb85c' : '#f9b115'
      }));
    });
  }

  openModal() { 
    this.toastr.info('Funcionalidad de modal pendiente'); 
  }
}