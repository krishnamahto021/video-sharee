import axios from "axios";

const backendApi = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
});

export default backendApi;
