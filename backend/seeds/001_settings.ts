import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  await knex('settings').del();

  await knex('settings').insert([
    { key: 'name', value: 'Vanguard — Alojamento em Cabanas de Tavira' },
    { key: 'tagline', value: 'Dormir com a história, acordar com a natureza.' },
    { key: 'address', value: 'Beco Vasco da Gama, nº 1, 8800-595 Cabanas de Tavira' },
    { key: 'price_per_night', value: '350' },
    { key: 'price_note', value: 'A confirmar — preço indicativo para T4 completo' },
    { key: 'typology', value: 'T4 — 4 quartos (duplos e simples), todos com casa de banho privativa' },
    { key: 'typology_note', value: 'Distribuição exata de quartos duplos/simples a confirmar' },
    { key: 'email', value: 'info@vanguard-cabanas.pt' },
    { key: 'phone', value: '+351 000 000 000' },
    { key: 'coordinates_lat', value: '37.1275' },
    { key: 'coordinates_lng', value: '-7.5983' },
  ]);
}
