const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const validUrl = require('valid-url');
const pool = require('../config/db');

router.post('/shorten', async (req, res) => {
  const { url } = req.body;
  
  if (!validUrl.isUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const shortCode = shortid.generate();
  const createdAt = new Date();
  const updatedAt = createdAt;

  try {
    const [result] = await pool.query(
      'INSERT INTO urls (original_url, short_code, created_at, updated_at) VALUES (?, ?, ?, ?)',
      [url, shortCode, createdAt, updatedAt]
    );

    res.status(201).json({
      id: result.insertId,
      url,
      shortCode,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/shorten/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM urls WHERE short_code = ?', [shortCode]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const url = rows[0];
    await pool.query('UPDATE urls SET access_count = access_count + 1 WHERE id = ?', [url.id]);

    res.status(200).json({
      id: url.id,
      url: url.original_url,
      shortCode: url.short_code,
      createdAt: url.created_at.toISOString(),
      updatedAt: url.updated_at.toISOString(),
      accessCount: url.access_count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/shorten/:shortCode', async (req, res) => {
  const { shortCode } = req.params;
  const { url } = req.body;

  if (!validUrl.isUri(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const updatedAt = new Date();

  try {
    const [rows] = await pool.query('SELECT * FROM urls WHERE short_code = ?', [shortCode]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    await pool.query(
      'UPDATE urls SET original_url = ?, updated_at = ? WHERE short_code = ?',
      [url, updatedAt, shortCode]
    );

    res.status(200).json({
      id: rows[0].id,
      url,
      shortCode,
      createdAt: rows[0].created_at.toISOString(),
      updatedAt: updatedAt.toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/shorten/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM urls WHERE short_code = ?', [shortCode]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    await pool.query('DELETE FROM urls WHERE short_code = ?', [shortCode]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM urls WHERE short_code = ?', [shortCode]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const url = rows[0];
    res.status(200).json({
      id: url.id,
      url: url.original_url,
      shortCode: url.short_code,
      createdAt: url.created_at.toISOString(),
      updatedAt: url.updated_at.toISOString(),
      accessCount: url.access_count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM urls WHERE short_code = ?', [shortCode]);
    
    if (rows.length === 0) {
      return res.status(404).send('Short URL not found');
    }

    const url = rows[0];
    await pool.query('UPDATE urls SET access_count = access_count + 1 WHERE id = ?', [url.id]);
    res.redirect(url.original_url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;