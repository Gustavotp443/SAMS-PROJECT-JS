/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";
import * as kn from "knex";
import { StockProvider } from "../stock";
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
      .select("*")
      .where("id", Number(id))
      .orWhere("name", "like", `%${filter}%`)
      .andWhere("user_id", userId)
      .offset((page - 1) * limit)
      .limit(limit);

    const resultsWithStock = await Promise.all(result.map(async (product) => {
      const resultStock = await StockProvider.getByProductId(product.id, trx);
      if (!(resultStock instanceof Error)) {
        return {
          ...product,
          quantity: resultStock instanceof Error ? 0 : resultStock.quantity
        };
      } else {
        return new Error("Error when getting data!");
      }
    }));

    if (id > 0 && resultsWithStock.every((item) => item.id !== id)) {
      const resultById = await Knex(ETableNames.products)
        .transacting(trx)
        .select("*")
        .where("id", "=", id)
        .andWhere("user_id", userId)
        .first();


      if (resultById) return [...resultsWithStock, resultById];
    }

    return resultsWithStock;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
