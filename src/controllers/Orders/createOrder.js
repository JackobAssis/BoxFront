const { z } = require('zod')
const { database } = require('../../infra/database')
const { statusCode } = require('../../config/statusCode')

const createOrderBodySchema = z.object({
  cliente_id: z.coerce.number(),
  observacao: z.string().optional(),
  pedido_produtos: z.array(
    z.object({
      produto_id: z.coerce.number(),
      quantidade_produto: z.coerce.number().min(1),
    }),
  ),
})

async function createOrder(req, res) {
  const { cliente_id, observacao, pedido_produtos } =
    createOrderBodySchema.parse(req.body)

  const clientExistes = await database('clientes')
    .where({ id: cliente_id })
    .first()

  if (!clientExistes) {
    return res.status(statusCode.BadRequest).json({
      message: 'Client not found',
    })
  }

  const productsIds = pedido_produtos.map(
    (pedido_produto) => pedido_produto.produto_id,
  )

  const products = await database('produtos').whereIn('id', productsIds)
  const registers = []

  let total = 0

  pedido_produtos.forEach((pedido_produto) => {
    const productOnDatabase = products.find(
      (p) => p.id === pedido_produto.produto_id,
    )

    if (!productOnDatabase) {
      res.status(statusCode.BadRequest).json({
        message: `Product with id ${pedido_produto.produto_id} doesn't existe`,
      })
      return
    }

    const newStock =
      Number(productOnDatabase.quantidade_estoque) -
      pedido_produto.quantidade_produto

    if (newStock < 0) {
      res.status(statusCode.BadRequest).json({
        message: `Product with id ${pedido_produto.produto_id} doesn't have stock`,
      })
      return
    }

    total = total + productOnDatabase.valor * pedido_produto.quantidade_produto

    const updateProductStock = async () => {
      await database('produtos')
        .update('quantidade_estoque', newStock)
        .where({ id: productOnDatabase.id })
    }

    registers.push(updateProductStock)
  })

  const [order] = await database('pedidos')
    .insert({
      cliente_id,
      observacao,
      valor_total: total,
    })
    .returning('*')

  pedido_produtos.forEach((pedido_produto) => {
    const product = products.find((p) => p.id === pedido_produto.produto_id)

    const registerProductOrder = async () => {
      await database('pedido_produtos').insert({
        pedido_id: order.id,
        produto_id: product.id,
        quantidade_produto: pedido_produto.quantidade_produto,
        valor_produto: product.valor,
      })
    }

    registers.push(registerProductOrder)
  })

  await Promise.all(registers.map((r) => r()))

  return res.status(statusCode.Created).json(order)
}

module.exports = { createOrder }
