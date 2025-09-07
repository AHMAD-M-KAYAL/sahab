 import { useGetData } from './useGetData'
import { useTranslation } from "react-i18next";
export interface ServiceBooking {
  id: number;               
  status:  string; 
  total_price: number;      
  invoice_reference: string | null;  
  payment: number;           
  service_title: string;      
  category_title: string;    
}


 
export const useGetAllBookingService = (token:string) =>
    {  const { i18n } = useTranslation();
   return useGetData<ServiceBooking[]>("api/users/services/bookings/get-all",{language:i18n.language},token)
}