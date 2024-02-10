import Auth from '@app/layout/Auth'
import Default from '@app/layout/Default'
import Login from '@app/pages/login/Login'
import E404 from '@app/pages/error/E404'
import Home from '@app/pages/home/Home'
import Target from '@app/pages/home/Target'
import Next7Days from '@app/pages/home/Next7Days'
import Workspaces from '@app/pages/to-do-list/workspaces/Workspaces'
import Award from '@app/pages/award/Award'
import MemoList from '@app/pages/cards/memo/MemoList'
import StudyList from '@app/pages/cards/StudyCard/StudyList'

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
          element: <Target />,
        },
      ],
    },
    {
      path: '/next-7-days',
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
      ],
    },
    {
      path: '/award',
      layout: <Default />,
      roles: ['any'],
      children: [
        {
          path: '',
          element: <Award />,
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
