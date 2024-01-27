import axiosInstance from '../axios'
import { UserType } from '@app/config/context'
import { AxiosResponse } from 'axios'

export async function loginByUsernameAndPassword(
  username: string,
  password: string,
): Promise<AxiosResponse<UserType>> {
  return await axiosInstance.post('/auth/signIn', {
    username,
    password,
  })
}

export async function getUserList(): Promise<any> {
  return await axiosInstance.post('/api/listUser')
}
