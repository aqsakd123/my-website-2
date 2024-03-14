import { TaskListInput } from '@app/pages/TaskListManagement/TaskListList'
import axiosInstance from '../axios'
import {
  GET_LIST_TASK_LISTS,
  INSERT_TASK_LIST,
  DELETE_TASK_LIST,
  UPDATE_TASK_LIST,
} from './task-list-type-graphql'

const BASE_URL = '/graphql'

type TaskListSpecification = {
  workspaceId?: string
}

export const fetchTaskListList = async (specification?: TaskListSpecification) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: GET_LIST_TASK_LISTS,
    variables: {
      specification: specification || {},
    },
  })
  return response.data?.data?.getListTaskList
}

export const insertTaskList = async (taskListInput: TaskListInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: INSERT_TASK_LIST,
    variables: { taskList: taskListInput },
  })

  return response?.data?.data?.insertTaskList
}

export const updateTaskList = async (id: string, taskListInput: TaskListInput) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: UPDATE_TASK_LIST,
    variables: { id, taskList: taskListInput },
  })

  return response?.data?.data?.updateTaskList
}

export const deleteTaskList = async (id: string) => {
  const response = await axiosInstance.post(BASE_URL, {
    query: DELETE_TASK_LIST,
    variables: { id },
  })

  return response?.data?.data?.deleteTaskList
}
