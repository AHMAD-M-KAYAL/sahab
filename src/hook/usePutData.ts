import { useMutation } from '@tanstack/react-query'
import apiClient from '../services/api-client'
import { useNavigate } from 'react-router-dom';

export const usePutData = <T, V = unknown>(endPoint: string, token:string) => {
  const navigate = useNavigate();
  const { mutate, data, error, isPending, isSuccess } = useMutation({
    mutationFn: (body: V) => {
const headers = token 
  ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } 
  : { "Content-Type": "application/json" }      
  return apiClient
        .put<T>(endPoint, body, { headers })
        .then(res => res.data)
    },
    onSuccess: ()=>{
      navigate('/success')
    },
    onError:()=>{
            navigate('/failed')

     }
  })

  return { mutate, data, error, isPending, isSuccess }
}
