const env = require('../config/env')
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
  return jwt.sign({ sub: userId }, env.SECRET_JWT, {
    expiresIn: '1h',
  })
}

module.exports = { generateToken }
