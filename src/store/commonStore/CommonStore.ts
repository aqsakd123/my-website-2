import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const colorOptions = [
  { id: 0, color: '#f9e9e9' },
  { id: 1, color: '#e14eca' },
  { id: 2, color: '#1d8cf8' },
  { id: 3, color: '#00bf9a' },
  { id: 4, color: '#ff8d72' },
  { id: 5, color: '#fd5d93' },
  { id: 6, color: '#1e2f53' },
]

export type CommonState = {
  isLoading: boolean
  isSidebar: boolean
  messageAlert?: MessageAlertProp
  userInfo: any
  sidebarColor: string
  darkMode: boolean
}

export type DialogState = 'add' | 'edit' | 'none'

export type MessageAlertProp = {
  info?: string
  isShowAlert?: boolean
  messageId?: string
  type?: string
}

const initialState: CommonState = {
  isLoading: false,
  isSidebar: false,
  messageAlert: {
    info: '',
    isShowAlert: false,
    messageId: '',
    type: 'success',
  },
  userInfo: {},
  sidebarColor: colorOptions[0].color,
  darkMode: true,
}

const commonStore = createSlice({
  name: 'common',
  initialState: initialState as CommonState,
  reducers: {
    setLoading: (state: CommonState, action) => {
      state.isLoading = action.payload
    },
    setSidebar: (state: CommonState, action) => {
      state.isSidebar = action.payload
    },
    setMessageAlert: (state: CommonState, action: PayloadAction<MessageAlertProp>) => {
      state.messageAlert = {
        ...state.messageAlert,
        ...action.payload,
      }
    },
    setUserInfo: (state: CommonState, action) => {
      state.userInfo = action.payload
    },
    setSidebarColor: (state: CommonState, action) => {
      state.sidebarColor = action.payload
    },
    setDarkMode: (state: CommonState, action) => {
      state.darkMode = action.payload
    },
  },
})

export default commonStore
