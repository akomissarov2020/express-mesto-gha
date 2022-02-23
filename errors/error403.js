class Error403 extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error403';
    this.statusCode = 403;
  }
}

module.exports = Error403;
