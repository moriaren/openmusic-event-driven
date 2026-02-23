import PlaylistsService from '../../services/PlaylistsService.js';
import PlaylistsValidator from '../../validator/playlists/index.js';
import ExportsValidator from '../../validator/exports/index.js';
import ProducerService from '../../services/ProducerService.js';

class PlaylistsHandler {
  constructor() {
    this._service = new PlaylistsService();
    this._validator = PlaylistsValidator;
    this._exportsValidator = ExportsValidator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    this.postSongToPlaylistHandler = this.postSongToPlaylistHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(req, res, next) {
    try {
      this._validator.validatePlaylistPayload(req.body);

      const { name } = req.body;
      const owner = req.user.id; 

      const playlistId = await this._service.addPlaylist({
        name,
        owner,
      });

      res.status(201).json({
        status: 'success',
        data: { playlistId },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistsHandler(req, res, next) {
    try {
      const playlists = await this._service.getPlaylists(req.user.id);

      const uniquePlaylists = Array.from(new Map(playlists.map(p => [p.id, p])).values());

      res.json({
        status: 'success',
        data: { playlists: uniquePlaylists },
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePlaylistHandler(req, res, next) {
    try {
      const { id } = req.params;

      await this._service.verifyPlaylistOwner(
        id,
        req.user.id
      );

      await this._service.deletePlaylist(id);

      res.json({
        status: 'success',
        message: 'Playlist berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  async postSongToPlaylistHandler(req, res, next) {
    try {
      this._validator.validateAddSongToPlaylistPayload(req.body);

      const { id: playlistId } = req.params;
      const { songId } = req.body;
      const userId = req.user.id;

      await this._service.verifyPlaylistAccess(playlistId, userId);

      await this._service.addSongToPlaylist(playlistId, songId);

      await this._service.addPlaylistSongActivity({
        playlistId,
        songId,
        userId,
        action: 'add',
      });

      res.status(201).json({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistSongsHandler(req, res, next) {
    try {
      const { id: playlistId } = req.params;
      const userId = req.user.id;

      await this._service.verifyPlaylistAccess(playlistId, userId);

      const playlist = await this._service.getSongsFromPlaylist(playlistId);

      res.json({
        status: 'success',
        data: { playlist },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSongFromPlaylistHandler(req, res, next) {
    try {
      this._validator.validateDeleteSongFromPlaylistPayload(
        req.body
      );

      const { id: playlistId } = req.params;
      const { songId } = req.body;
      const userId = req.user.id;

      await this._service.verifyPlaylistAccess(playlistId, userId);

      await this._service.deleteSongFromPlaylist(playlistId, songId);

      await this._service.addPlaylistSongActivity({
        playlistId,
        songId,
        userId,
        action: 'delete',
      });

      res.json({
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPlaylistActivitiesHandler(req, res, next) {
    try {
      const { id: playlistId } = req.params;
      const userId = req.user.id;

      await this._service.verifyPlaylistAccess(playlistId, userId);

      const activities = await this._service.getPlaylistActivities(playlistId);

      res.json({
        status: 'success',
        data: {
          playlistId,
          activities,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async postExportPlaylistHandler(req, res, next) {
    try {
      this._exportsValidator.validateExportPlaylistPayload(req.body);

      const { playlistId } = req.params;
      const { targetEmail } = req.body;
      const { id: userId } = req.user;

      // hanya pemilik playlist
      await this._service.verifyPlaylistOwner(playlistId, userId);

      await ProducerService.sendMessage(
        'export:playlists',
        JSON.stringify({ playlistId, targetEmail })
      );

      res.status(201).json({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlaylistsHandler();
