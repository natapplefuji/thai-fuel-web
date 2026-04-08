const express = require('express');
const db = require('../db');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.use(verifyToken);

function toRow(row) {
  return {
    id: row.id,
    startPoint: row.start_point,
    destination: row.destination,
    fuelType: row.fuel_type,
    distance: row.distance,
    litresUsed: row.litres_used,
    totalCost: row.total_cost,
    createdAt: row.created_at,
  };
}

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  return res.status(200).json({ expenses: rows.map(toRow) });
});

router.post('/', (req, res) => {
  const { startPoint, destination, fuelType, distance, litresUsed, totalCost } = req.body || {};

  if (!startPoint || !destination || !fuelType) {
    return res.status(400).json({ error: 'startPoint, destination, and fuelType are required' });
  }
  if (!Number.isFinite(distance) || distance <= 0 ||
      !Number.isFinite(litresUsed) || litresUsed <= 0 ||
      !Number.isFinite(totalCost) || totalCost <= 0) {
    return res.status(400).json({ error: 'distance, litresUsed, and totalCost must be positive numbers' });
  }

  const result = db.prepare(
    'INSERT INTO expenses (user_id, start_point, destination, fuel_type, distance, litres_used, total_cost) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(req.user.id, startPoint, destination, fuelType, distance, litresUsed, totalCost);

  const row = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
  return res.status(201).json({ expense: toRow(row) });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid expense id' });
  }

  const result = db
    .prepare('DELETE FROM expenses WHERE id = ? AND user_id = ?')
    .run(id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  return res.status(200).json({ success: true });
});

module.exports = router;
