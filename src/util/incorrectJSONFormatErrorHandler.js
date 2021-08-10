const incorrectJSONFormatErrorHandler = (err, req, res, next) => {
  if (err) {
    res.status(400).send({ error: "Data must sent in correct JSON format"})
  } else {
    next()
  }
}

module.exports = { incorrectJSONFormatErrorHandler }
