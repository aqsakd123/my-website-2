import { SubTask } from '@app/pages/SubTaskManagement/SubTaskList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../commonStore/CommonStore'

export type SubTaskState = {
  loadingStatus: Loading
  dataList: SubTask[]
  dirty: boolean
  editItem?: SubTask
  taskListDirty: boolean
  taskListEditItem?: any
}

const initialState: SubTaskState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
  taskListDirty: false,
}

const subTaskStore = createSlice({
  name: 'subTask',
  initialState: initialState as SubTaskState,
  reducers: {
    setLoadingStatus: (state: SubTaskState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setSubTaskList: (state: SubTaskState, action: PayloadAction<SubTask[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: SubTaskState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: SubTaskState, action: PayloadAction<SubTask | undefined>) => {
      state.editItem = action.payload
    },
    setTaskListDirty: (state: SubTaskState, action: PayloadAction<boolean>) => {
      state.taskListDirty = action.payload
    },
    setTaskListEditItem: (state: SubTaskState, action: PayloadAction<any | undefined>) => {
      state.taskListEditItem = action.payload
    },
    clearAll: (state: SubTaskState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
      state.dataList = []
    },
  },
})

export default subTaskStore
