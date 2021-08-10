class AbsentFillerNotRegisteredError extends Error {
  constructor (errorMessage) {
    super(errorMessage)
  }
}

module.exports = { AbsentFillerNotRegisteredError }
