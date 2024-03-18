import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IStock } from "../../models";
import * as kn from "knex";

export const getByProductId = async (
  productId: number,
  trx: kn.Knex.Transaction
): Promise<IStock | Error> => {
  try {
    const result = await Knex(ETableNames.stock)
      .transacting(trx)
      .select("*")
      .where("product_id", "=", productId)
      .first();
    if (result) return result;

    return new Error("Error when getting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
