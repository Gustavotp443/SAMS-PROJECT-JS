import * as kn from "knex";
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IProductItens } from "../../models";

interface IProductQuantity {
  product_id: number;
  quantity: number;
}
export const create = async (
  serviceOrderId: number,
  productQuantity: IProductQuantity[],
  trx: kn.Knex.Transaction
): Promise<IProductItens[] | Error> => {
  try {
    const resultProductItens = await Promise.all(
      productQuantity.map(async (productForm) => {
        const { product_id, quantity } = productForm;

        const [result] = await Knex(ETableNames.productItens)
          .transacting(trx)
          .insert({ service_order_id: serviceOrderId, product_id, quantity })
          .returning("*");

        if (typeof result === "object") {
          return result;
        }
      })
    );

    return resultProductItens;
  } catch (e) {
    console.error("Error when registering data:", e);
    throw new Error("Error when registering data");
  }
};
