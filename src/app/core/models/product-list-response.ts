import { Product } from './product';

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}