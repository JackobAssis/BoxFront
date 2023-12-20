const { statusCode } = require('../../config/statusCode')
const { database } = require('../../infra/database/index')

async function listCategories(req, res) {
  const categories = await database('categorias')
  return res.status(statusCode.OK).json(categories)
}

module.exports = { listCategories }
