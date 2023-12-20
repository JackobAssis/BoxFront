/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('pedidos', (table) => {
    table.increments('id')
    table.text('observacao')
    table.integer('valor_total')

    table.integer('cliente_id').references('clientes.id').onDelete('CASCADE')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('pedidos')
}
