import { Tag } from '@app/pages/Tags/TagList'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Loading } from '../memoStore/MemoStore'

export type TagState = {
  loadingStatus: Loading
  dataList: Tag[]
  dirty: boolean
  editItem?: Tag
  type?: string
}

const initialState: TagState = {
  loadingStatus: 'NotLoad',
  dataList: [],
  dirty: false,
}

const tagStore = createSlice({
  name: 'tag',
  initialState: initialState as TagState,
  reducers: {
    setLoadingStatus: (state: TagState, action: PayloadAction<Loading>) => {
      state.loadingStatus = action.payload
    },
    setTagList: (state: TagState, action: PayloadAction<Tag[]>) => {
      state.dataList = action.payload
    },
    setDirty: (state: TagState, action: PayloadAction<boolean>) => {
      state.dirty = action.payload
    },
    setEditItem: (state: TagState, action: PayloadAction<Tag | undefined>) => {
      state.editItem = action.payload
    },
    setTypeOpenScreen: (state: TagState, action: PayloadAction<string | undefined>) => {
      state.type = action.payload
    },
    clearAll: (state: TagState) => {
      state.loadingStatus = 'NotLoad'
      state.dirty = false
      state.editItem = undefined
      state.dataList = []
      state.type = undefined
    },
  },
})

export default tagStore
