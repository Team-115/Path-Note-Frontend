import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home'
import CourseBoard from './pages/CourseBoard'
import Profile from './pages/Profile'
import DefaultLayout from './layouts/Default'

const router = createBrowserRouter([
    {
      path: '/',
      element: <DefaultLayout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: '/courseboard',
          element: <CourseBoard />
        },
        {
          path: '/profile',
          element: <Profile />
        }
      ]
    },
])

export default function Router() {
  return <RouterProvider router={router} />
}