import { usePutData } from "./usePutData"

 export interface CreateBookingResponse {
    message: string 
}
interface CreateBookingRequest {
    status:string //cancel
}
export const useCancelBooking = (id:number,token: string)=>{
    return usePutData<CreateBookingResponse, CreateBookingRequest>(`api/bookings/${id}`, token)
}