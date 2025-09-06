 import { useTranslation } from "react-i18next";
import { useGetData } from "./useGetData";
export interface PlaceImages {
          id: number,
        image: string,//url
        place_id: number

}
    export interface Places {
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
      export interface FetchPlacesResult {
          current_page: number,
          data:Places[],
                    last_page: number;   // ← أضف هذا

      }
      export interface PlacesApiResponse {
  data: {
    places: FetchPlacesResult;
    min_price: number;
    max_price: number;
  }
}
 export const useGetPlacesForOneCategorie = (idForCategory:number,tag:string,price:number,page:number ) => {
      const { i18n } = useTranslation();
 
      return useGetData<PlacesApiResponse> (tag=="none"?`/api/categories/${idForCategory}/places/?page=${page}&min_price=${price} `:`/api/categories/${idForCategory}/places/?page=1&tag=${tag}&min_price=${price} `,{
            id:idForCategory,
         language: i18n.language,
  });
}

