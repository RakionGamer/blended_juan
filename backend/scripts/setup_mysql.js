import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setup() {
  console.log('[SETUP] Inicializando base de datos MySQL 100% real...');

  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });

  try {
    const schemaSql = fs.readFileSync(path.resolve(__dirname, '../../database/schema.sql'), 'utf-8');
    console.log('[SETUP] Ejecutando schema.sql...');
    await conn.query(schemaSql);
    console.log('[SETUP] Tablas creadas con éxito.');

    const seedSql = fs.readFileSync(path.resolve(__dirname, '../../database/seed.sql'), 'utf-8');
    console.log('[SETUP] Ejecutando seed.sql (roles y usuarios iniciales)...');
    await conn.query(seedSql);
    console.log('[SETUP] Datos iniciales insertados con éxito.');

    console.log('[SETUP] Base de datos MySQL blended_learning_analytics LISTA PARA PRODUCCIÓN.');
  } catch (err) {
    console.error('[SETUP ERROR]:', err);
  } finally {
    await conn.end();
  }
}

setup();
