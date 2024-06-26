import { getUserId } from "../../../utils";
import { ETableNames } from "../../ETableNames";
import { IClient } from "../../models";
import { Knex } from "../../knex";
import * as kn from "knex";

export const getById = async (
  id: number,
  trx: kn.Knex.Transaction,
  token: string
): Promise<IClient | Error> => {
  try {
    const uid = getUserId(token);
    const result = await Knex(ETableNames.clients)
      .transacting(trx)
      .select("*")
      .where("id", "=", id)
      .andWhere("user_id", uid)
      .first();

    if (result) return result;

    return new Error("Error when getting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
