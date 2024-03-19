import * as kn from "knex";
import { ETableNames } from "../../ETableNames";
import { IStock } from "../../models/stock";
import { Knex } from "../../knex";

export const create = async (
  productId: number,
  trx: kn.Knex.Transaction,
  quantity: number
): Promise<IStock | Error> => {
  try {
    const [result] = await Knex(ETableNames.stock)
      .transacting(trx)
      .insert({
        product_id: productId,
        quantity: quantity
      })
      .returning("*");

    if (typeof result === "object") {
      return result;
    }

    return new Error("Error when registering data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when registering data!");
  }
};
