import { Award } from '@app/pages/AwardManagement/AwardList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../memoStore/MemoStore'

export type AwardState = {
  loadingStatus: Loading
  dataList: Award[]
  dirty: boolean
  editItem?: Award
}

const initialState: AwardState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
}

const awardStore = createSlice({
  name: 'award',
  initialState: initialState as AwardState,
  reducers: {
    setLoadingStatus: (state: AwardState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setAwardList: (state: AwardState, action: PayloadAction<Award[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: AwardState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: AwardState, action: PayloadAction<Award | undefined>) => {
      state.editItem = action.payload
    },
    clearAll: (state: AwardState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
    },
  },
})

export default awardStore
