const incomingRequestLogger = (req, res, next) => {
  const time = Date()
  console.log(req.protocol, req.method, req.originalUrl, time.toString().slice(0, 33), req.body, req.params, req.query)
  next()
}

module.exports = { incomingRequestLogger }