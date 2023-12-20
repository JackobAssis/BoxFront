const { z } = require('zod')
const { statusCode } = require('../../config/statusCode/index')
const { database } = require('../../infra/database/index')

const detailProductParamsSchema = z.object({
  id: z.coerce.number(),
})

async function detailProduct(req, res) {
  const { id } = detailProductParamsSchema.parse(req.params)

  const product = await await database('produtos as p')
    .where('p.id', id)
    .select(
      'p.id',
      'p.descricao as produto_descricao',
      'p.quantidade_estoque',
      'p.valor',
      'p.categoria_id',
      'c.descricao as categoria_descricao',
    )
    .join('categorias as c', 'c.id', 'p.categoria_id')
    .first()

  if (!product) {
    return res
      .status(statusCode.BadRequest)
      .json({ message: 'Product not found' })
  }

  return res.status(statusCode.OK).json(product)
}

module.exports = { detailProduct }
