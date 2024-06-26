import * as kn from "knex";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";

export const create = async (
  product: Omit<IProduct, "id">,
  trx: kn.Knex.Transaction
): Promise<IProduct | Error> => {
  try {
    const [result] = await Knex(ETableNames.products)
      .transacting(trx)
      .insert(product)
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
