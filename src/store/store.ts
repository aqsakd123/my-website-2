import storage from 'redux-persist/lib/storage'
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import commonStore from './commonStore/CommonStore'
import memoStore from './memoStore/MemoStore'
import tagStore from './tagStore/TagStore'
import awardStore from './awardStore/AwardStore'
import financeStore from './financeStore/FinanceStore'
import categoryStore from './categoryStore/CategoryStore'
import taskListStore from './taskListStore/TaskListStore'
import subTaskStore from './subTaskStore/SubTaskStore'
import workSpaceStore from './workSpaceStore/WorkSpaceStore'

const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['commonStore'],
}

const rootReducer = combineReducers({
  commonStore: commonStore.reducer,
  memoStore: memoStore.reducer,
  tagStore: tagStore.reducer,
  awardStore: awardStore.reducer,
  financeStore: financeStore.reducer,
  categoryStore: categoryStore.reducer,
  tasklistStore: taskListStore.reducer,
  subTaskStore: subTaskStore.reducer,
  workSpaceStore: workSpaceStore.reducer,
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export { store, persistor, rootReducer }
