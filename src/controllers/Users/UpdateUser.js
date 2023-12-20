const bcrypt = require('bcrypt')
const { database } = require('../../infra/database/index')
const { statusCode } = require('../../config/statusCode/index')
const { z } = require('zod')

const updateUserBodySchema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
  senha: z.string().min(3),
})

async function updateUser(req, res) {
  const { id } = req.user
  const { email, nome, senha } = updateUserBodySchema.parse(req.body)

  const userWithSameEmail = await database('usuarios').where({ email }).first()
  if (userWithSameEmail && userWithSameEmail.id !== id) {
    return res
      .status(statusCode.Unauthorized)
      .json({ message: 'This emails already registered' })
  }

  const userExists = await database('usuarios').where({ id }).first()
  if (!userExists) {
    return res.status(statusCode.BadRequest).json({ error: 'User not found' })
  }

  const encryptedPassword = await bcrypt.hash(senha, 10)
  await database('usuarios')
    .where({ id })
    .update({ nome, email, senha: encryptedPassword })

  return res.status(statusCode.OK).json({
    message: 'User updated',
  })
}

module.exports = { updateUser }
