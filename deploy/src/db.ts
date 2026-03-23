import knex from 'knex';
import dotenv from 'dotenv';
import config from '../knexfile';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
const db = knex(config[env] || config.development);

export default db;
