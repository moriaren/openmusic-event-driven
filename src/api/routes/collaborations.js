import express from 'express';
import CollaborationsHandler from '../handlers/CollaborationsHandler.js';
import CollaborationsService from '../../services/CollaborationsService.js';
import PlaylistsService from '../../services/PlaylistsService.js';
import CollaborationsValidator from '../../validator/collaborations/index.js';
import authentication from '../middlewares/authentications.js';

const router = express.Router();

const collaborationsService = new CollaborationsService();
const playlistsService = new PlaylistsService();

const handler = new CollaborationsHandler(
  collaborationsService,
  playlistsService,
  CollaborationsValidator
);

router.post('/', authentication, handler.postCollaborationHandler);
router.delete('/', authentication, handler.deleteCollaborationHandler);

export default router;
