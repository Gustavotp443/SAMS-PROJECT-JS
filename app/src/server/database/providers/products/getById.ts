import { getUserId } from "../../../utils";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";
import * as kn from "knex";

export const getById = async (
  id: number,
  trx: kn.Knex.Transaction,
  token: string
): Promise<IProduct | Error> => {
  try {
    const uid = getUserId(token);
    const result = await Knex(ETableNames.products)
      .transacting(trx)
      .select(
        `${ETableNames.products}.id`,
        `${ETableNames.products}.user_id`,
        `${ETableNames.products}.name`,
        `${ETableNames.products}.price`,
        Knex.raw(
          `${ETableNames.stock}.quantity - COALESCE(SUM(${ETableNames.productItens}.quantity), 0) as quantity`
        )
      )
      .leftJoin(ETableNames.stock, function () {
        this.on(
          `${ETableNames.products}.id`,
          "=",
          `${ETableNames.stock}.product_id`
        );
      })
      .leftJoin(ETableNames.productItens, function () {
        this.on(
          `${ETableNames.products}.id`,
          "=",
          `${ETableNames.productItens}.product_id`
        );
      })
      .where(`${ETableNames.products}.id`, "=", id)
      .andWhere(`${ETableNames.products}.user_id`, uid)
      .first();
    if (result) return result;

    return new Error("Error when getting data!");
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
