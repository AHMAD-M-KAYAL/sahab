import { usePostData } from './usePostData'

export interface CreateServiceBookingRequest {
  date: string
  starting_time: string;
  ending_time: string;
  payment_method: string;
  code: string | null;
  service_id: number;
  total_price: string;
  address: string
}

export interface CreateBookingResponse {
    message: string
}

export const useAddServiceBooking = (token: string)=>{
    return usePostData<CreateBookingResponse, CreateServiceBookingRequest>('api/bookings', token)
}