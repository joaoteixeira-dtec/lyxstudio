import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  await knex('admins').del();

  const hash = await bcrypt.hash('admin123', 12);

  await knex('admins').insert([
    {
      email: 'admin@vanguard.pt',
      password_hash: hash,
    },
  ]);
}
