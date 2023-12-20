const { statusCode } = require('../../config/statusCode/index.js')
const { database } = require('../../infra//database/index.js')
const bcrypt = require('bcrypt')
const { z } = require('zod')

const createUserBodySchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(3),
})

async function createUser({ body }, res) {
  const { nome, email, senha } = createUserBodySchema.parse(body)

  const userAlreadyExists = await database('usuarios').where({ email }).first()

  if (userAlreadyExists) {
    return res.status(statusCode.BadRequest).json({
      message: 'User already existes with same email',
    })
  }

  const hashedSenha = await bcrypt.hash(senha, 10)
  const user = await database('usuarios')
    .insert({
      nome,
      email,
      senha: hashedSenha,
    })
    .returning()

  const userData = { id: user.id, nome, email }

  return res
    .status(statusCode.Created)
    .json({ message: 'Usuário cadastrado com sucesso!', user: userData })
}

module.exports = { createUser }
