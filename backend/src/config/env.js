import dotenv from 'dotenv';
dotenv.config();

// Función de limpieza para evitar que se pegue "KEY=valor" dentro del valor
function sanitize(val, defaultVal = '') {
  if (!val) return defaultVal;
  let s = String(val).trim();
  // Si contiene el prefijo "ALGO=", extraer solo lo que está después del "="
  if (s.includes('=')) {
    s = s.split('=').pop().trim();
  }
  // Remover comillas envolventes si las tiene
  return s.replace(/^["']|["']$/g, '');
}

export const config = {
  port: parseInt(sanitize(process.env.PORT, '5050'), 10),
  nodeEnv: sanitize(process.env.NODE_ENV, 'development'),
  jwtSecret: sanitize(process.env.JWT_SECRET, 'super_secret_jwt_key_blended_learning_2026'),
  jwtExpiresIn: '8h',
  db: {
    host: sanitize(process.env.DB_HOST, 'localhost'),
    port: parseInt(sanitize(process.env.DB_PORT, '3306'), 10),
    user: sanitize(process.env.DB_USER, 'root'),
    password: sanitize(process.env.DB_PASSWORD, ''),
    database: sanitize(process.env.DB_NAME, 'blended_learning_analytics'),
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    ssl: (sanitize(process.env.DB_SSL) === 'true' || sanitize(process.env.DB_SSL) === '1') ? { rejectUnauthorized: false } : undefined
  }
};
