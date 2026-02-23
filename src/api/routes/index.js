import express from 'express';
import usersRoutes from './users.js';
import authenticationsRoutes from './authentications.js';
import albumsRoutes from './albums.js';
import songsRoutes from './songs.js';
import playlistsRoutes from './playlists.js';
import collaborationsRoutes from './collaborations.js';
import exportsRoutes from './exports.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

router.use('/users', usersRoutes);
router.use('/authentications', authenticationsRoutes);
router.use('/albums', albumsRoutes);
router.use('/songs', songsRoutes);
router.use('/playlists', playlistsRoutes);
router.use('/collaborations', collaborationsRoutes);
router.use(exportsRoutes);

export default router;
