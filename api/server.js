const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'mysqluser',
  password: process.env.DB_PASSWORD || 'Password123',
  database: process.env.DB_NAME || 'my_database',
  waitForConnections: true,
  connectionLimit: 5,
});

let dbReady = false;

async function connectDb() {
  while (!dbReady) {
    try {
      await pool.query('SELECT 1');
      dbReady = true;
      console.log('MySQL listo');
    } catch {
      console.log('Esperando a MySQL...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: dbReady ? 'ready' : 'unavailable' });
});

connectDb();

app.use('/api/personas', (req, res, next) => {
  if (!dbReady) return res.status(503).json({ error: 'La base de datos aún no está lista' });
  next();
});

app.get('/api/personas', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM personas ORDER BY id');
  res.json(rows);
});

app.post('/api/personas', async (req, res) => {
  const { nombre, rut, fecha_nacimiento } = req.body;
  const [r] = await pool.query(
    'INSERT INTO personas (nombre, rut, fecha_nacimiento) VALUES (?, ?, ?)',
    [nombre, rut, fecha_nacimiento]
  );
  res.json({ id: r.insertId, nombre, rut, fecha_nacimiento });
});

app.put('/api/personas/:id', async (req, res) => {
  const { nombre, rut, fecha_nacimiento } = req.body;
  await pool.query(
    'UPDATE personas SET nombre = ?, rut = ?, fecha_nacimiento = ? WHERE id = ?',
    [nombre, rut, fecha_nacimiento, req.params.id]
  );
  res.json({ ok: true });
});

app.delete('/api/personas/:id', async (req, res) => {
  await pool.query('DELETE FROM personas WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

app.listen(3001, () => console.log('API en :3001'));
