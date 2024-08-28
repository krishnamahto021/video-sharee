import { createBrowserRouter } from "react-router-dom";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import UserProfile from "./pages/user/UserProfile";
import VerifyUser from "./pages/auth/VerifyUser";
import ResetPasswordEmail from "./pages/auth/ResetPasswordEmail";

export const router = createBrowserRouter([
  { path: "/", element: <SignUp /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/user/profile", element: <UserProfile /> },
  { path: "/verify-user/:token", element: <VerifyUser /> },
  { path: "/reset-password", element: <ResetPasswordEmail /> },
]);
