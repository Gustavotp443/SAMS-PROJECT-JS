import { getUserId } from "../../../utils";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import * as kn from "knex";

export const count = async (
  filter = "",
  trx: kn.Knex.Transaction,
  token: string
): Promise<number | Error> => {
  try {
    const uid = getUserId(token);
    const [{ count }] = await Knex(ETableNames.products)
      .transacting(trx)
      .where("name", "like", `%${filter}%`)
      .andWhere("user_id", uid)
      .count<[{ count: number }]>("* as count");
    if (Number.isInteger(Number(count))) return Number(count);
    return new Error("Error when consulting total quantity of data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when consulting total quantity of data!");
  }
};
