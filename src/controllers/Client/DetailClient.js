const { z } = require('zod')
const { statusCode } = require('../../config/statusCode/index')
const { database } = require('../../infra/database/index')

const detailClientParamsSchema = z.object({
  id: z.coerce.number(),
})

async function detailClient(req, res) {
  const { id } = detailClientParamsSchema.parse(req.params)

  const client = await database('clientes').where({ id }).first()

  if (!client) {
    return res
      .status(statusCode.BadRequest)
      .json({ message: 'Client not found!' })
  }

  return res.status(statusCode.OK).json(client)
}

module.exports = { detailClient }
