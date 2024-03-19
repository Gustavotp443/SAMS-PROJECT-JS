import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import * as kn from "knex";

export const updateByProductId = async (
  productId: number,
  trx: kn.Knex.Transaction,
  quantity: number
): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.stock)
      .transacting(trx)
      .update({ quantity })
      .where("product_id", "=", productId);

    if (result > 0) return;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
