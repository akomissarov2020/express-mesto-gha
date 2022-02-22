class Error401 extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error401';
    this.statusCode = 401;
  }
}

module.exports = Error401;
