import { Category } from '@app/pages/CategoryManagement/CategoryList'
import axiosInstance from '../axios'
import {
  CHANGE_STATUS_MEMO,
  DELETE_MEMO,
  GET_LIST_MEMOS,
  INSERT_MEMO,
  MemoInput,
  UPDATE_MEMO,
} from './memo-type'

const BASE_URL = '/graphql'

export type Specfication = {
  name?: string
  tags?: [string]
  type: string
  category?: Category
}

export const fetchMemoList = async (specification?: Specfication) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_MEMOS,
    variables: {
      specification: specification || {},
    },
  })

  return response.data.data.getListMemo
}

export const insertMemo = async (memoInput: MemoInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_MEMO,
    variables: { memo: memoInput },
  })

  return response.data.data.insertMemo
}

export const updateMemo = async (id: string, memoInput: MemoInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_MEMO,
    variables: { id, memo: memoInput },
  })

  return response.data.data.updateMemo
}

export const changeStatus = async (id: string, status: number) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: CHANGE_STATUS_MEMO,
    variables: { id, status },
  })

  return response.data.data.updateMemo
}

export const deleteMemo = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_MEMO,
    variables: { id },
  })

  return response.data.data.deleteMemo
}
