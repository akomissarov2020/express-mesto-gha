class Error409 extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error409';
    this.statusCode = 409;
  }
}

module.exports = Error409;
