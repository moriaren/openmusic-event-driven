import express from 'express';
import AlbumsHandler from '../handlers/AlbumsHandler.js';
import authentication from '../middlewares/authentications.js';
import upload from '../middlewares/uploads.js';

const router = express.Router();

router.post('/', AlbumsHandler.postAlbumHandler);
router.post('/:id/covers',upload.single('cover'), AlbumsHandler.postAlbumCoverHandler);
router.get('/:id', AlbumsHandler.getAlbumByIdHandler);
router.put('/:id', AlbumsHandler.putAlbumByIdHandler);
router.delete('/:id', AlbumsHandler.deleteAlbumByIdHandler);

router.post('/:id/likes', authentication, AlbumsHandler.postAlbumLikeHandler);
router.delete('/:id/likes', authentication, AlbumsHandler.deleteAlbumLikeHandler);
router.get('/:id/likes', AlbumsHandler.getAlbumLikesHandler);


export default router;
