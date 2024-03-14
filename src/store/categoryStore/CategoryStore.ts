import { Category } from '@app/pages/CategoryManagement/CategoryList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../commonStore/CommonStore'

export type CategoryState = {
  loadingStatus: Loading
  dataList: Category[]
  dirty: boolean
  editItem?: Category
  tagDirty: boolean
  tagEditItem?: any
  categoryDirty: boolean
  categoryEditItem?: any
}

const initialState: CategoryState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
  tagDirty: false,
  categoryDirty: false,
}

const categoryStore = createSlice({
  name: 'category',
  initialState: initialState as CategoryState,
  reducers: {
    setLoadingStatus: (state: CategoryState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setCategoryList: (state: CategoryState, action: PayloadAction<Category[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: CategoryState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: CategoryState, action: PayloadAction<Category | undefined>) => {
      state.editItem = action.payload
    },
    setTagDirty: (state: CategoryState, action: PayloadAction<boolean>) => {
      state.tagDirty = action.payload
    },
    setTagEditItem: (state: CategoryState, action: PayloadAction<any | undefined>) => {
      state.tagEditItem = action.payload
    },
    setCategoryDirty: (state: CategoryState, action: PayloadAction<boolean>) => {
      state.categoryDirty = action.payload
    },
    setCategoryEditItem: (state: CategoryState, action: PayloadAction<any | undefined>) => {
      state.categoryEditItem = action.payload
    },
    clearAll: (state: CategoryState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
      state.dataList = []
    },
  },
})

export default categoryStore
