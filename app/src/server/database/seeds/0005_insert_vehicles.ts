import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.vehicles).count<
    [{ count: number }]
  >("* as count");

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const vehiclesToInsert = vehiclesBase;
  await knex(ETableNames.vehicles).insert(vehiclesToInsert);
};

const vehiclesBase = [
  {
    id: 1,
    client_id: 1,
    make: "Renault",
    model: "Kwid",
    year: 2024,
    license_plate: "ZZ1111"
  }
];
