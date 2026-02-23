import express from 'express';
import PlaylistsHandler from '../handlers/PlaylistsHandler.js';
import authenticateToken from '../middlewares/authentications.js';

const router = express.Router();

router.post('/export/playlists/:playlistId', authenticateToken, PlaylistsHandler.postExportPlaylistHandler);

export default router;