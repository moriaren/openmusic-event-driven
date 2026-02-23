class ClientError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ClientError;
