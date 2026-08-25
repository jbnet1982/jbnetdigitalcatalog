import { BusinessSchedule } from './business-schedule';

export interface Business {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
  email: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  schedule: BusinessSchedule;
  businessType: 'laboratorio' | 'consultorio' | 'comercio';
  createdAt: string;
}