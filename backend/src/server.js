import app from './app.js';
import { config } from './config/env.js';
import { checkDbConnection } from './config/db.js';

async function bootstrap() {
  console.log('[SYSTEM] Iniciando servidor de Learning Analytics...');
  
  // Intento de conexión con la base de datos
  await checkDbConnection();

  app.listen(config.port, () => {
    console.log(`[HTTP] Servidor ejecutándose en http://localhost:${config.port}`);
    console.log(`[HTTP] API Base: http://localhost:${config.port}/api/v1`);
    console.log(`[HTTP] Health check: http://localhost:${config.port}/api/v1/health`);
  });
}

bootstrap();
