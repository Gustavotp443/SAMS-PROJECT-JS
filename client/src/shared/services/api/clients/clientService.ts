import { enviromnent } from "../../../environment";
import { api } from "../axios-config";

export interface IListClient {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    id: number;
    street: string;
    city: string;
    state: string;
    code: string;
  };
}

export interface IDetailClient {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    id: number;
    street: string;
    city: string;
    state: string;
    code: string;
  };
}

export interface ICreateClient {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    code: string;
  };
}

export interface IUpdateClient {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    code: string;
  };
}

type TClientWithTotalCount = {
  data: IListClient[];
  totalCount: number;
};

const create = async (dados: ICreateClient): Promise<number | Error> => {
  try {
    const { data } = await api.post<IDetailClient>(`/client`, dados);

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
    await api.delete(`/client/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};

const getAll = async (
  page = 1,
  filter = ""
): Promise<TClientWithTotalCount | Error> => {
  try {
    const urlRelativa = `/client?page=${page}&limit=${enviromnent.LINE_LIMITS}&filter=${filter}`;
    const { data, headers } = await api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers["x-total-count"] || enviromnent.LINE_LIMITS)
      };
    }

    return new Error("Erro ao lista os registros.");
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao lista os registros."
    );
  }
};

const getById = async (id: number): Promise<IDetailClient | Error> => {
  try {
    const { data } = await api.get(`/client/${id}`);

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

const updateById = async (
  id: number,
  dados: IUpdateClient
): Promise<void | Error> => {
  try {
    await api.put(`/client/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

export const clientService = {
  create,
  deleteById,
  getAll,
  getById,
  updateById
};
