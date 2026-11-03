import mysql from 'mysql2/promise';

async function test() {
  const passwords = ['', 'root', 'admin', 'password', '123456', '1234', 'admin123', 'root123'];
  for (const pwd of passwords) {
    try {
      const conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: pwd
      });
      console.log(`[MYSQL FOUND] Connected with password: '${pwd}'`);
      const [databases] = await conn.query('SHOW DATABASES');
      console.log('Databases:', databases.map(d => Object.values(d)[0]));
      await conn.end();
      return pwd;
    } catch (e) {
      // try next
    }
  }
  console.log('[MYSQL] No simple password worked');
}

test();
