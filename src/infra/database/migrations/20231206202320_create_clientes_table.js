/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('clientes', (table) => {
    table.increments('id')
    table.text('nome')
    table.text('email').unique()
    table.text('cpf').unique()
    table.text('cep').nullable()
    table.text('rua').nullable()
    table.text('numero').nullable()
    table.text('bairro').nullable()
    table.text('cidade').nullable()
    table.text('estado').nullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('clientes')
}
