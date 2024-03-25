import { AxiosError } from "axios";
import { api } from "../axios-config";

interface IAuth {
  accessToken: string;
}

const auth = async (
  email: string,
  password: string
): Promise<IAuth | Error> => {
  try {
    const { data } = await api.post(`/login`, { email, password });

    if (data) {
      return data;
    }

    return new Error("Erro no login.");
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          return new Error(error.response.data);
        } else {
          return new Error(JSON.stringify(error.response.data));
        }
      }
    }
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro no login."
    );
  }
};

export const AuthService = {
  auth
};

// Função auxiliar para verificar se é um erro do Axios
const isAxiosError = (error: any): error is AxiosError => {
  return error.isAxiosError;
};
