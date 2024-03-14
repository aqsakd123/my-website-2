import { WorkSpace } from '@app/pages/WorkSpace/WorkSpaceList'
import axiosInstance from '../axios'
import {
  GET_LIST_WORK_SPACES,
  INSERT_WORK_SPACE,
  DELETE_WORK_SPACE,
  UPDATE_WORK_SPACE,
} from './work-space-type-graphql'

const BASE_URL = '/graphql'

export const fetchWorkSpaceList = async () => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_WORK_SPACES,
  })
  return response.data?.data?.getListWorkSpace
}

export const insertWorkSpace = async (workSpaceInput: WorkSpace) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_WORK_SPACE,
    variables: { workSpace: workSpaceInput },
  })

  return response?.data?.data?.insertWorkSpace
}

export const updateWorkSpace = async (id: string, workSpaceInput: WorkSpace) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_WORK_SPACE,
    variables: { id, workSpace: workSpaceInput },
  })

  return response?.data?.data?.updateWorkSpace
}

export const deleteWorkSpace = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_WORK_SPACE,
    variables: { id },
  })

  return response?.data?.data?.deleteWorkSpace
}
