import { FinanceInput } from '@app/pages/FinanceManagement/FinanceList'
import axiosInstance from '../axios'
import {
  DELETE_FINANCE,
  GET_LIST_FINANCES,
  INSERT_FINANCE,
  UPDATE_FINANCE,
} from './finance-type-graphql'

const BASE_URL = '/graphql'

export const fetchFinanceList = async () => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_FINANCES,
    // variables: {
    //   specification: {},
    // },
  })
  return response.data?.data?.getListFinance
}

export const insertFinance = async (financeInput: FinanceInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_FINANCE,
    variables: { finance: financeInput },
  })

  return response.data.data.insertFinance
}

export const updateFinance = async (id: string, financeInput: FinanceInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_FINANCE,
    variables: { id, finance: financeInput },
  })

  return response.data.data.updateFinance
}

export const deleteFinance = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_FINANCE,
    variables: { id },
  })

  return response.data.data.deleteFinance
}
