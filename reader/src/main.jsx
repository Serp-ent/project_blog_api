import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./main.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './components/Root.jsx';
import ErrorPage from './components/error-page.jsx';
import SigninForm from './components/SigninForm.jsx';
import SignupForm from './components/SignupForm.jsx';
import BlogPostsList from './components/blogPostsList/BlogPostsLists.jsx';
import BlogPost from './components/blogPost/BlogPost.jsx';
import AuthorsList from './components/authorsList/AuthorsList.jsx';
import About from './components/about/About.jsx';
import Profile from './components/profile/Profile.jsx';
import MyProfile from './components/profile/MyProfile.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <BlogPostsList />,
      },
      {
        path: 'signin',
        element: <SigninForm />,
      },
      {
        path: 'signup',
        element: <SignupForm />,
      },
      {
        path: '/posts/:postId',
        element: <BlogPost />
      },
      {
        path: '/authors',
        element: <AuthorsList />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/profile',
        element: <MyProfile />
      },
      {
        path: '/profile/:id',
        element: <Profile />
      }
    ],
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
