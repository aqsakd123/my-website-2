import PermissionCheck from '@app/components/PermissionCheck'
import AppProvider from '@app/config/AppProvider'
import { initRoutes, RouteInfo } from '@app/config/routes'
import E403 from '@app/pages/error/E403'
import { Provider } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import { persistor, store } from './store/store'
import '@app/App.css'
import { PersistGate } from 'redux-persist/integration/react'

const buildElement = (e: RouteInfo) => {
  if (e.element) {
    return e.element
  }
  if (e.roles && e.layout) {
    return <PermissionCheck roles={e.roles} elementPass={e.layout} elementFail={<E403 />} />
  }
  return e.layout
}

const App = () => {
  const routes = initRoutes()

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProvider>
          <Routes>
            {routes.map((e) => (
              <Route
                key={`route-${e.path}`}
                path={e.path}
                caseSensitive={false}
                element={buildElement(e)}
              >
                {e.children &&
                  e.children.map((c) => (
                    <Route
                      key={`route-${e.path}-${c.path}`}
                      path={c.path}
                      caseSensitive={false}
                      element={c.element}
                    />
                  ))}
              </Route>
            ))}
          </Routes>
        </AppProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
