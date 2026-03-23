import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blackouts', (table) => {
    table.increments('id').primary();
    table.date('date_from').notNullable().index();
    table.date('date_to').notNullable().index();
    table.string('reason', 500).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('blackouts');
}
