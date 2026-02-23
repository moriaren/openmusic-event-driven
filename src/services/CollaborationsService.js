import pkg from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../exceptions/InvariantError.js';
import NotFoundError from '../exceptions/NotFoundError.js';

const { Pool } = pkg;

class CollaborationsService {
  constructor() {
    this._pool = new Pool();
  }

  // ==============================
  // ADD COLLABORATION
  // ==============================
  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: `
        INSERT INTO collaborations(id, playlist_id, user_id)
        VALUES($1, $2, $3)
        RETURNING id
      `,
      values: [id, playlistId, userId],
    };

    try {
      const result = await this._pool.query(query);
      return result.rows[0].id;
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
  }

  // ==============================
  // DELETE COLLABORATION
  // ==============================
  async deleteCollaboration(playlistId, userId) {
    const result = await this._pool.query({
      text: `
        DELETE FROM collaborations
        WHERE playlist_id = $1 AND user_id = $2
        RETURNING id
      `,
      values: [playlistId, userId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Kolaborasi gagal dihapus. Id tidak ditemukan');
    }
  }

  // ==============================
  // VERIFY USER EXIST
  // ==============================
  async verifyUserExist(userId) {
    const result = await this._pool.query({
      text: 'SELECT id FROM users WHERE id = $1',
      values: [userId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }
}

export default CollaborationsService;
