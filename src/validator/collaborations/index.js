import InvariantError from '../../exceptions/InvariantError.js';
import { CollaborationPayloadSchema } from './schema.js';

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const { error } = CollaborationPayloadSchema.validate(payload);

    if (error) {
      throw new InvariantError(error.message);
    }
  },
};

export default CollaborationsValidator;
