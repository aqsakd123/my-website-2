import { AwardInput } from '@app/pages/AwardManagement/AwardList'
import axiosInstance from '../axios'
import { DELETE_AWARD, GET_LIST_AWARDS, INSERT_AWARD, UPDATE_AWARD } from './award-type-graphql'

const BASE_URL = '/graphql'

export const fetchAwardList = async (specification?: any) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_AWARDS,
    variables: {
      specification: specification || {},
    },
  })
  return response.data?.data?.getListAward
}

export const insertAward = async (awardInput: AwardInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_AWARD,
    variables: { award: awardInput },
  })

  return response.data.data.insertAward
}

export const updateAward = async (id: string, awardInput: AwardInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_AWARD,
    variables: { id, award: awardInput },
  })

  return response.data.data.updateAward
}

export const deleteAward = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_AWARD,
    variables: { id },
  })

  return response.data.data.deleteAward
}
