const { statusCode } = require('../../config/statusCode/index.js')
const { database } = require('../../infra/database/index.js')

async function listClients(_, res) {
  const clients = await database('clientes').select('*').orderBy('id')
  return res.status(statusCode.OK).json(clients)
}

module.exports = { listClients }
