import { Knex } from "knex";
import { ETableNames } from "../ETableNames";

export const seed = async (knex: Knex) => {
  const [{ count }] = await knex(ETableNames.serviceOrders).count<
    [{ count: number }]
  >("* as count");

  if (!Number.isInteger(count) || Number(count) > 0) return;
  const serviceOrdersToInsert = serviceOrdersBase;
  await knex(ETableNames.serviceOrders).insert(serviceOrdersToInsert);
};

const serviceOrdersBase = [
  {
    id: 1,
    vehicle_id: 1,
    employee_id: 1,
    user_id: 1,
    description: "Necessita de manutenção no motor do veículo."
  }
];
