import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import ErrorPage from './components/ErrorPage.jsx'
import LoginPage from './components/LoginPage.jsx'
import Root from './components/Root.jsx'
import RegisterPage from './components/RegisterPage.jsx'
import CreatePost from './components/CreatePost.jsx'
import PostsList from './components/PostsList.jsx'
import LogoutPage from './components/LogoutPage.jsx'
import { AuthProvider, useAuth } from './utils/Auth.jsx'
import PostDetail from './components/PostDetails.jsx'
import MyProfile from './components/profile/MyProfile.jsx'
import Profile from './components/profile/Profile.jsx'
import { fetchWithAuth } from './utils/utils.js'
import EditPost from './components/EditPost.jsx'

function ProtectedRoute({ element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to={'/login'} />
}


const handleEdit = (id) => {
  console.log('Edit', id)
}
const handleDelete = async (id) => {
  await fetchWithAuth(`http://localhost:3000/api/posts/${id}`, {
    method: 'DELETE',
  });
}

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
        element: <ProtectedRoute element={<CreatePost />} />
      },
      {
        path: '/posts',
        element: <ProtectedRoute element={
          <PostsList
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        }
        />
      },
      {
        path: '/posts/:id',
        element: <ProtectedRoute element={
          <PostDetail
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        }
        />
      },
      {
        path: '/posts/:id/edit',
        element: <ProtectedRoute element={ <EditPost /> }
        />
      },
      {
        path: '/profile',
        element: <ProtectedRoute
          element={<MyProfile />}>
        </ProtectedRoute>,
      },
      {
        path: '/profile/:id',
        element: <Profile />
      }
    ],
  },
  {
    path: '/logout',
    element: <LogoutPage></LogoutPage>
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
)
