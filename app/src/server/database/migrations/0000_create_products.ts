import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";


export async function up(knex: Knex){
	return knex.schema.createTable(ETableNames.products, (table) => {
		table.increments("id").primary().notNullable(); // INT AUTO_INCREMENT PRIMARY KEY
		table.integer("user_id").unsigned().notNullable(); // INT
		table.string("name", 100).checkLength("<=",100).notNullable(); // VARCHAR(100)
		table.decimal("price", 10, 2).notNullable(); // DECIMAL(10,2)

		table.foreign("user_id").references("id").inTable(ETableNames.users); //FK
	})
		.then(()=>{
			console.log(`# Created Table ${ETableNames.products}`);
		});
}


export async function down(knex: Knex){
	return knex.schema.dropTable(ETableNames.products).then(()=>{
		console.log(`# Dropped Table ${ETableNames.products}`);
	});
}

