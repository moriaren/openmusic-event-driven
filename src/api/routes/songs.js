import express from 'express';
import SongsHandler from '../handlers/SongsHandler.js';

const router = express.Router();

router.post('/', SongsHandler.postSongHandler);
router.get('/', SongsHandler.getSongsHandler);
router.get('/:id', SongsHandler.getSongByIdHandler);
router.put('/:id', SongsHandler.putSongByIdHandler);
router.delete('/:id', SongsHandler.deleteSongByIdHandler);

export default router;
