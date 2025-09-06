import { useGetData } from "./useGetData";
import { useTranslation } from "react-i18next";
import type { ServicesApiResponse } from "./useGetServiceForOneCategory";
export interface ServiceImage {
  id: number;
  image: string;   // URL للصورة
  service_id: number;
}

export interface Service {
  id: number;
  max_capacity: number;
  featured: number;
  available: number;
  price: number;
  title: string;
  created_at: string;
  rating: string;
  service_images: ServiceImage[];
}

export const useGetSearchServices = (ServiceTitle: string) => {
  const { i18n } = useTranslation();
  return useGetData<ServicesApiResponse[]>(
    `/api/services/search/?search=${ServiceTitle}`,
    {
      language: i18n.language,
    }
  );
};
