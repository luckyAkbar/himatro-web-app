const chalk = require('chalk');

const incomingRequestLogger = (req, res, next) => {
  const time = Date()
  console.log(chalk.bold('INCOMING REQUEST'))
  console.log(req.protocol, req.method, req.originalUrl, time.toString().slice(0, 33), req.body, req.params, req.query)
  console.log(chalk.bold('END'))
  next()
}

module.exports = { incomingRequestLogger }
