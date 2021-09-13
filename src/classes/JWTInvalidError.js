class JWTInvalidError extends Error {
    constructor (errorMessage) {
      super(errorMessage)
    }
  }
  
  module.exports = { JWTInvalidError }
  