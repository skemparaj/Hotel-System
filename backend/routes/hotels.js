const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const { title, minPrice, maxPrice, page = 1, limit = 6 } = req.query;
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM hotels WHERE 1=1';
  const params = [];
  if (title) { params.push(`%${title}%`); query += ` AND title ILIKE $${params.length}`; }
  if (minPrice) { params.push(minPrice); query += ` AND price >= $${params.length}`; }
  if (maxPrice) { params.push(maxPrice); query += ` AND price <= $${params.length}`; }
  params.push(limit); query += ` LIMIT $${params.length}`;
  params.push(offset); query += ` OFFSET $${params.length}`;
  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hotels WHERE id = $1', [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  const { title, description, latitude, longitude, price } = req.body;
  const image_path = req.file ? req.file.filename : null;
  try {
    const result = await pool.query(
      'INSERT INTO hotels (title, description, image_path, latitude, longitude, price) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, description, image_path, latitude, longitude, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  const { title, description, latitude, longitude, price } = req.body;
  const image_path = req.file ? req.file.filename : req.body.existing_image;
  try {
    const result = await pool.query(
      'UPDATE hotels SET title=$1, description=$2, image_path=$3, latitude=$4, longitude=$5, price=$6 WHERE id=$7 RETURNING *',
      [title, description, image_path, latitude, longitude, price, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hotels WHERE id = $1', [req.params.id]);
    res.json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;