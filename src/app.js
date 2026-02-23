import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import routes from './api/routes/index.js';
import errorHandler from './api/middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads HARUS sebelum routes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(routes);

app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: 'Route tidak ditemukan',
  });
});

app.use(errorHandler);

export default app;