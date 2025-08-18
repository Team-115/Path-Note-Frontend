import { createBrowserRouter, RouterProvider } from 'react-router'
import Home from './pages/Home'
import CourseBoard from './pages/CourseBoard'
import Profile from './pages/Profile'

const router = createBrowserRouter([
    {
      path: '/',
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
])

export default function Router() {
  return <RouterProvider router={router} />
}