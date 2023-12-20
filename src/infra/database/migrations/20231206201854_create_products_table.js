/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('produtos', (table) => {
    table.increments('id')
    table.text('descricao')
    table.text('quantidade_estoque')
    table.integer('valor')
    table.integer('categoria_id').references('categorias.id').notNullable()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('produtos')
}
