import Joi from 'joi';

export const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).trim().required(),
  password: Joi.string().required(),
  fullname: Joi.string().max(100).trim().required(),
});
