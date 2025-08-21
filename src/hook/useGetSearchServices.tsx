import { useGetData } from "./useGetData";
import { useTranslation } from "react-i18next";
import type { ServicesApiResponse } from "./useGetServiceForOneCategory";

export const useGetSearchServices = (ServiceTitle: string) => {
  const { i18n } = useTranslation();
  return useGetData<ServicesApiResponse>(
    `/api/services/search/?search=${ServiceTitle}`,
    {
      language: i18n.language,
    }
  );
};
