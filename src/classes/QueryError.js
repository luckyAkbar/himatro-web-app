class QueryError extends Error {
  constructor(errorMessage) {
    super(errorMessage);
  }
}

module.exports = { QueryError };
