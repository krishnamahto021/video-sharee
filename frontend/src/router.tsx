import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import VerifyUser from "./pages/auth/VerifyUser";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import Upload from "./pages/user/Upload";
import Home from "./pages/Home";
import SearchPage from "./pages/SearchPage";
import SingleVideoPage from "./pages/SingleVideoPage";
import {
  ProtectedRoute,
  ProtectedRouteHome,
} from "./components/ProtectedRoute";
import MyVideos from "./pages/user/MyVideos";
import Dashboard from "./pages/user/Dashboard";
import AllVideos from "./pages/AllVideos";

export const router = createBrowserRouter([
  // public routes
  { path: "/", element: <Home /> },
  { path: "/all-videos", element: <AllVideos /> },
  { path: "/search-video", element: <SearchPage /> },
  { path: "/video/:videoId", element: <SingleVideoPage /> },
  { path: "/verify-user/:token", element: <VerifyUser /> },
  { path: "/reset-password", element: <ResetPasswordEmail /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  // show these pages only if the user is not logged in
  { path: "/sign-up", element: <ProtectedRoute element={<SignUp />} /> },
  { path: "/sign-in", element: <ProtectedRoute element={<SignIn />} /> },

  // show these pages only when user is logged in
  {
    path: "/user/dashboard",
    element: <ProtectedRouteHome element={<Dashboard />} />,
  },
  {
    path: "/user/profile",
    element: <ProtectedRouteHome element={<UserProfile />} />,
  },
  {
    path: "/user/edit/my-videos", 
    element: <ProtectedRouteHome element={<MyVideos />} />,
  },

  {
    path: "/user/upload-video",
    element: <ProtectedRouteHome element={<Upload />} />,
  },
]);
