const knex = require('knex')
const knexfile = require('../../../knexfile')
const { database_connection } = require('../../config/env/index')

const database = knex(knexfile.development)
console.log(`Database server running on "${database_connection}"`)

module.exports = { database }
