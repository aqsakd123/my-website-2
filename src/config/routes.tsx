import Auth from '@app/layout/Auth'
import Default from '@app/layout/Default'
import Login from '@app/pages/login/Login'
import E404 from '@app/pages/error/E404'
import Home from '@app/pages/Home/Home'
import Target from '@app/pages/Home/Target'
import Next7Days from '@app/pages/Home/Next7Days'
import Workspaces from '@app/pages/ToDoList/Workspaces'
import MemoList from '@app/pages/cards/memo/MemoList'
import StudyList from '@app/pages/cards/StudyCard/StudyList'
import FinanceList from '@app/pages/FinanceManagement/FinanceList'
import TaskListList from '@app/pages/TaskListManagement/TaskListList'
import CountdownList from '@app/pages/CountdownManagement/CountdownList'

export type RouteInfo = {
  path: string
  element?: JSX.Element
  layout?: JSX.Element
  roles?: string[]
  children?: RouteInfo[]
}

/**
 * Define application routes
 * @returns
 */
export const initRoutes = (): RouteInfo[] => {
  return [
    {
      path: '/login',
      layout: <Auth />,
      children: [
        {
          path: '',
          element: <Login />,
        },
      ],
    },
    {
      path: '/',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <Home />,
        },
      ],
    },
    {
      path: '/target',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <Target />,
        },
      ],
    },
    {
      path: '/tasks',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <TaskListList />,
        },
      ],
    },
    {
      path: '/calendars',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <Next7Days />,
        },
      ],
    },
    {
      path: '/work-spaces',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <Workspaces />,
        },
        {
          path: ':id',
          element: <TaskListList />,
        },
      ],
    },
    {
      path: '/countdown',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <CountdownList />,
        },
      ],
    },
    {
      path: '/finance',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <FinanceList />,
        },
      ],
    },
    {
      path: '/memo',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <MemoList />,
        },
      ],
    },
    {
      path: '/study-cards',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <StudyList />,
        },
      ],
    },

    {
      path: '*',
      element: <E404 />,
    },
  ]
}
