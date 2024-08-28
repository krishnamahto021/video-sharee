import { useSelector } from "react-redux";
import { selectLoggedInUser } from "../redux/reducers/auth/authReducer";
import { ConfigWithJWT, ConfigWithoutJWT } from "../types";

export const useConfig = () => {
  const loggedInUser = useSelector(selectLoggedInUser);
  const configWithJWT: ConfigWithJWT = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${loggedInUser?.token || ""}`,
    },
  };

  const configWithoutJWT: ConfigWithoutJWT = {
    headers: {
      "Content-type": "application/json",
    },
  };

  return { configWithJWT, configWithoutJWT };
};
