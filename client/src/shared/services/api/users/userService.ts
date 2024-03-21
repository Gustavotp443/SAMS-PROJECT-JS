import { api } from "../axios-config";

export interface IDetailUser {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

const register = async (dados: ICreateUser): Promise<number | Error> => {
  try {
    const { data } = await api.post<IDetailUser>(`/register`, dados);

    if (data) {
      return data.id;
    }

    return new Error("Erro ao criar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao criar o registro."
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await api.delete(`/user/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};

const getById = async (id: number): Promise<IDetailUser | Error> => {
  try {
    const { data } = await api.get(`/user/${id}`);

    if (data) {
      return data;
    }

    return new Error("Erro ao consultar o registro.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao consultar o registro."
    );
  }
};

export const userService = {
  register,
  deleteById,
  getById
};
