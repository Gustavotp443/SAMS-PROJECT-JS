import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

export const deleteByProductId = async (
  productId: number,
  serviceOrderId: number
): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.productItens)
      .where("product_id", "=", productId)
      .andWhere("service_order_id", "=", serviceOrderId)
      .del();

    console.log(result);
    if (result > 0) return;

    return new Error("Error when deleting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when deleting data!");
  }
};
