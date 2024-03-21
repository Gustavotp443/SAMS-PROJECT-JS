import * as create from "./create";
import * as getAll from "./getAll";
import * as updateById from "./updateById";
import * as getById from "./getById";
import * as deleteById from "./deleteById";
export const VehiclesController = {
  ...create,
  ...getAll,
  ...updateById,
  ...getById,
  ...deleteById
};
