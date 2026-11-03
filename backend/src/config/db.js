import mysql from 'mysql2/promise';
import { config } from './env.js';

let pool = null;
let isDbConnected = false;

try {
  pool = mysql.createPool(config.db);
} catch (error) {
  console.warn('[DB WARNING] Error al inicializar pool MySQL:', error.message);
}

export async function checkDbConnection() {
  if (!pool) return false;
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    isDbConnected = true;
    console.log('[DB] Conexión exitosa a MySQL (blended_learning_analytics)');
    return true;
  } catch (error) {
    isDbConnected = false;
    console.warn(`[DB WARNING] No se pudo conectar a MySQL (${error.message}). El sistema operará con almacenamiento en memoria/fallback.`);
    return false;
  }
}

export async function query(sql, params = []) {
  if (!pool || !isDbConnected) {
    throw new Error('DATABASE_NOT_CONNECTED');
  }
  const [results] = await pool.execute(sql, params);
  return results;
}

export { pool, isDbConnected };
