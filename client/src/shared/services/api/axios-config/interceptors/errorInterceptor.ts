import { AxiosError } from "axios";

export const errorInterceptor = (error: AxiosError) => {
  if (error.message === "Network Error") {
    return Promise.reject(new Error("Erro de conexão."));
  }

  if (error.response?.status === 401) {
    //FAZER SISTEMA AUTENTICACAO POSTERIORMENTE
    //do something
  }

  return Promise.reject(error);
};
