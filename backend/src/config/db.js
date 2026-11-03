import mysql from 'mysql2/promise';
import { config } from './env.js';

let pool = null;

export function getPool() {
  if (!pool) {
    try {
      pool = mysql.createPool(config.db);
    } catch (error) {
      console.error('[DB ERROR] Error al crear pool MySQL:', error.message);
    }
  }
  return pool;
}

// En entorno serverless de Vercel, siempre está disponible a través del pool
export const isDbConnected = true;

export async function checkDbConnection() {
  const currentPool = getPool();
  if (!currentPool) return false;
  try {
    const conn = await currentPool.getConnection();
    await conn.ping();
    conn.release();
    console.log('[DB] Conexión verificada con éxito a MySQL en la nube');
    return true;
  } catch (error) {
    console.warn(`[DB WARNING] Error al conectar a MySQL: ${error.message}`);
    return false;
  }
}

export async function query(sql, params = []) {
  const currentPool = getPool();
  if (!currentPool) {
    throw new Error('Servicio de base de datos MySQL no inicializado.');
  }

  try {
    const [results] = await currentPool.query(sql, params);
    return results;
  } catch (error) {
    // Si la conexión se cayó o es un reinicio serverless, recrear pool y reintentar
    if (error.code === 'PROTOCOL_CONNECTION_LOST' || error.code === 'ECONNRESET') {
      console.warn('[DB] Reconectando pool serverless...');
      pool = null;
      const retryPool = getPool();
      const [results] = await retryPool.query(sql, params);
      return results;
    }
    throw error;
  }
}

export { pool };
