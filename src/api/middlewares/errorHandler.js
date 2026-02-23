// middlewares/errorHandler.js
import ClientError from '../../exceptions/ClientError.js';

const errorHandler = (err, req, res, _next) => {
  // Error multer file size
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      status: 'fail',
      message: 'Ukuran file terlalu besar. Maksimal 500KB',
    });
  }

  // Error file type
  if (err.message === 'File harus berupa gambar') {
    return res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Error client custom
  if (err instanceof ClientError) {
    return res.status(err.statusCode).json({
      status: 'fail',
      message: err.message,
    });
  }

  // Error server / unknown
  console.error(err);
  return res.status(500).json({
    status: 'error',
    message: 'Terjadi kegagalan pada server kami.',
  });
};

export default errorHandler;