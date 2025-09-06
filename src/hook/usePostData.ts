import { useMutation } from '@tanstack/react-query'
import apiClient from '../services/api-client'
import { useNavigate } from 'react-router-dom';

export const usePostData = <T, V = unknown>(endPoint: string, token:string) => {
  const navigate = useNavigate();
  const { mutate, data, error, isPending, isSuccess } = useMutation({
    mutationFn: (body: V) => {
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      return apiClient
        .post<T>(endPoint, body, { headers })
        .then(res => res.data)
    },
    onSuccess: ()=>{
      navigate('/success')
    }
  })

  return { mutate, data, error, isPending, isSuccess }
}
