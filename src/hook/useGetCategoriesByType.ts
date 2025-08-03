import { useTranslation } from "react-i18next";
import { useGetData } from "./useGetData";

export interface Category {
  id: number;
  title: string;
  icon: string;
  type: string;
}
 export const useGetCategoriesByType = (type:string) =>
   { const { i18n } = useTranslation();

return  useGetData<Category>("api/categories/type", { type:type,language:i18n.language });
}