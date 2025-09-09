import { usePostData } from './usePostData'

export interface CreateBookingRequest {
  starting_date: string;      // e.g. "2024-03-19"
  ending_date: string;        // e.g. "2024-03-25"
  payment_method: string;     // e.g. "master card"
  code: string | null;               // e.g. "C8hpX3Tog2N3"
  place_id: number;           // e.g. 1
  total_price: string;        // e.g. "300"
}

export interface CreateBookingResponse {
    message: string
}

export const useEnableNotify = (token: string)=>{
    return usePostData<CreateBookingResponse, CreateBookingRequest>('api/bookings', token)
}