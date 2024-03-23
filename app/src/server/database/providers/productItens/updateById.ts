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
        const { quantity } = productForm;

        const result = await Knex(ETableNames.productItens)
          .transacting(trx)
          .update({ quantity })
          .where("service_order_id", "=", serviceOrderId);

        if (result > 0) return;
        return new Error("Error when updating data!");
      })
    );

    return;
  } catch (e) {
    console.error("Error when registering data:", e);
    throw new Error("Error when registering data");
  }
};
