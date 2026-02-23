// src/services/AlbumsService.js
import pool from './pool.js';
import generateId from '../utils/nanoid.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import InvariantError from '../exceptions/InvariantError.js';

class AlbumsService {
  async addAlbum({ name, year }) {
    const id = generateId('album');

    const query = {
      text: `
        INSERT INTO albums (id, name, year)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      values: [id, name, year],
    };

    const result = await pool.query(query);
    return result.rows[0].id;
  }

  async getAlbumById(id) {
    const query = {
      text: `
        SELECT
          albums.id,
          albums.name,
          albums.year,
          albums.cover_url,
          songs.id AS song_id,
          songs.title,
          songs.performer
        FROM albums
        LEFT JOIN songs
          ON songs.album_id = albums.id
        WHERE albums.id = $1
      `,
      values: [id],
    };

    const result = await pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      year: result.rows[0].year,
      coverUrl: result.rows[0].cover_url || null,
      songs: result.rows
        .filter((row) => row.song_id)
        .map((row) => ({
          id: row.song_id,
          title: row.title,
          performer: row.performer,
        })),
    };

    return album;
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: `
        UPDATE albums
        SET name = $1, year = $2
        WHERE id = $3
        RETURNING id
      `,
      values: [name, year, id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: `
        DELETE FROM albums
        WHERE id = $1
        RETURNING id
      `,
      values: [id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async addAlbumCover(id, filename) {
    const query = {
      text: `
        UPDATE albums
        SET cover_url = $1
        WHERE id = $2
        RETURNING id
      `,
      values: [filename, id],
    };

    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Gagal mengunggah cover. Id tidak ditemukan');
    }
  }

  async likeAlbum(albumId, userId) {
    await this.getAlbumById(albumId);

    const id = generateId('like');

    try {
      await pool.query({
        text: `
          INSERT INTO user_album_likes (id, user_id, album_id)
          VALUES ($1, $2, $3)
        `,
        values: [id, userId, albumId],
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new InvariantError('Anda sudah menyukai album ini');
      }
      throw error;
    }
  }

  async unlikeAlbum(albumId, userId) {
    const result = await pool.query({
      text: `
        DELETE FROM user_album_likes
        WHERE album_id = $1 AND user_id = $2
        RETURNING id
      `,
      values: [albumId, userId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Like tidak ditemukan');
    }
  }

  async getAlbumLikes(albumId) {
    await this.getAlbumById(albumId);

    const result = await pool.query({
      text: `
        SELECT COUNT(*) AS likes
        FROM user_album_likes
        WHERE album_id = $1
      `,
      values: [albumId],
    });

    return Number(result.rows[0].likes);
  }
}

export default AlbumsService;