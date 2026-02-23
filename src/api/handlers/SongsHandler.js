import autoBind from 'auto-bind';
import SongsService from '../../services/SongsService.js';
import SongsValidator from '../../validator/songs/index.js';

class SongsHandler {
  constructor() {
    this._service = new SongsService();

    autoBind(this);
  }

  async postSongHandler(req, res, next) {
    try {
      SongsValidator.validateSongPayload(req.body);

      const songId = await this._service.addSong(req.body);

      res.status(201).json({
        status: 'success',
        data: { songId },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSongsHandler(req, res, next) {
    try {
      const { title, performer } = req.query;

      const songs = await this._service.getSongs({ title, performer });

      res.json({
        status: 'success',
        data: { songs },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSongByIdHandler(req, res, next) {
    try {
      const { id } = req.params;

      const song = await this._service.getSongById(id);

      res.json({
        status: 'success',
        data: { song },
      });
    } catch (error) {
      next(error);
    }
  }

  async putSongByIdHandler(req, res, next) {
    try {
      SongsValidator.validateSongPayload(req.body);

      const { id } = req.params;

      await this._service.editSongById(id, req.body);

      res.json({
        status: 'success',
        message: 'Song berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteSongByIdHandler(req, res, next) {
    try {
      const { id } = req.params;

      await this._service.deleteSongById(id);

      res.json({
        status: 'success',
        message: 'Song berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SongsHandler();
