export type product={ id: number; no: number; type: "sale" | "restock" }[];
export const backend_Url="http://localhost:8080"
export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    expiry_date?: string;
    barcode?: string;
  }
  