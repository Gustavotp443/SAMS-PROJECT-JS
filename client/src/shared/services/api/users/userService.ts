import { enviromnent } from "../../../environment";
import { api } from "../axios-config";

export interface IListProduct {
  id: number;
  user_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface IDetailProduct {
  id: number;
  user_id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ICreateProduct {
  id: number;
  user_id: number;
  name: string;
  price: number;
  quantity?: number;
}

export interface IUpdateProduct {
  user_id: number;
  name: string;
  price: number;
  quantity?: number;
}

type TProductWithTotalCount = {
  data: IListProduct[];
  totalCount: number;
};

const register = async (
  dados: Omit<ICreateProduct, "id">
): Promise<number | Error> => {
  try {
    const { data } = await api.post<ICreateProduct>(`/product`, dados);

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
    await api.delete(`/product/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};

const getById = async (id: number): Promise<IDetailProduct | Error> => {
  try {
    const { data } = await api.get(`/product/${id}`);

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
