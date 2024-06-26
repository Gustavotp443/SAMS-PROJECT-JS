import * as create from "./create";
import * as getAll from "./getAll";
import * as updateById from "./updateById";
import * as deleteByProductId from "./deleteByProductId";
// import * as getById from "./getById";
// import * as deleteById from "./deleteById";

export const ProductItensProvider = {
  ...create, //add all exports with spread
  ...getAll,
  ...updateById,
  ...deleteByProductId
  //   ...getById,
  //   ...deleteById,
};
