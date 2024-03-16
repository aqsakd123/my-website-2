import { Countdown } from '@app/pages/CountdownManagement/CountdownList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../commonStore/CommonStore'

export type CountdownState = {
  loadingStatus: Loading
  dataList: Countdown[]
  dirty: boolean
  editItem?: Countdown
  tagDirty: boolean
  tagEditItem?: any

  workSpaceDirty: boolean
  workSpaceEditItem?: any

  taskListDirty: boolean
  taskListEditItem?: any
}

const initialState: CountdownState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
  tagDirty: false,

  workSpaceDirty: false,

  taskListDirty: false,
}

const countdownStore = createSlice({
  name: 'countdown',
  initialState: initialState as CountdownState,
  reducers: {
    setLoadingStatus: (state: CountdownState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setCountdownList: (state: CountdownState, action: PayloadAction<Countdown[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: CountdownState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: CountdownState, action: PayloadAction<Countdown | undefined>) => {
      state.editItem = action.payload
    },
    setTagDirty: (state: CountdownState, action: PayloadAction<boolean>) => {
      state.tagDirty = action.payload
    },
    setTagEditItem: (state: CountdownState, action: PayloadAction<any | undefined>) => {
      state.tagEditItem = action.payload
    },
    setWorkSpaceDirty: (state: CountdownState, action: PayloadAction<boolean>) => {
      state.workSpaceDirty = action.payload
    },
    setWorkSpaceEditItem: (state: CountdownState, action: PayloadAction<any | undefined>) => {
      state.workSpaceEditItem = action.payload
    },
    setTaskListDirty: (state: CountdownState, action: PayloadAction<boolean>) => {
      state.taskListDirty = action.payload
    },
    setTaskListEditItem: (state: CountdownState, action: PayloadAction<any | undefined>) => {
      state.taskListEditItem = action.payload
    },
    clearAll: (state: CountdownState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
      state.dataList = []
    },
  },
})

export default countdownStore
