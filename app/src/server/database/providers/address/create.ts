import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IAddress } from "../../models";
import * as kn from "knex";

export const create = async (
  address: Omit<IAddress, "id">,
  trx: kn.Knex.Transaction
): Promise<IAddress | Error> => {
  try {
    const [result] = await Knex(ETableNames.address)
      .transacting(trx)
      .insert(address)
      .returning("*");

    if (typeof result === "object") {
      return result;
    }

    return new Error("Error when registering data!");
  } catch (e) {
    return new Error("Error when registering data!");
  }
};
