const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

// Database pool configuration
const pool = new Pool({
  user: process.env.PSQL_USER,
  host: process.env.PSQL_HOST,
  database: process.env.PSQL_DATABASE,
  password: process.env.PSQL_PASSWORD,
  port: process.env.PSQL_PORT,
});

// API route to fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// API route to fetch all menu items
app.get('/api/menu_items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT item_name, quantity, unit, supplier, threshold FROM inventory');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/api/threshold/:name', async (req, res) => {
  const name = req.params.name;
  try {
    const result = await pool.query('SELECT threshold FROM inventory WHERE item_name = $1', [name]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});