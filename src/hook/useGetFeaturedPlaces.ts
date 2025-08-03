 import { useGetData } from "./useGetData";
import { useTranslation } from "react-i18next";
export interface PlaceImages {
          id: number,
        image: string,//url
        place_id: number
}
export interface FeaturedPlaces {
      id: number,
    weekday_price: number,
    weekend_price: number,
    title: string,
    address: string,
    area: string,
    tag: string,
    created_at: string,
    rating: string,
    place_images:PlaceImages[]
 }
export const useGetFeaturedPlaces = () => {
  const { i18n } = useTranslation();

  return useGetData<FeaturedPlaces>("/api/places/featured/get", {
     language: i18n.language,
  });
};
