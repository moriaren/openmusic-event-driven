import InvariantError from '../../exceptions/InvariantError.js';
import {
  PlaylistPayloadSchema,
  AddSongToPlaylistPayloadSchema,
  DeleteSongFromPlaylistPayloadSchema,
} from './schema.js';

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  validateAddSongToPlaylistPayload: (payload) => {
    const { error } = AddSongToPlaylistPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },

  validateDeleteSongFromPlaylistPayload: (payload) => {
    const { error } = DeleteSongFromPlaylistPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default PlaylistsValidator;
