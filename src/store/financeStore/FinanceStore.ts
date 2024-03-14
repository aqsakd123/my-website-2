import { Finance } from '@app/pages/FinanceManagement/FinanceList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../memoStore/MemoStore'

export type FinanceState = {
  loadingStatus: Loading
  dataList: Finance[]
  dirty: boolean
  editItem?: Finance
  transactionDirty: boolean
  transactionEditItem?: any
}

const initialState: FinanceState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
  transactionDirty: false,
}

const financeStore = createSlice({
  name: 'finance',
  initialState: initialState as FinanceState,
  reducers: {
    setLoadingStatus: (state: FinanceState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setFinanceList: (state: FinanceState, action: PayloadAction<Finance[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: FinanceState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: FinanceState, action: PayloadAction<Finance | undefined>) => {
      state.editItem = action.payload
    },

    setTransactionDirty: (state: FinanceState, action: PayloadAction<boolean>) => {
      state.transactionDirty = action.payload
    },
    setTransactionEditItem: (state: FinanceState, action: PayloadAction<any | undefined>) => {
      state.transactionEditItem = action.payload
    },

    clearAll: (state: FinanceState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
      state.dataList = []
    },
  },
})

export default financeStore
