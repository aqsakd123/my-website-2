import { QuesAndAns } from '@app/pages/cards/StudyCard/QuesAndAnsList'
import axiosInstance from '../axios'
import {
  GET_LIST_QUES_AND_ANSS,
  INSERT_QUES_AND_ANS,
  DELETE_QUES_AND_ANS,
  UPDATE_QUES_AND_ANS,
} from './ques-and-ans-type-graphql'

const BASE_URL = '/graphql'

export const fetchQuesAndAnsList = async () => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_QUES_AND_ANSS,
  })
  return response.data?.data?.getListQuesAndAns
}

export const insertQuesAndAns = async (quesAndAnsInput: QuesAndAns) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_QUES_AND_ANS,
    variables: { quesAndAns: quesAndAnsInput },
  })

  return response?.data?.data?.insertQuesAndAns
}

export const updateQuesAndAns = async (id: string, quesAndAnsInput: QuesAndAns) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_QUES_AND_ANS,
    variables: { id, quesAndAns: quesAndAnsInput },
  })

  return response?.data?.data?.updateQuesAndAns
}

export const deleteQuesAndAns = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_QUES_AND_ANS,
    variables: { id },
  })

  return response?.data?.data?.deleteQuesAndAns
}
