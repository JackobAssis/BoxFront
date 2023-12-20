const jwt = require('jsonwebtoken')
const { statusCode } = require('../../config/statusCode')

async function validateToken(req, res, next) {
  try {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(statusCode.Unauthorized).json({
        message: 'For access this resource one valid token can be provided',
      })
    }

    const token = authorization.split(' ')[1]

    const { sub } = jwt.verify(token, process.env.SECRET_JWT)
    req.user = { id: sub }

    next()
  } catch (err) {
    console.log(err)
    return res.status(statusCode.Forbidden).json({
      message: 'Invalid token',
    })
  }
}

module.exports = { validateToken }
