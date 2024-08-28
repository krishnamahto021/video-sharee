import { AxiosRequestConfig } from "axios";
export interface AuthFormData {
  email: string;
  password: string;
}


// Type for configuration with JWT token
export interface ConfigWithJWT extends AxiosRequestConfig {
  headers: {
    "Content-type": string;
    Authorization: string;
  };
}

// Type for configuration without JWT token
export interface ConfigWithoutJWT extends AxiosRequestConfig {
  headers: {
    "Content-type": string;
  };
}

