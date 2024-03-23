import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import * as kn from "knex";
import { IServiceOrder } from "../../models/serviceOrders";

export const updateById = async (
  id: number,
  order: Omit<IServiceOrder, "id" | "order_date">,
  trx: kn.Knex.Transaction
): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.serviceOrders)
      .transacting(trx)
      .update(order)
      .where("id", "=", id);

    if (result > 0) return;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
