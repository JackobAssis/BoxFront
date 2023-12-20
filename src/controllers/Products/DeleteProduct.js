const { z } = require('zod')
const { statusCode } = require('../../config/statusCode')
const { database } = require('../../infra/database')

const deleteProductParamsSchema = z.object({
  id: z.coerce.number(),
})

async function deleteProduct(req, res) {
  const { id } = deleteProductParamsSchema.parse(req.params)

  const existOrder = await database('pedido_produtos')
    .where({ produto_id: id })
    .first()

  if (existOrder) {
    return res.status(statusCode.BadRequest).json({
      message:
        'Product cannot be delete, because there are requests that reference them',
    })
  }

  await database('produtos').del().where({ id })
  return res.status(statusCode.NoContent).end()
}

module.exports = { deleteProduct }
