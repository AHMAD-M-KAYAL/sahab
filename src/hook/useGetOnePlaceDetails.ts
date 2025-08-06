 import i18n from '../i18n';
import { useGetData } from './useGetData'
export interface CategoryDetails {
  id: number;
  title: string;
  title_ar: string;
  icon: string;
  status: number;
  type: string;
}
export interface PlaceImage {
  id: number;
  image: string;
  place_id: number;
}
export interface Amenity {
  id: number;
  title: string;
  icon: string;
  // pivot?: { place_id: number; amenity_id: number }; // إذا بتحتاجه مستقبلاً
}
export interface Booking {
  id: number;
  starting_date: string;
  ending_date: string;
  total_price: number;
  payment: number;
  address: string | null;
  status: string;
  transaction_id: string | null;
  invoice_reference: string | null;
  reference_id: string | null;
  created_at: string;
  user_id: number;
  promo_code_id: number | null;
  service_id: number | null;
  place_id: number | null;
  payment_method_id: number;
  // ratings?: any[]; // احذفها حسب طلبك
}
export interface SpecialDay {
  id: number;
  title: string;
  price: number;
  start_date: string;
  end_date: string;
  place_id: number;
}
export interface PlaceDetails {
  id: number;
  weekday_price: number;
  weekend_price: number;
  title: string;
  bookable: number;
  available: number;
  address: string;
  area: string;
  tag: string;
  description: string;
  created_at: string;
  rating: string;
  category: CategoryDetails;
  place_images: PlaceImage[];
  amenities: Amenity[];
  bookings: Booking[];
  special_days: SpecialDay[];
}

export const useGetOnePlaceDetails = (idPlace:number) => {
 return useGetData<PlaceDetails>(`api/places/${idPlace}`,{language:i18n.language})
}
