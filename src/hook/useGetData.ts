import { useQuery } from '@tanstack/react-query'
import apiClient from '../services/api-client'
export const useGetData = <T>(endPoint: string, params: object,  token?:string,) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const { data, error, isLoading } = useQuery({
    queryKey: [endPoint, params],
    queryFn: () => {
      return apiClient.get<T>(endPoint, { params, headers }).then(res => res.data)
    }
  });
  return { data, error, isLoading };
}


