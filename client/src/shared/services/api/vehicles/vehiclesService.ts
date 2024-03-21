import { enviromnent } from "../../../environment";
import { api } from "../axios-config";

export interface IListVehicle {
  id: number;
  client_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

export interface IDetailVehicle {
  id: number;
  client_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

export interface ICreateVehicle {
  client_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

export interface IUpdateVehicle {
  client_id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

type TVehicleWithTotalCount = {
  data: IListVehicle[];
  totalCount: number;
};

const create = async (
  dados: Omit<ICreateVehicle, "id">
): Promise<number | Error> => {
  try {
    const { data } = await api.post<IDetailVehicle>(`/vehicle`, dados);

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
    await api.delete(`/vehicle/${id}`);
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
): Promise<TVehicleWithTotalCount | Error> => {
  try {
    const urlRelativa = `/vehicle?page=${page}&limit=${enviromnent.LINE_LIMITS}&filter=${filter}`;
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

const getById = async (id: number): Promise<IDetailVehicle | Error> => {
  try {
    const { data } = await api.get(`/vehicle/${id}`);

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
  dados: IUpdateVehicle
): Promise<void | Error> => {
  try {
    await api.put(`/vehicle/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

export const vehicleService = {
  create,
  deleteById,
  getAll,
  getById,
  updateById
};
