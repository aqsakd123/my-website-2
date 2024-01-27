import { MemoInput } from '@app/api/memo/memo-type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export type Loading = 'NotLoad' | 'Loading' | 'Loaded' | 'Error'

export type MemoState = {
  loadingStatus: Loading
  dataList: MemoInput[]
}

const initialState: MemoState = {
  loadingStatus: 'NotLoad',
  dataList: [],
}

const memoStore = createSlice({
  name: 'memo',
  initialState: initialState as MemoState,
  reducers: {
    setLoadingStatus: (state: MemoState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setMemoList: (state: MemoState, action: PayloadAction<MemoInput[]>) => {
      state.dataList = action.payload
    },
    clearAll: (state: MemoState) => {
      state.loadingStatus = 'NotLoad'
      state.dataList = []
    },
  },
})

export default memoStore
