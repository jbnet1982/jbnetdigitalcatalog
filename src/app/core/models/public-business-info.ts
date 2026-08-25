import { BusinessSchedule } from './business-schedule';
import { PublicProduct } from './public-product';

export interface PublicBusinessInfo {
  name: string;
  slug: string;
  phone: string;
  address: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  schedule: BusinessSchedule;
  businessType: string;
  products: PublicProduct[];
}