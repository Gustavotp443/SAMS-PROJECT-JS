/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";
import * as kn from "knex";
import { StockProvider } from "../stock";

export const getAll = async (
  page: number,
  limit: number,
  filter: string,
  id = 0,
  trx: kn.Knex.Transaction
): Promise<IProduct[] | Error> => {
  try {
    const result = await Knex(ETableNames.products)
      .transacting(trx)
      .select("*")
      .where("id", Number(id))
      .orWhere("name", "like", `%${filter}%`)
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
        .first();


      if (resultById) return [...resultsWithStock, resultById];
    }

    return resultsWithStock;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
