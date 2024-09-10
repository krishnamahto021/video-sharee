import { ConfigWithJWT, ConfigWithoutJWT } from "../types";

export const useConfig = () => {
  const token = localStorage.getItem("token");
  const configWithJWT: ConfigWithJWT = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    },
  };

  const configWithoutJWT: ConfigWithoutJWT = {
    headers: {
      "Content-type": "application/json",
    },
  };

  return { configWithJWT, configWithoutJWT };
};
