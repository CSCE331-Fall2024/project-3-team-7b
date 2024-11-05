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

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, '../my-app/build')));

// Route for the root URL to serve `index.html`
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../my-app/build', 'index.html'));
});

// Catch-all handler to serve `index.html` for any unhandled routes (for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../my-app/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});