import pkg from 'pg';
import InvariantError from '../exceptions/InvariantError.js';

const { Pool } = pkg;

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  // ===============================
  // ADD REFRESH TOKEN
  // ===============================
  async addRefreshToken(token) {
    const query = {
      text: `
        INSERT INTO authentications (token)
        VALUES ($1)
      `,
      values: [token],
    };

    await this._pool.query(query);
  }

  // ===============================
  // VERIFY REFRESH TOKEN
  // ===============================
  async verifyRefreshToken(token) {
    const query = {
      text: `
        SELECT token
        FROM authentications
        WHERE token = $1
      `,
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  // ===============================
  // DELETE REFRESH TOKEN
  // ===============================
  async deleteRefreshToken(token) {
    const query = {
      text: `
        DELETE FROM authentications
        WHERE token = $1
        RETURNING token
      `,
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }
}

export default AuthenticationsService;
