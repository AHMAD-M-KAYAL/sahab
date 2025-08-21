import i18n from "../i18n";
import { useGetData } from "./useGetData";
export interface Category {
  id: number;
  title: string;
  title_ar: string;
  icon: string;
  status: number;
  type: string;
}

export interface ServiceImage {
  id: number;
  image: string;
  service_id: number;
}

export interface Booking {
  id: number;
  starting_date: string; // "YYYY-MM-DD HH:mm:ss"
  ending_date: string; // "YYYY-MM-DD HH:mm:ss"
  total_price: number;
  payment: number;
  address: string | null;
  status: string;
  transaction_id: string | null;
  invoice_reference: string | null;
  reference_id: string | null;
  created_at: string; // ISO timestamp
  user_id: number;
  promo_code_id: number | null;
  service_id: number | null;
  place_id: number | null;
  payment_method_id: number;
}

export interface ServiceDetails {
  id: number;
  price: number;
  title: string;
  duration: number;
  description: string;
  bookable: number;
  featured: number;
  notice_period: string; // "HH:mm:ss"
  max_capacity: number;
  created_at: string;
  rating: string;
  category: Category;
  service_images: ServiceImage[];
  bookings: Booking[];
}

export const useGetOneServiceDetails = (idService: number) => {
  return useGetData<ServiceDetails>(`api/services/${idService}`, {
    language: i18n.language,
  });
};
