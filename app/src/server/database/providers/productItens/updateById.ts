import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import * as kn from "knex";
interface IProductQuantity {
  product_id: number;
  quantity: number;
}
export const updateById = async (
  serviceOrderId: number,
  productQuantity: IProductQuantity[],
  trx: kn.Knex.Transaction
): Promise<void | Error> => {
  try {
    await Promise.all(
      productQuantity.map(async (productForm) => {
        const { product_id, quantity } = productForm;

        const existingRecord = await Knex(ETableNames.productItens)
          .transacting(trx)
          .where({
            product_id,
            service_order_id: serviceOrderId
          })
          .first();

        if (existingRecord) {
          await Knex(ETableNames.productItens)
            .transacting(trx)
            .update({ quantity })
            .where({
              product_id,
              service_order_id: serviceOrderId
            });
        } else {
          await Knex(ETableNames.productItens).transacting(trx).insert({
            product_id,
            service_order_id: serviceOrderId,
            quantity
          });
        }
      })
    );

    return;
  } catch (e) {
    console.error("Error when registering data:", e);
    throw new Error("Error when registering data");
  }
};
