import * as create from "./create";
import * as updateById from "./updateById";
import * as getByProductId from "./getByProductId";

export const StockProvider = {
  ...create,
  ...updateById,
  ...getByProductId
};
