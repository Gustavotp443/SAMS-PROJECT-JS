import { enviromnent } from "../../../environment";
import { api } from "../axios-config";

export interface IListEmployee {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface IDetailEmployee {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ICreateEmployee {
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

export interface IUpdateEmployee {
  user_id: number;
  name: string;
  email: string;
  phone: string;
}

type TEmployeeWithTotalCount = {
  data: IListEmployee[];
  totalCount: number;
};

const create = async (dados: ICreateEmployee): Promise<number | Error> => {
  try {
    const { data } = await api.post<IDetailEmployee>(`/employee`, dados);

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
    await api.delete(`/employee/${id}`);
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
): Promise<TEmployeeWithTotalCount | Error> => {
  try {
    const urlRelativa = `/employee?page=${page}&limit=${enviromnent.LINE_LIMITS}&filter=${filter}`;
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

const getById = async (id: number): Promise<IDetailEmployee | Error> => {
  try {
    const { data } = await api.get(`/employee/${id}`);

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
  dados: IUpdateEmployee
): Promise<void | Error> => {
  try {
    await api.put(`/employee/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

export const employeeService = {
  create,
  deleteById,
  getAll,
  getById,
  updateById
};
