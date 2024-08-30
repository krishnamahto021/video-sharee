import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectLoggedInUser } from "../redux/reducers/auth/authReducer";
import { ReactNode } from "react";
interface RouteProps {
  element: ReactNode;
}
// this route is for all the logged in user
export const ProtectedRouteHome: React.FC<RouteProps> = ({ element }) => {
  const loggedInUser = useSelector(selectLoggedInUser);
  return loggedInUser?.token ? element : <Navigate to={"/sign-in"} />;
};

//this route is for the user if he is logged in show profile else show element i.e. signup and signin
export const ProtectedRoute: React.FC<RouteProps> = ({ element }) => {
  const loggedInUser = useSelector(selectLoggedInUser);

  return loggedInUser?.token ? <Navigate to={"/user/profile"} /> : element;
};
