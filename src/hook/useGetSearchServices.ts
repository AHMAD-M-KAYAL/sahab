import { useGetData } from "./useGetData";
import { useTranslation } from "react-i18next";
import type { Service } from "./useGetServiceForOneCategory";
 export interface ServiceImage {
  id: number;
  image: string;   // URL للصورة
  service_id: number;
}

 
export const useGetSearchServices = (ServiceTitle: string) => {
  const { i18n } = useTranslation();
  return useGetData<Service[]>(
    `/api/services/search/?search=${ServiceTitle}`,
    {
      language: i18n.language,
    }
  );
};
