import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IClient } from "../../models";
import * as kn from "knex";

export const updateById = async (
  id: number,
  client: Omit<IClient, "id" | "address_id">,
  trx: kn.Knex.Transaction
): Promise<IClient | Error> => {
  try {
    const [result] = await Knex(ETableNames.clients)
      .transacting(trx)
      .update(client)
      .where("id", "=", id)
      .returning("*");

    if (result) return result;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
