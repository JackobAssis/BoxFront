const { database } = require('../../infra/database/index')
const { statusCode } = require('../../config/statusCode')

async function listProducts(req, res) {
  const { categoria_id } = req.query

  if (categoria_id) {
    const categoriaExists = await database('categorias')
      .where({ id: categoria_id })
      .first()

    if (!categoriaExists) {
      return res.status(statusCode.BadRequest).json({
        message: 'Category not found',
      })
    }
  }

  let products = await database('produtos as p')
    .select(
      'p.id',
      'p.descricao as produto_descricao',
      'p.quantidade_estoque',
      'p.valor',
      'p.categoria_id',
      'c.descricao as categoria_descricao',
    )
    .join('categorias as c', 'c.id', 'p.categoria_id')
    .orderBy('id')

  if (categoria_id) {
    products = products.filter((Element) => {
      return categoria_id.includes(String(Element.categoria_id))
    })
  }

  return res.status(statusCode.OK).json(products)
}

module.exports = {
  listProducts,
}
