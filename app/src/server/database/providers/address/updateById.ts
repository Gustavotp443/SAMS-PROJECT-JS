import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import * as kn from "knex";
import { IAddress } from "../../models";

export const updateById = async (
  id: number,
  trx: kn.Knex.Transaction,
  address: Omit<IAddress, "id">
): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.address)
      .transacting(trx)
      .update(address)
      .where("id", "=", id);

    if (result > 0) return;

    return new Error("Error when updating data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when updating data!");
  }
};
