import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config(); // Load .env variables
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = await mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'plant_shop',
});

const jwtSecret = process.env.JWT_SECRET || 'default_secret_key';

// Middleware: Auth
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).send("Token missing");
  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(403).send("Invalid token");
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).send("Admins only");
  }
  next();
};

// 🚀 Routes

// Register
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashed]);
  res.sendStatus(201);
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (users.length === 0) return res.status(401).send("Invalid credentials");

  const match = await bcrypt.compare(password, users[0].password);
  if (!match) return res.status(401).send("Invalid credentials");

  const token = jwt.sign(
    { id: users[0].id, role: users[0].role },
    jwtSecret,
    { expiresIn: '1d' }
  );

  res.json({ token });
});

// 🔍 Products

app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products');
  res.json(rows);
});

app.get('/api/products/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.sendStatus(404);
  res.json(rows[0]);
});

app.post('/api/products', authenticate, adminOnly, async (req, res) => {
  const { name, price, categoryId, imageUrl } = req.body;
  await pool.query(
    'INSERT INTO products (name, price, categoryId, imageUrl) VALUES (?, ?, ?, ?)',
    [name, price, categoryId, imageUrl]
  );
  res.sendStatus(201);
});

app.put('/api/products/:id', authenticate, adminOnly, async (req, res) => {
  const { name, price, categoryId, imageUrl } = req.body;
  await pool.query(
    'UPDATE products SET name = ?, price = ?, categoryId = ?, imageUrl = ? WHERE id = ?',
    [name, price, categoryId, imageUrl, req.params.id]
  );
  res.sendStatus(200);
});

app.delete('/api/products/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.sendStatus(204);
});

// 📦 Categories

app.get('/api/categories', authenticate, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories');
  res.json(rows);
});

app.post('/api/categories', authenticate, adminOnly, async (req, res) => {
  const { name, value } = req.body;
  await pool.query('INSERT INTO categories (name, value) VALUES (?, ?)', [name, value]);
  res.sendStatus(201);
});

app.delete('/api/categories/:id', authenticate, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.sendStatus(204);
});

// Start server
app.listen(5001, () => {
  console.log('✅ Server running at http://localhost:5001');
});