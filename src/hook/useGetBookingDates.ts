 import { useGetData } from './useGetData'
import { useTranslation } from "react-i18next";

 export const useGetBookingDates = (placeId: number) =>
     {  const { i18n } = useTranslation();
    return useGetData<string[]>(`api/places/${placeId}/bookings`,{language:i18n.language})
 }