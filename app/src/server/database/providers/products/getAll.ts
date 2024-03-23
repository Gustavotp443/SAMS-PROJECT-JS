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
        `${ETableNames.products}.*`,
        Knex.raw(
          `(${ETableNames.stock}.quantity - COALESCE(SUM(${ETableNames.productItens}.quantity), 0)) as quantity`
        )
      )
      .leftJoin(ETableNames.stock, function() {
        this.on(`${ETableNames.products}.id`, "=", `${ETableNames.stock}.product_id`);
      })
      .leftJoin(ETableNames.productItens, function() {
        this.on(`${ETableNames.products}.id`, "=", `${ETableNames.productItens}.product_id`);
      })
      .where(`${ETableNames.products}.id`, Number(id))
      .orWhere(`${ETableNames.products}.name`, "like", `%${filter}%`)
      .andWhere(`${ETableNames.products}.user_id`, userId)
      .groupBy(`${ETableNames.products}.id`)
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
