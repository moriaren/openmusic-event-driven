import Joi from 'joi';

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const AddSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const DeleteSongFromPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

export {
  PlaylistPayloadSchema,
  AddSongToPlaylistPayloadSchema,
  DeleteSongFromPlaylistPayloadSchema,
};
