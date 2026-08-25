export interface AppointmentCreateRequest {
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  serviceId: string;
  notes?: string;
}