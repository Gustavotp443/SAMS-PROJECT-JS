import { enviromnent } from "../../../environment";
import { api } from "../axios-config";
import { IDetailProduct } from "../products/productService";

export interface IListServiceOrder {
  id: number;
  vehicle_id?: number;
  employee_id?: number;
  user_id: number;
  description?: string;
  order_date: Date;
  productItens: [
    {
      id: number;
      service_order_id: number;
      product_id: number;
      quantity: number;
      product: IDetailProduct;
    }
  ];
}

export interface IDetailServiceOrder {
  id: number;
  vehicle_id?: number;
  employee_id?: number;
  user_id: number;
  description?: string;
  order_date: Date;
  productItens: [
    {
      id: number;
      service_order_id: number;
      product_id: number;
      quantity: number;
      product: IDetailProduct;
    }
  ];
}

export interface IProductQuantity {
  product_id: number;
  quantity: number;
}

export interface ICreateServiceOrder {
  vehicle_id?: number;
  employee_id?: number;
  user_id: number;
  description?: string;
  products?: IProductQuantity[];
}

export interface ICreateServiceOrderResponse {
  id: number;
  vehicle_id?: number;
  employee_id?: number;
  user_id: number;
  description?: string;
  order_date: Date;
  productItens: [
    {
      id: number;
      service_order_id: number;
      product_id: number;
      quantity: number;
    }
  ];
}

export interface IUpdateServiceOrder {
  vehicle_id?: number;
  employee_id?: number;
  user_id: number;
  description?: string;
  products?: IProductQuantity[];
}

type TServiceOrderWithTotalCount = {
  data: IListServiceOrder[];
  totalCount: number;
};

const create = async (dados: ICreateServiceOrder): Promise<number | Error> => {
  try {
    const { data } = await api.post<ICreateServiceOrderResponse>(
      `/serviceorder`,
      dados
    );

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
    await api.delete(`/serviceorder/${id}`);
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
): Promise<TServiceOrderWithTotalCount | Error> => {
  try {
    const urlRelativa = `/serviceorder?page=${page}&limit=${enviromnent.LINE_LIMITS}&filter=${filter}`;
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

const getById = async (id: number): Promise<IDetailServiceOrder | Error> => {
  try {
    const { data } = await api.get(`/serviceorder/${id}`);

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
  dados: IUpdateServiceOrder
): Promise<void | Error> => {
  try {
    await api.put(`/serviceorder/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao atualizar o registro."
    );
  }
};

export const serviceOrderService = {
  create,
  deleteById,
  getAll,
  getById,
  updateById
};
