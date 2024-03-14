import { WorkSpace } from '@app/pages/WorkSpace/WorkSpaceList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../commonStore/CommonStore'

export type WorkSpaceState = {
  loadingStatus: Loading
  dataList: WorkSpace[]
  dirty: boolean
  editItem?: WorkSpace
  taskListDirty: boolean
  taskListEditItem?: any
}

const initialState: WorkSpaceState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
  taskListDirty: false,
}

const workSpaceStore = createSlice({
  name: 'workSpace',
  initialState: initialState as WorkSpaceState,
  reducers: {
    setLoadingStatus: (state: WorkSpaceState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setWorkSpaceList: (state: WorkSpaceState, action: PayloadAction<WorkSpace[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: WorkSpaceState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: WorkSpaceState, action: PayloadAction<WorkSpace | undefined>) => {
      state.editItem = action.payload
    },
    setTaskListDirty: (state: WorkSpaceState, action: PayloadAction<boolean>) => {
      state.taskListDirty = action.payload
    },
    setTaskListEditItem: (state: WorkSpaceState, action: PayloadAction<any | undefined>) => {
      state.taskListEditItem = action.payload
    },
    clearAll: (state: WorkSpaceState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
    },
  },
})

export default workSpaceStore
