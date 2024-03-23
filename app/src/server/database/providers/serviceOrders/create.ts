import * as kn from "knex";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IServiceOrder } from "../../models/serviceOrders";

export const create = async (
  order: Omit<IServiceOrder, "id" | "order_date">,
  trx: kn.Knex.Transaction
): Promise<IServiceOrder | Error> => {
  try {
    const [result] = await Knex(ETableNames.serviceOrders)
      .transacting(trx)
      .insert(order)
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
