 import { useGetData } from './useGetData'
import { useTranslation } from "react-i18next";
export interface PlaceBookingDetails {
  id: number;
  created_at: string;         // تاريخ إنشاء الحجز
  status: string;             // حالة الحجز (completed, placed, ...etc)
  total_price: number;        // السعر الكلي
  starting_date: string;      // بداية الحجز
  ending_date: string;        // نهاية الحجز
  transaction_id: string | null;
  invoice_reference: string | null;
  reference_id: string | null;
  payment: number;            // حالة الدفع (0 = غير مدفوع مثلاً)
  payment_method: string | null;
  place_title: string;        // اسم المكان
  tag: string;                // نوع المكان (Girls Only, Family Only...)
  weekday_price: number;      // سعر أيام الأسبوع
  weekend_price: number;      // سعر نهاية الأسبوع
  address: string;            // العنوان
  category_title: string;     // التصنيف (مثلاً kashta)
  name: string;               // اسم الشخص اللي حجز
  phone: string;              // رقم الهاتف
  discount: number;           // الخصم
  total: number;              // المجموع بعد الخصم
  images: string[];           // مصفوفة صور
  rating: string;             // التقييم
}

 
export const useGetBookingById = (id:number,token:string) =>
    {  const { i18n } = useTranslation();
    return useGetData<PlaceBookingDetails>(`api/users/reservations/${id}`,{language:i18n.language},token)
}