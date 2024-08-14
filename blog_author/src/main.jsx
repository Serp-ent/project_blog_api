import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import ErrorPage from './components/ErrorPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import Root from './components/Root.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import CreatePost from './components/CreatePost.jsx'
import PostsList from './components/PostsList.jsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root></Root>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/login',
        element: <LoginPage></LoginPage>
      },
      {
        path: '/register',
        element: <RegisterPage />
      },
      {
        path: '/create',
        element: <CreatePost />
      },
      {
        path: '/posts',
        element: <PostsList />
      }
    ]
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
