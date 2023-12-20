require('../infra/database/index')
require('express-async-errors')

const express = require('express')

const { PORT } = require('../config/env/index')

const { sanitize } = require('./middlewares/sanitize.js')
const { appRoutes } = require('./routes/index.js')
const { statusCode } = require('../config/statusCode/index.js')
const { ZodError } = require('zod')
const { fromZodError } = require('zod-validation-error')

const app = express()
app.use(express.json())

app.use(sanitize)
app.use(appRoutes)

app.use((error, req, res, next) => {
  if (error instanceof ZodError) {
    const validationError = fromZodError(error)

    return res.status(statusCode.BadRequest).json({
      message: 'Some fields are invalid',
      error: validationError,
    })
  }

  if (error) {
    console.log(error)
    return res.status(statusCode.InternalServerError).json({
      message: 'Internal server error',
    })
  }
})

app.listen(PORT, async () => {
  console.log(`Server running on URL: http://localhost:${PORT}`)
})
