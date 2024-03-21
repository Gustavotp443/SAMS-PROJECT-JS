import * as create from "./create";
import * as getById from "./getById";
import * as updateById from "./updateById";
export const AddressProvider = {
  ...create,
  ...getById,
  ...updateById
};
