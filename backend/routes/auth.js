const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

const USERNAME_RE = /^[a-zA-Z0-9_]{1,30}$/;

router.post('/register', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'Username must be 1–30 characters (letters, numbers, underscores only)' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, password_hash);
  const id = result.lastInsertRowid;

  const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: { id, username } });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const row = db.prepare('SELECT id, username, password_hash FROM users WHERE username = ?').get(username);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: row.id, username: row.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.status(200).json({ token, user: { id: row.id, username: row.username } });
});

module.exports = router;
