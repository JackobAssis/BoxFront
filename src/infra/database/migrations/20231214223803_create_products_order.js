/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('pedido_produtos', (table) => {
    table.increments('id')
    table.integer('quantidade_produto')
    table.integer('valor_produto')

    table.integer('pedido_id').references('pedidos.id').onDelete('CASCADE')
    table.integer('produto_id').references('produtos.id')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('pedido_produtos')
}
