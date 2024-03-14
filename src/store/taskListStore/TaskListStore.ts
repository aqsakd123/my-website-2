import { TaskList } from '@app/pages/TaskListManagement/TaskListList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../commonStore/CommonStore'

export type TaskListState = {
  loadingStatus: Loading
  dataList: TaskList[]
  dirty: boolean
  editItem?: TaskList
  subTaskDirty: boolean
  subTaskEditItem?: any
}

const initialState: TaskListState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
  subTaskDirty: false,
}

const taskListStore = createSlice({
  name: 'taskList',
  initialState: initialState as TaskListState,
  reducers: {
    setLoadingStatus: (state: TaskListState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setTaskListList: (state: TaskListState, action: PayloadAction<TaskList[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: TaskListState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: TaskListState, action: PayloadAction<TaskList | undefined>) => {
      state.editItem = action.payload
    },
    setSubTaskDirty: (state: TaskListState, action: PayloadAction<boolean>) => {
      state.subTaskDirty = action.payload
    },
    setSubTaskEditItem: (state: TaskListState, action: PayloadAction<any | undefined>) => {
      state.subTaskEditItem = action.payload
    },
    clearAll: (state: TaskListState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
      state.dataList = []
    },
  },
})

export default taskListStore
