const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create the connection pool. This is a singleton and should not be closed.
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

// Add a connection test to ensure the pool is working
pool.query('SELECT NOW()')
  .then(res => console.log('Database connection pool is ready'))
  .catch(err => console.error('Database connection failed', err));

module.exports = {
  pool
};
