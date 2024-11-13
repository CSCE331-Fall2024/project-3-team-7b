const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');
const { escape } = require('querystring');
const { start } = require('repl');
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

// API route to fetch all components
app.get('/api/components', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM components');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const result = await pool.query('SELECT item_name, quantity, unit, supplier, threshold, needs_restock, itemID FROM inventory');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/api/inventoryID', async (req, res) => {
  try {
    const result = await pool.query('SELECT MAX(itemid) AS id FROM inventory');
    res.json(result.rows[0].id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

app.get('/api/inventory/check/:itemName', async (req, res) =>{
  const {itemName} = req.params;
  try{
    const result = await pool.query(`SELECT EXISTS (SELECT 1 FROM Inventory WHERE item_name ILIKE $1)`, [itemName]);
    res.json(result.rows[0].exists);
    return result.rows[0].exists;
  } catch (error){
    console.error("Error in API checking inventory: ", error);
    res.status(500).send('Server error');
  }
});

app.put('/api/inventory/:initialName', async(req, res) => {
  const initialName = req.params.initialName;
  const {item_name, quantity, unit, supplier, threshold, needs_restock} = req.body;

  try{
    const result = await pool.query(
      'UPDATE Inventory SET Item_Name = $1, Quantity = $2, Unit = $3, Supplier = $4, Threshold = $5, Needs_Restock = $6 WHERE Item_Name = $7 RETURNING *;',
      [item_name, quantity, unit, supplier, threshold, needs_restock, initialName]
    );

    if(result.rowCount > 0){
      res.json(result.rows[0]);
    }
    else{
      res.status(404).send('Item not found');
    }
  } catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/inventory/delete/:itemName', async (req, res) => {
  const {itemName} = req.params;
  try{
    const result = await pool.query(
      `DELETE FROM Inventory WHERE item_name ILIKE $1 RETURNING*`, [itemName]
    );
    if(result.rowCount > 0){
      res.json({message: 'Inventory item deleted', item: result.rows[0]});
    } else{
      res.status(404).send('Inventory item not found');
    }
  } catch (error){
      console.log(error);
      res.status(500).send('Server error');
  }
});

app.post('/api/inventory/add/:itemid', async(req, res) => {
  const {itemid} = req.params;
  console.log(req.body);
  const {item_name, quantity, unit, supplier, needs_restock, threshold} = req.body;

  try{
    const result = await pool.query(
      `INSERT INTO Inventory (itemid, item_name, quantity, unit, supplier, needs_restock, threshold) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [itemid, item_name, quantity, unit, supplier, needs_restock, threshold]
    );

    if(result.rowCount > 0){
      res.json(result.rows[0]);
    }
    else{
      res.status(404).send('Item not found');
    }
  } catch (error){
    console.error("Inside API error: ", error);
    res.status(500).send('Server Error');
  }
});

// API to fetch name of component with specific componentID 
app.get('/api/component-names', async(req, res) => {
  try {
    const result = await pool.query("SELECT Component_Name FROM Components WHERE ComponentID = ");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// API to fetch highest performing items
app.get('/api/fetch-highest', async(req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*), ComponentID FROM OrderXComponents GROUP BY ComponentID ORDER BY COUNT(ComponentID) DESC LIMIT 5;');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// API to fetch lowest performing items
app.get('/api/fetch-lowest', async(req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*), ComponentID FROM OrderXComponents GROUP BY ComponentID ORDER BY COUNT(ComponentID) LIMIT 5;');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// API to fetch product usage for trends
app.get('/api/product-usage', async(req, res) => {
  try {
    const { startDate, endDate } = req.query;

    console.log("start date: " + startDate);

    const query = `
      SELECT Inventory.ItemID, Inventory.Item_Name, Inventory.unit, SUM(COALESCE(ComponentXInventory.Num_Required, 0)) AS Total_Used 
      FROM Inventory 
      JOIN ComponentXInventory ON Inventory.ItemID = ComponentXInventory.ItemID 
      JOIN OrderXComponents ON ComponentXInventory.ComponentID = OrderXComponents.ComponentID 
      JOIN Orders ON OrderXComponents.OrderID = Orders.OrderID 
      JOIN Transactions ON Orders.OrderID = Transactions.OrderID 
      WHERE Transactions.Timestamp BETWEEN $1 AND $2 
      GROUP BY Inventory.ItemID, Inventory.Item_Name 
      ORDER BY Total_Used DESC;
    `;

    // Pass startDate and endDate as query parameters
    const result = await pool.query(query, [startDate, endDate]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching product usage data:", error);
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});