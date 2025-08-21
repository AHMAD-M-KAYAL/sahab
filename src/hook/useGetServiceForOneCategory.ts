import { useTranslation } from "react-i18next";
import { useGetData } from "./useGetData";
 export interface ServiceImage {
  id: number;
  image: string;
  service_id: number;
}
export interface Service {
  id: number;
  price: number;
  title: string;
  duration: number;
  featured: number;
  created_at: string;
  rating: string;
  service_images: ServiceImage[];
 }
export interface FetchPlacesResult {
  current_page: number;
  data: Service[];
}
export interface ServicesApiResponse {
  data: {
    services: FetchPlacesResult;
    min_price: number;
    max_price: number;
  };
}
 export const useGetServiceForOneCategory = (idForCategory:number,price:number ) =>
   {
      const { i18n } = useTranslation();
      return useGetData<ServicesApiResponse>(`/api/categories/${idForCategory}/services/?page=1&min_price=${price}` 
        ,{
          id:idForCategory,
         language: i18n.language,});
    }

