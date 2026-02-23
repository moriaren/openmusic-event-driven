import pkg from 'pg';
import { nanoid } from 'nanoid';
import InvariantError from '../exceptions/InvariantError.js';
import NotFoundError from '../exceptions/NotFoundError.js';
import AuthorizationError from '../exceptions/AuthorizationError.js';

const { Pool } = pkg;

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  // ===============================
  // CREATE PLAYLIST
  // ===============================
  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const result = await this._pool.query({
      text: `
        INSERT INTO playlists (id, name, owner)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
      values: [id, name, owner],
    });

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // ===============================
  // GET PLAYLISTS
  // ===============================
  async getPlaylists(userId) {
    const result = await this._pool.query({
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        LEFT JOIN collaborations
          ON collaborations.playlist_id = playlists.id
        JOIN users ON users.id = playlists.owner
        WHERE playlists.owner = $1
           OR collaborations.user_id = $1
        GROUP BY playlists.id, playlists.name, users.username
        ORDER BY playlists.name
      `,
      values: [userId],
    });

    return result.rows;
  }

  // ===============================
  // VERIFY OWNER
  // ===============================
  async verifyPlaylistOwner(playlistId, owner) {
    const result = await this._pool.query({
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError(
        'Anda tidak berhak mengakses playlist ini'
      );
    }
  }

  // ===============================
  // VERIFY ACCESS (FINAL FIX)
  // ===============================
  async verifyPlaylistAccess(playlistId, userId) {
    // cek playlist ada atau tidak
    const playlist = await this._pool.query({
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [playlistId],
    });

    if (!playlist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    // kalau owner langsung lolos
    if (playlist.rows[0].owner === userId) {
      return;
    }

    // cek collaboration
    const collaboration = await this._pool.query({
      text: `
        SELECT id FROM collaborations
        WHERE playlist_id = $1 AND user_id = $2
      `,
      values: [playlistId, userId],
    });

    if (!collaboration.rowCount) {
      throw new AuthorizationError(
        'Anda tidak berhak mengakses playlist ini'
      );
    }
  }

  // ===============================
  // DELETE PLAYLIST
  // ===============================
  async deletePlaylist(playlistId) {
    const result = await this._pool.query({
      text: `
        DELETE FROM playlists
        WHERE id = $1
        RETURNING id
      `,
      values: [playlistId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  // ===============================
  // ADD SONG
  // ===============================
  async addSongToPlaylist(playlistId, songId) {
    const songCheck = await this._pool.query({
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [songId],
    });

    if (!songCheck.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    const id = `playlist-song-${nanoid(16)}`;

    await this._pool.query({
      text: `
        INSERT INTO playlist_songs (id, playlist_id, song_id)
        VALUES ($1, $2, $3)
      `,
      values: [id, playlistId, songId],
    });
  }

  // ===============================
  // GET SONGS
  // ===============================
  async getSongsFromPlaylist(playlistId) {
    const playlist = await this._pool.query({
      text: `
        SELECT playlists.id, playlists.name, users.username
        FROM playlists
        JOIN users ON users.id = playlists.owner
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    });

    if (!playlist.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const songs = await this._pool.query({
      text: `
        SELECT songs.id, songs.title, songs.performer
        FROM songs
        JOIN playlist_songs
          ON playlist_songs.song_id = songs.id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    });

    return {
      ...playlist.rows[0],
      songs: songs.rows,
    };
  }

  // ===============================
  // DELETE SONG
  // ===============================
  async deleteSongFromPlaylist(playlistId, songId) {
    const result = await this._pool.query({
      text: `
        DELETE FROM playlist_songs
        WHERE playlist_id = $1 AND song_id = $2
        RETURNING id
      `,
      values: [playlistId, songId],
    });

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }

  // ===============================
  // ADD ACTIVITY
  // ===============================
  async addPlaylistSongActivity({ playlistId, songId, userId, action }) {
    const id = `activity-${nanoid(16)}`;

    await this._pool.query({
      text: `
        INSERT INTO playlist_song_activities
        (id, playlist_id, song_id, user_id, action, time)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
      `,
      values: [id, playlistId, songId, userId, action],
    });
  }

  // ===============================
  // GET ACTIVITIES
  // ===============================
  async getPlaylistActivities(playlistId) {
    const playlistCheck = await this._pool.query({
      text: 'SELECT id FROM playlists WHERE id = $1',
      values: [playlistId],
    });

    if (!playlistCheck.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const result = await this._pool.query({
      text: `
        SELECT users.username, songs.title,
               playlist_song_activities.action,
               playlist_song_activities.time
        FROM playlist_song_activities
        JOIN users ON users.id = playlist_song_activities.user_id
        JOIN songs ON songs.id = playlist_song_activities.song_id
        WHERE playlist_song_activities.playlist_id = $1
        ORDER BY playlist_song_activities.time ASC
      `,
      values: [playlistId],
    });

    return result.rows;
  }

  async getPlaylistExportById(playlistId) {
    const playlistQuery = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const songsQuery = {
      text: `
        SELECT songs.id, songs.title, songs.performer
        FROM songs
        JOIN playlist_songs
        ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    
    const songsResult = await this._pool.query(songsQuery);

    return {
      id: playlistResult.rows[0].id,
      name: playlistResult.rows[0].name,
      songs: songsResult.rows,
    };
  }
}

export default PlaylistsService;
