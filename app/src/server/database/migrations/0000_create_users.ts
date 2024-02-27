import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";


export async function up(knex: Knex){
  return knex.schema.createTable(ETableNames.users, (table) => {
    table.increments("id").primary(); // INT AUTO_INCREMENT PRIMARY KEY
    table.string("name", 100).checkLength("<=",100).notNullable(); // VARCHAR(100)
    table.string("email", 100).checkLength("<=",100).unique().notNullable(); // VARCHAR(100) UNIQUE
    table.string("password", 100).checkLength("<=",100).notNullable(); // VARCHAR(100)
    table.timestamp("created_at").defaultTo(knex.fn.now()); // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  })
    .then(()=>{
      console.log(`# Created Table ${ETableNames.users}`);
    });
}


export async function down(knex: Knex){
  return knex.schema.dropTable(ETableNames.users).then(()=>{
    console.log(`# Dropped Table ${ETableNames.users}`);
  });
}

