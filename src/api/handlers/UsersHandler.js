import UsersService from '../../services/UsersService.js';
import UsersValidator from '../../validator/users/index.js';

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      // ✅ VALIDASI WAJIB PALING ATAS
      this._validator.validateUserPayload(req.body);

      const { username, password, fullname } = req.body;

      const userId = await this._service.addUser({
        username,
        password,
        fullname,
      });

      return res.status(201).json({
        status: 'success',
        data: {
          userId,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

const usersService = new UsersService();
export default new UsersHandler(usersService, UsersValidator);
