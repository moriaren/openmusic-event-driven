import Joi from 'joi';

export const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});
