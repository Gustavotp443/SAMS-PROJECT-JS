import * as create from "./create";
import * as updateByProductId from "./updateByProductId";
import * as getByProductId from "./getByProductId";

export const StockProvider = {
  ...create,
  ...updateByProductId,
  ...getByProductId
};
