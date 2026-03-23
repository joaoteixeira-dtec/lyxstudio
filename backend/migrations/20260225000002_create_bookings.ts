import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary();
    table.date('check_in').notNullable().index();
    table.date('check_out').notNullable().index();
    table.integer('guests').unsigned().notNullable().defaultTo(1);
    table.string('name', 200).notNullable();
    table.string('email', 200).notNullable();
    table.string('phone', 30).notNullable();
    table.text('notes').nullable();
    table.enum('status', ['pending', 'confirmed', 'cancelled']).notNullable().defaultTo('pending');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Constraint: check_out > check_in (MySQL 8.0.16+)
  await knex.raw(`
    ALTER TABLE bookings ADD CONSTRAINT chk_dates CHECK (check_out > check_in)
  `).catch(() => {
    // Older MySQL versions may not support CHECK constraints; log and continue
    console.warn('CHECK constraint not supported; skipping chk_dates');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('bookings');
}
