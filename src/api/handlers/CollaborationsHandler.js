class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postCollaborationHandler =
      this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler =
      this.deleteCollaborationHandler.bind(this);
  }

  // ==========================
  // POST /collaborations
  // ==========================
  async postCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);

      const { playlistId, userId } = req.body;
      const { id: credentialId } = req.user; // sesuaikan dengan auth middleware kamu

      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );

      await this._collaborationsService.verifyUserExist(userId);

      const collaborationId =
        await this._collaborationsService.addCollaboration(
          playlistId,
          userId
        );

      res.status(201).json({
        status: 'success',
        data: {
          collaborationId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================
  // DELETE /collaborations
  // ==========================
  async deleteCollaborationHandler(req, res, next) {
    try {
      this._validator.validateCollaborationPayload(req.body);

      const { playlistId, userId } = req.body;
      const { id: credentialId } = req.user;

      await this._playlistsService.verifyPlaylistOwner(
        playlistId,
        credentialId
      );

      await this._collaborationsService.deleteCollaboration(
        playlistId,
        userId
      );

      res.status(200).json({
        status: 'success',
        message: 'Kolaborator berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CollaborationsHandler;
