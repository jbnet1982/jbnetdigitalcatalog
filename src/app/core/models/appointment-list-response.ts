import { Appointment } from './appointment';

export interface AppointmentListResponse {
  data: Appointment[];
  total: number;
  page: number;
  pageSize: number;
}