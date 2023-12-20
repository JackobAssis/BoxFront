const { statusCode } = require('../../config/statusCode')
const { database } = require('../../infra/database/index')

async function detailUser(req, res) {
  const { id } = req.user

  const { senha: _, ...user } = await database('usuarios')
    .where({ id })
    .returning('*')
    .first()

  return res.status(statusCode.OK).json(user)
}

module.exports = { detailUser }
