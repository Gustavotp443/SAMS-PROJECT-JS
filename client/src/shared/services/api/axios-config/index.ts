import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";
import { enviromnent } from "../../../environment";

const api = axios.create({
  baseURL: enviromnent.URL_BASE,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN") || ""}`
  }
});

api.interceptors.response.use(
  response => responseInterceptor(response),
  error => errorInterceptor(error)
);

export { api };
