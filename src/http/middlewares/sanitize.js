function sanitize(req, _res, next) {
  const unSanitizedBody = req.body
  const unSanitizedQuery = req.query
  const unSanitizedParams = req.params

  const unSanitizedBodyString = JSON.stringify(unSanitizedBody)
  const unSanitizedQueryString = JSON.stringify(unSanitizedQuery)
  const unSanitizedParamsString = JSON.stringify(unSanitizedParams)

  // < > ; = ( ) \
  const regex = /<[^>]*>|[;]|[=()\\']/g

  const sanitizedBody = unSanitizedBodyString.replace(regex, '')
  const sanitizedQuery = unSanitizedQueryString.replace(regex, '')
  const sanitizedParams = unSanitizedParamsString.replace(regex, '')

  req.body = JSON.parse(sanitizedBody)
  req.query = JSON.parse(sanitizedQuery)
  req.params = JSON.parse(sanitizedParams)

  return next()
}

module.exports = { sanitize }
