 import { useGetData } from './useGetData'
import { useTranslation } from "react-i18next";
 export interface PlaceBooking {
  id: number;               
  status:   string; 
  total_price: number;       
  payment: number;            
  invoice_reference: string | null; 
  place_title: string;        
  category_title: string;     
}

 
export const useGetAllBookingPlacesVendor = (token:string) =>
    {  const { i18n } = useTranslation();
    return useGetData<PlaceBooking[]>("api/users/places/reservations/get-all",{language:i18n.language},token)
}