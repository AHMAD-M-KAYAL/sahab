import { useGetData } from "./useGetData";
export interface CarouselImg{
    id:number,
    image:string
}
export const useGetHomePhotos = () => useGetData<CarouselImg[]>("api/home-images",{})
 
 