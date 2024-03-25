import { api } from "../axios-config";

const deleteByProductId = async (
  productId: number,
  serviceOrderId: number
): Promise<void | Error> => {
  try {
    await api.delete(
      `/productItem?productId=${productId}&serviceOrderId=${serviceOrderId}`
    );
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || "Erro ao apagar o registro."
    );
  }
};

export const productItensService = {
  deleteByProductId
};
