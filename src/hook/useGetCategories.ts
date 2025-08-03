 import { useGetData } from './useGetData'
import { useTranslation } from "react-i18next";

export interface Category{
id:number,
title:string,
icon:string,
type:string
}
export const useGetCategories = () =>
    {  const { i18n } = useTranslation();
   return useGetData<Category>("api/categories",{language:i18n.language})
}