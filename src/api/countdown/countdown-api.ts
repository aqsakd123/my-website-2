import { Countdown, CountdownSpecification } from '@app/pages/CountdownManagement/CountdownList'
import axiosInstance from '../axios'
import {
  GET_LIST_COUNTDOWNS,
  INSERT_COUNTDOWN,
  DELETE_COUNTDOWN,
  UPDATE_COUNTDOWN,
} from './countdown-type-graphql'

const BASE_URL = '/graphql'

export const fetchCountdownList = async (specification?: CountdownSpecification) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_COUNTDOWNS,
    variables: {
      specification: specification || {},
    },
  })
  return response.data?.data?.getListCountdown
}

export const insertCountdown = async (countdownInput: Countdown) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_COUNTDOWN,
    variables: { countdown: countdownInput },
  })

  return response?.data?.data?.insertCountdown
}

export const updateCountdown = async (id: string, countdownInput: Countdown) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_COUNTDOWN,
    variables: { id, countdown: countdownInput },
  })

  return response?.data?.data?.updateCountdown
}

export const deleteCountdown = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_COUNTDOWN,
    variables: { id },
  })

  return response?.data?.data?.deleteCountdown
}
