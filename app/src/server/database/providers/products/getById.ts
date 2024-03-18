import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";
import * as kn from "knex";

export const getById = async (
  id: number,
  trx: kn.Knex.Transaction
): Promise<IProduct | Error> => {
  try {
    const result = await Knex(ETableNames.products)
      .transacting(trx)
      .select("*")
      .where("id", "=", id)
      .first();

    if (result) return result;

    return new Error("Error when getting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
