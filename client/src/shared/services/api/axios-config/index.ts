import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";
import { enviromnent } from "../../../environment";

const api = axios.create({
  baseURL: enviromnent.URL_BASE
});

api.interceptors.response.use(
  response => responseInterceptor(response),
  error => errorInterceptor(error)
);

export { api };
