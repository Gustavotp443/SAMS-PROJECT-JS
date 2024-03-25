/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";
import * as kn from "knex";

import { getUserId } from "../../../utils";

export const getAll = async (
  page: number,
  limit: number,
  filter: string,
  id = 0,
  trx: kn.Knex.Transaction,
  token: string
): Promise<IProduct[] | Error> => {
  try {
    const userId = getUserId(token);
    const result = await Knex(ETableNames.products)
      .transacting(trx)
      .select(
        `${ETableNames.products}.id`,
        `${ETableNames.products}.user_id`,
        `${ETableNames.products}.name`,
        `${ETableNames.products}.price`,
        Knex.raw(
          `(${ETableNames.stock}.quantity - COALESCE(SUM(CASE WHEN ${ETableNames.productItens}.product_id IS NOT NULL THEN ${ETableNames.productItens}.quantity ELSE 0 END), 0)) as quantity`
        )
      )
      .leftJoin(ETableNames.stock, `${ETableNames.products}.id`, "=", `${ETableNames.stock}.product_id`)
      .leftJoin(ETableNames.productItens, `${ETableNames.products}.id`, "=", `${ETableNames.productItens}.product_id`)
      .where(function() {
        this.where(`${ETableNames.products}.id`, Number(id))
          .orWhere(`${ETableNames.products}.name`, "like", `%${filter}%`);
      })
      .andWhere(`${ETableNames.products}.user_id`, userId)
      .groupBy(
        `${ETableNames.products}.id`,
        `${ETableNames.products}.user_id`,
        `${ETableNames.products}.name`,
        `${ETableNames.products}.price`,
        `${ETableNames.stock}.quantity`
      )
      .offset((page - 1) * limit)
      .limit(limit);

    if (id > 0 && result.every((item) => item.id !== id)) {
      const resultById = await Knex(ETableNames.products)
        .transacting(trx)
        .select("*")
        .where("id", "=", id)
        .andWhere("user_id", userId)
        .first();

      if (resultById) return [...result, resultById];
    }

    return result;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};