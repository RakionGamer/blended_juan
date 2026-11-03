import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares globales
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API v1
app.use('/api/v1', apiRoutes);

// Manejador centralizado de errores
app.use(errorHandler);

export default app;
