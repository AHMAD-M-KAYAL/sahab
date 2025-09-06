import { useGetData } from "./useGetData";

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DailyAvailability {
  [date: string]: TimeSlot[];
}

export const useGetDataTimesForOneService = (serviceId: number) =>{
    return useGetData<string[]>(`api/services/${serviceId}/bookings`,{language:'en'})
 }