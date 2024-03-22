import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";
import { enviromnent } from "../../../environment";

const api = axios.create({
  baseURL: enviromnent.URL_BASE
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => responseInterceptor(response),
  error => errorInterceptor(error)
);

export { api };
