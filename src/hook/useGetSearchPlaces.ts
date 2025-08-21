 import { useGetData } from "./useGetData";
import { useTranslation } from "react-i18next";
import type { Places } from "./useGetPlacesForOneCategorie";
 
 
export const useGetSearchPlaces = (PlaceTitle:string) => {
  const { i18n } = useTranslation();

  return useGetData<Places[]>(`/api/places/search/?search=${PlaceTitle}`, {
     language: i18n.language,
  });
};
