import { TagInput } from '@app/pages/Tags/TagList'
import axiosInstance from '../axios'
import { DELETE_TAG, GET_LIST_TAGS, INSERT_TAG, UPDATE_TAG } from './tag-type'

const BASE_URL = '/graphql'

export const fetchTagList = async (specification?: any) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_TAGS,
    variables: {
      specification: specification || {},
    },
  })

  return response.data?.data?.getListTag
}

export const insertTag = async (tagInput: TagInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_TAG,
    variables: { tag: tagInput },
  })

  return response.data.data.insertTag
}

export const updateTag = async (id: string, tagInput: TagInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_TAG,
    variables: { id, tag: tagInput },
  })

  return response.data.data.updateTag
}

export const deleteTag = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_TAG,
    variables: { id },
  })

  return response.data.data.deleteTag
}
