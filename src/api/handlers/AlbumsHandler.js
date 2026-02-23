// src/handlers/AlbumsHandler.js
import AlbumsService from '../../services/AlbumsService.js';
import CacheService from '../../services/CacheService.js';
import AlbumsValidator from '../../validator/albums/index.js';

class AlbumsHandler {
  constructor() {
    this._service = new AlbumsService();
    this._validator = AlbumsValidator;
    this._cacheService = new CacheService();

    // Bind methods
    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.getAlbumLikesHandler = this.getAlbumLikesHandler.bind(this);
    this.postAlbumLikeHandler = this.postAlbumLikeHandler.bind(this);
    this.deleteAlbumLikeHandler = this.deleteAlbumLikeHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
  }

  async postAlbumHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { name, year } = req.body;
      const albumId = await this._service.addAlbum({ name, year });

      res.status(201).json({
        status: 'success',
        data: { albumId },
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlbumByIdHandler(req, res, next) {
  try {
    const { id } = req.params;
    const album = await this._service.getAlbumById(id);

    // generate host dinamis
    if (album.coverUrl) {
      const protocol = req.protocol;
      const host = req.get('host');
      album.coverUrl = `${protocol}://${host}/uploads/${album.coverUrl}`;
    }

    res.json({
      status: 'success',
      data: { album },
    });
  } catch (error) {
    next(error);
  }
}

  async putAlbumByIdHandler(req, res, next) {
    try {
      this._validator.validateAlbumPayload(req.body);
      const { id } = req.params;
      const { name, year } = req.body;

      await this._service.editAlbumById(id, { name, year });

      res.json({
        status: 'success',
        message: 'Album berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAlbumByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._service.deleteAlbumById(id);

      res.json({
        status: 'success',
        message: 'Album berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlbumLikesHandler(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `album_likes:${id}`;

      try {
        const result = await this._cacheService.get(cacheKey);
        res.setHeader('X-Data-Source', 'cache');
        return res.json({
          status: 'success',
          data: { likes: JSON.parse(result) },
        });
      } catch {
        const likes = await this._service.getAlbumLikes(id);
        await this._cacheService.set(cacheKey, JSON.stringify(likes));
        return res.json({
          status: 'success',
          data: { likes },
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async postAlbumLikeHandler(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await this._service.likeAlbum(id, userId);
      await this._cacheService.delete(`album_likes:${id}`);

      res.status(201).json({
        status: 'success',
        message: 'Album berhasil disukai',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAlbumLikeHandler(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      await this._service.unlikeAlbum(id, userId);
      await this._cacheService.delete(`album_likes:${id}`);

      res.json({
        status: 'success',
        message: 'Batal menyukai album',
      });
    } catch (error) {
      next(error);
    }
  }

  async postAlbumCoverHandler(req, res, next) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          status: 'fail',
          message: 'File tidak ditemukan',
        });
      }

      // simpan hanya nama file
      await this._service.addAlbumCover(id, req.file.filename);

      res.status(201).json({
        status: 'success',
        message: 'Cover berhasil diunggah',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AlbumsHandler();