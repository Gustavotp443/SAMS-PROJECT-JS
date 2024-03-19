import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";
import * as kn from "knex";

export const updateById = async (
  id: number,
  product: Omit<IProduct, "id" | "user_id">,
  trx: kn.Knex.Transaction
): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.products)
      .transacting(trx)
      .update(product)
      .where("id", "=", id);

    if (result > 0) return;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
