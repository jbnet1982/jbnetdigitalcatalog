import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private appointments: any[] = [];

  getAll(): Observable<any> {
    return of({
      data: [
        { 
          id: '1', 
          patientName: 'Juan Pérez', 
          patientPhone: '5551111', 
          serviceName: 'Consulta General', 
          date: '2024-08-25', 
          time: '10:00', 
          status: 'confirmada' 
        },
        { 
          id: '2', 
          patientName: 'María García', 
          patientPhone: '5552222', 
          serviceName: 'Limpieza Dental', 
          date: '2024-08-25', 
          time: '11:00', 
          status: 'pendiente' 
        }
      ]
    }).pipe(delay(300));
  }

  getByMonth(year: number, month: number): Observable<any[]> {
    return of([
      { 
        id: '1', 
        patientName: 'Juan Pérez', 
        serviceName: 'Consulta General', 
        date: '2024-08-25', 
        time: '10:00', 
        status: 'confirmada' 
      }
    ]).pipe(delay(300));
  }

  createPublic(slug: string, data: any): Observable<any> {
    // Simular creación de cita
    const newAppointment = {
      id: Date.now().toString(),
      ...data,
      status: 'pendiente',
      createdAt: new Date().toISOString()
    };

    this.appointments.push(newAppointment);

    console.log('✅ Cita agendada:', newAppointment);
    console.log('📋 Total de citas:', this.appointments.length);

    return of({ 
      success: true, 
      message: 'Cita agendada exitosamente',
      appointment: newAppointment 
    }).pipe(delay(800)); // Simular retraso de red
  }

  updateStatus(id: string, status: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }

  delete(id: string): Observable<any> {
    return of({ success: true }).pipe(delay(300));
  }
}