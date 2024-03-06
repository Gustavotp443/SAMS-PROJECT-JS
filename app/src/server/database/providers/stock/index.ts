import * as create from "./create";
import * as updateById from "./updateById";
import * as getById from "./getById";

export const StockProvider = {
  ...create,
  ...updateById,
  ...getById
};
