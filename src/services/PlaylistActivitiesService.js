import pool from './pool.js';
import generateId from '../utils/nanoid.js';

class PlaylistActivitiesService {
  async addActivity({ playlistId, songId, userId, action }) {
    const id = generateId('activity');

    const query = {
      text: `
        INSERT INTO playlist_song_activities
        (id, playlist_id, song_id, user_id, action)
        VALUES ($1, $2, $3, $4, $5)
      `,
      values: [id, playlistId, songId, userId, action],
    };

    await pool.query(query);
  }

  async getActivitiesByPlaylistId(playlistId) {
    const query = {
      text: `
        SELECT
          users.username,
          songs.title,
          playlist_song_activities.action,
          playlist_song_activities.time
        FROM playlist_song_activities
        JOIN users ON users.id = playlist_song_activities.user_id
        JOIN songs ON songs.id = playlist_song_activities.song_id
        WHERE playlist_song_activities.playlist_id = $1
        ORDER BY playlist_song_activities.time ASC
      `,
      values: [playlistId],
    };

    const result = await pool.query(query);
    return result.rows;
  }
}

export default PlaylistActivitiesService;
