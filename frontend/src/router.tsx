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

export const router = createBrowserRouter([
  { path: "/", element: <SignUp /> },
  { path: "/home", element: <Home /> },
  { path: "/search-video", element: <SearchPage /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/user/profile", element: <UserProfile /> },
  { path: "/verify-user/:token", element: <VerifyUser /> },
  { path: "/reset-password", element: <ResetPasswordEmail /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/user/upload-video", element: <Upload /> },
]);
