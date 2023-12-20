require('dotenv').config()
const path = require('path')
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: 5432,
      password: process.env.DATABASE_PASSWORD,
      user: process.env.DATABASE_USER,
      database: 'pdv',
      ssl: true,
    },

    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'src', 'infra', 'database', 'migrations'),
    },

    seeds: {
      directory: path.join(__dirname, 'src', 'infra', 'database', 'seeds'),
    },
  },
}
