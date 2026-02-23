import AuthenticationsValidator from '../../validator/authentications/index.js';

class AuthenticationsHandler {
  constructor(usersService, authenticationsService, tokenManager) {
    this._usersService = usersService;
    this._authenticationsService = authenticationsService;
    this._tokenManager = tokenManager;
    this._validator = AuthenticationsValidator;

    this.postAuthenticationHandler =
      this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler =
      this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  // ===============================
  // LOGIN
  // ===============================
  async postAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePostAuthenticationPayload(req.body);

      const { username, password } = req.body;

      const userId =
        await this._usersService.verifyUserCredential(
          username,
          password
        );

      const accessToken =
        this._tokenManager.generateAccessToken({
          userId,
        });

      const refreshToken =
        this._tokenManager.generateRefreshToken({
          userId,
        });

      await this._authenticationsService.addRefreshToken(
        refreshToken
      );

      return res.status(201).json({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===============================
  // REFRESH TOKEN
  // ===============================
  async putAuthenticationHandler(req, res, next) {
    try {
      this._validator.validatePutAuthenticationPayload(
        req.body
      );

      const { refreshToken } = req.body;

      await this._authenticationsService.verifyRefreshToken(
        refreshToken
      );

      const { userId } =
        this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken =
        this._tokenManager.generateAccessToken({
          userId,
        });

      return res.status(200).json({
        status: 'success',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  // ===============================
  // LOGOUT
  // ===============================
  async deleteAuthenticationHandler(req, res, next) {
    try {
      this._validator.validateDeleteAuthenticationPayload(
        req.body
      );

      const { refreshToken } = req.body;

      await this._authenticationsService.verifyRefreshToken(
        refreshToken
      );

      await this._authenticationsService.deleteRefreshToken(
        refreshToken
      );

      return res.status(200).json({
        status: 'success',
        message: 'Refresh token berhasil dihapus',
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default AuthenticationsHandler;
