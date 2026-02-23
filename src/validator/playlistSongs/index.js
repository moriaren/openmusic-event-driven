import InvariantError from '../../exceptions/InvariantError.js';
import { PlaylistSongPayloadSchema } from './schema.js';

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const { error } = PlaylistSongPayloadSchema.validate(payload);
    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default PlaylistSongsValidator;
