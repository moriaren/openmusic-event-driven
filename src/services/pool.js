import pkg from 'pg';
const { Pool } = pkg;

if (!process.env.PGPASSWORD) {
  throw new Error('PGPASSWORD tidak ditemukan di environment variable');
}

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: String(process.env.PGPASSWORD),
  database: process.env.PGDATABASE,
});

export default pool;