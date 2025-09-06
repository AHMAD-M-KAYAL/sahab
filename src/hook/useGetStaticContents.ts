 import { useGetData } from './useGetData'
import { useTranslation } from "react-i18next";

export interface StaticContents{
id:number,
title:string,
content:string
}
export const useGetStaticContents = (title:string) =>
    {  const { i18n } = useTranslation();
        const lan = i18n.language=="ar"?"ar":"en"
   return useGetData<StaticContents>(`/api/static-contents/get?title=${title}_${lan}`,{language:i18n.language})
}