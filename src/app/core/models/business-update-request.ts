import { BusinessSchedule } from './business-schedule';

export interface BusinessUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  logo?: File;
  primaryColor?: string;
  secondaryColor?: string;
  schedule?: BusinessSchedule;
}