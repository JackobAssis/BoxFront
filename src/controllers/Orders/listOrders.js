const { statusCode } = require('../../config/statusCode/index')
const { database } = require('../../infra/database/index')

async function listOrders(req, res) {
  const { cliente_id } = req.query

  let query = database('pedidos as p')
    .select('p.*', 'pp')
    .join('pedido_produtos as pp', 'p.id', '=', 'pp.pedido_id')
    .orderBy('p.id')

  if (cliente_id) {
    query = query.where('cliente_id', cliente_id)
  }

  const orders = await query
  const orderIds = orders.map((order) => order.id)

  const pedido_produtos = await database('pedido_produtos')
    .whereIn('pedido_id', orderIds)
    .select('*')

  const formattedOrders = orders.map((order) => {
    const produtos = pedido_produtos.filter(
      (pedido_produto) => pedido_produto.pedido_id === order.id,
    )

    return {
      pedido: {
        id: order.id,
        valor_total: order.valor_total,
        observacao: order.observacao,
        cliente_id: order.cliente_id,
      },
      pedido_produtos: produtos.map((produto) => ({
        id: produto.id,
        quantidade_produto: produto.quantidade_produto,
        valor_produto: produto.valor_produto,
        produto_id: produto.produto_id,
        pedido_id: produto.pedido_id,
      })),
    }
  })

  return res.status(statusCode.OK).json(formattedOrders)
}

module.exports = { listOrders }
