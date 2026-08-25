import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardStats } from '../models/dashboard-stats';
import { AppointmentsByDay } from '../models/appointments-by-day';
import { RecentAppointment } from '../models/recent-appointment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  getAppointmentsByDay(): Observable<AppointmentsByDay> {
    return this.http.get<AppointmentsByDay>(`${this.apiUrl}/dashboard/appointments-chart`);
  }

  getRecentAppointments(limit: number = 5): Observable<RecentAppointment[]> {
    return this.http.get<RecentAppointment[]>(`${this.apiUrl}/dashboard/recent-appointments`, {
      params: { limit: limit.toString() }
    });
  }
}