import pool from './pool.js';
import generateId from '../utils/nanoid.js';
import NotFoundError from '../exceptions/NotFoundError.js';

class SongsService {
  async addSong({
    title,
    year,
    genre,
    performer,
    duration = null,
    albumId = null,
  }) {
    const id = generateId('song');

    const query = {
      text: `
        INSERT INTO songs (
          id, title, year, genre, performer, duration, album_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  }

  async getSongs({ title = '', performer = '' }) {
    const query = {
      text: `
        SELECT id, title, performer
        FROM songs
        WHERE title ILIKE $1
          AND performer ILIKE $2
      `,
      values: [`%${title}%`, `%${performer}%`],
    };

    const { rows } = await pool.query(query);
    return rows;
  }

  async getSongById(id) {
    const query = {
      text: `
        SELECT
          id,
          title,
          year,
          genre,
          performer,
          duration,
          album_id AS "albumId"
        FROM songs
        WHERE id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSongById(
    id,
    {
      title,
      year,
      genre,
      performer,
      duration = null,
      albumId = null,
    }
  ) {
    const query = {
      text: `
        UPDATE songs
        SET title = $1,
            year = $2,
            genre = $3,
            performer = $4,
            duration = $5,
            album_id = $6
        WHERE id = $7
        RETURNING id
      `,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: `
        DELETE FROM songs
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
  async verifySongExists(id) {
    const result = await pool.query({
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [id],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
  }
}

export default SongsService;
