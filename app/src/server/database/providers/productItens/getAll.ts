/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProductItens } from "../../models";
import * as kn from "knex";

export const getAll = async (
  id = 0,
  trx: kn.Knex.Transaction,
  serviceOrder: number
): Promise<IProductItens[] | Error> => {
  try {
    const result = await Knex(ETableNames.productItens)
      .transacting(trx)
      .select("*")
      .where("service_order_id", serviceOrder);


    if (id > 0 && result.every((item) => item.id !== id)) {
      const resultById = await Knex(ETableNames.productItens)
        .transacting(trx)
        .select("*")
        .where("id", "=", id)
        .andWhere("service_order_id", serviceOrder)
        .first();


      if (result) return [...result, resultById];
    }

    return result;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
