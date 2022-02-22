class WrongCredsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'WrongCredsError';
    this.statusCode = 406;
  }
}

module.exports = WrongCredsError;
