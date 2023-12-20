const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/generateToken')
const { database } = require('../../infra/database/index')
const { statusCode } = require('../../config/statusCode')
const { z } = require('zod')

const loginUserBodySchema = z.object({
  email: z.string().email(),
  senha: z.string().min(3),
})

async function loginUser(req, res) {
  const { email, senha } = loginUserBodySchema.parse(req.body)

  const user = await database('usuarios').where({ email }).first()
  if (!user) {
    return res
      .status(statusCode.Unauthorized)
      .json({ error: 'Wrong credentials' })
  }

  const passwordCorrect = await bcrypt.compare(senha, user.senha)
  if (!passwordCorrect) {
    return res
      .status(statusCode.Unauthorized)
      .json({ error: 'Wrong credentials' })
  }

  const token = generateToken(user.id)

  return res.status(statusCode.OK).json({ token })
}

module.exports = { loginUser }
