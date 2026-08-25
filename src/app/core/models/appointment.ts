import { AppointmentStatus } from './appointment-status';

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  status: AppointmentStatus;
  notes?: string;
  businessId: string;
  createdAt: string;
}