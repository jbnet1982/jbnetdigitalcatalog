export interface RegisterRequest {
  businessName: string;
  email: string;
  password: string;
  phone: string;
  businessType: 'laboratorio' | 'consultorio' | 'comercio';
}