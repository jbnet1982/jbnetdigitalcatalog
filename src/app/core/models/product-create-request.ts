export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: File;
  active: boolean;
}