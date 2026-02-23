import express from 'express';
import PlaylistsHandler from '../handlers/PlaylistsHandler.js';
import authenticateToken from '../middlewares/authentications.js';

const router = express.Router();

// ===============================
// Playlist CRUD
// ===============================
router.post('/', authenticateToken, PlaylistsHandler.postPlaylistHandler);
router.get('/', authenticateToken, PlaylistsHandler.getPlaylistsHandler);

// ===============================
// Playlist Songs & Activities
// ===============================
router.post('/:id/songs', authenticateToken, PlaylistsHandler.postSongToPlaylistHandler);
router.get('/:id/songs', authenticateToken, PlaylistsHandler.getPlaylistSongsHandler);
router.get('/:id/activities', authenticateToken, PlaylistsHandler.getPlaylistActivitiesHandler);
router.delete('/:id/songs', authenticateToken, PlaylistsHandler.deleteSongFromPlaylistHandler);

// DELETE playlist HARUS PALING BAWAH
router.delete('/:id', authenticateToken, PlaylistsHandler.deletePlaylistHandler);


export default router;
