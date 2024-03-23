/* eslint-disable prettier/prettier */
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProduct } from "../../models";
import * as kn from "knex";
import { getUserId } from "../../../utils";
import { ProductItensProvider } from "../productItens";
import { ProductProvider } from "../products";

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
    const result = await Knex(ETableNames.serviceOrders)
      .transacting(trx)
      .select("*")
      .where("id", Number(id))
      .orWhere("description", "like", `%${filter}%`)
      .andWhere("user_id", userId)
      .offset((page - 1) * limit)
      .limit(limit);

    const resultsWithProductItem = await Promise.all(result.map(async (order) => {
      const resultsProductItens = await ProductItensProvider.getAll(0, trx,order.id);
      if (!(resultsProductItens instanceof Error)) {

        const resultProductWithProductDetail = await Promise.all(resultsProductItens.map(async (item)=>{
          const resultProduct = await ProductProvider.getById(item.product_id, trx, token);

          if (!(resultProduct instanceof Error)) {
            return {
              ...item,
              product: resultProduct
            };
          }else {
            return new Error("Error when getting data!");
          }
        }));

        return {
          ...order,
          productItens: resultProductWithProductDetail
        };
      } else {
        return new Error("Error when getting data!");
      }
    }));

    if (id > 0 && resultsWithProductItem.every((item) => item.id !== id)) {
      const resultById = await Knex(ETableNames.serviceOrders)
        .transacting(trx)
        .select("*")
        .where("id", "=", id)
        .andWhere("user_id", userId)
        .first();


      if (resultById) return [...resultsWithProductItem, resultById];
    }

    return resultsWithProductItem;
  } catch (e) {
    console.error(e);
    return new Error("Error when getting data!");
  }
};
