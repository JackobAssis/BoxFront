const { database } = require('../../infra/database/index')
const { statusCode } = require('../../config/statusCode')
const { z } = require('zod')

const editClientBodySchema = z.object({
  email: z.string().email(),
  cpf: z.string().min(11),
  nome: z.string().min(3),
  cep: z.string().optional().nullable(),
  rua: z.string().optional().nullable(),
  numero: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  estado: z.string().optional().nullable(),
})

const editClientParamsSchema = z.object({
  id: z.coerce.number(),
})

async function editClient(req, res) {
  const { id } = editClientParamsSchema.parse(req.params)
  const { email, cpf, nome, cep, rua, numero, bairro, cidade, estado } =
    editClientBodySchema.parse(req.body)

  const client = await database('clientes').where({ id }).first()
  const verifyEmailOrCpf = await database('clientes')
    .where(function () {
      this.where({ email }).orWhere({ cpf })
    })
    .andWhereNot({ id })
    .first()

  if (!client) {
    return res
      .status(statusCode.BadRequest)
      .json({ message: 'The client is not registered.' })
  }

  if (verifyEmailOrCpf) {
    return res
      .status(statusCode.BadRequest)
      .json({ message: 'The registered email/cpf already exists.' })
  }

  const [updateClients] = await database('clientes')
    .update({ email, cpf, nome, cep, rua, numero, bairro, cidade, estado })
    .where({ id })
    .returning('*')

  return res.status(statusCode.OK).json(updateClients)
}

module.exports = {
  editClient,
}
