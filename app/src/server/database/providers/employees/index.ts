import * as create from "./create";
import * as getAll from "./getAll";
import * as updateById from "./updateById";
import * as getById from "./getById";
import * as deleteById from "./deleteById";
import * as count from "./count";
export const EmployeesProvider = {
  ...create,
  ...getAll,
  ...updateById,
  ...getById,
  ...deleteById,
  ...count
};
