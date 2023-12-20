const { database } = require('../../infra/database/index')
const { statusCode } = require('../../config/statusCode')
const { z } = require('zod')

const registerClientBodySchema = z.object({
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

async function registerClient(req, res) {
  const { email, cpf, bairro, cep, cidade, estado, nome, numero, rua } =
    registerClientBodySchema.parse(req.body)

  const verifyEmailOrCpf = await database('clientes')
    .where(function () {
      this.where({ email }).orWhere({ cpf })
    })
    .first()

  if (verifyEmailOrCpf) {
    return res
      .status(statusCode.BadRequest)
      .json({ message: 'E-mail or cpf unavailable' })
  }

  const [client] = await database('clientes')
    .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado })
    .returning('*')

  return res.status(statusCode.Created).json(client)
}

module.exports = { registerClient }
