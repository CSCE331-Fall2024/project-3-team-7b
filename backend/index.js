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

// Add a new employee
app.post('/api/employees', async (req, res) => {
  const { employeeid, name, role, shift_schedule, username, password } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO employees (employeeid, name, role, shift_schedule, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [employeeid, name, role, shift_schedule, username, password]
    );

    res.json(result.rows[0]); // Send back the added employee data
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).send('Server error');
  }
});

// Update an existing employee by employeeid
app.put('/api/employees/:employeeid', async (req, res) => {
  const { employeeid } = req.params; // employeeid from URL parameters
  const { name, role, shift_schedule, username, password } = req.body;

  try {
    const result = await pool.query(
      'UPDATE employees SET name = $1, role = $2, shift_schedule = $3, username = $4, password = $5 WHERE employeeid = $6 RETURNING *',
      [name, role, shift_schedule, username, password, employeeid]
    );

    if (result.rowCount > 0) {
      res.json(result.rows[0]); // Send back the updated employee data
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).send('Server error');
  }
});

// Delete an employee by employeeid
app.delete('/api/employees/:employeeid', async (req, res) => {
  const { employeeid } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM employees WHERE employeeid = $1 RETURNING *',
      [employeeid]
    );

    if (result.rowCount > 0) {
      res.json({ message: 'Employee deleted successfully', employee: result.rows[0] });
    } else {
      res.status(404).send('Employee not found');
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
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

//retrieves the max itemid from the inventory table in the database
app.get('/api/inventoryID', async (req, res) => {
  try {
    const result = await pool.query('SELECT MAX(itemid) AS id FROM inventory');
    res.json(result.rows[0].id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//retrives the max componentID from the components table from the database
app.get('/api/componentID', async (req, res) => {
  try {
    const result = await pool.query('SELECT MAX(ComponentID) AS id FROM Components;');
    res.json(result.rows[0].id);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Call to database that returns if given inventory item exists within the inventory table
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

// Call to database that returns if given component exists within the components table
app.get('/api/components/check/:compName', async (req, res) =>{
  const {compName} = req.params;
  try{
    const result = await pool.query(`SELECT EXISTS (SELECT 1 FROM Components WHERE Component_Name ILIKE $1)`, [compName]);
    res.json(result.rows[0].exists);
    return result.rows[0].exists;
  } catch (error){
    console.error("Error in checking components: ", error);
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

// takes the component name and updates the data for that component in the database using the updated data
app.put('/api/components/:origComponent', async(req, res) =>{
  const origComponent = req.params.origComponent;
  const {component_name, category, availability, premium, seasonal} = req.body;

  try{
    const result = await pool.query(
      'UPDATE Components SET Component_Name = $1, Category = $2, Availability = $3, Premium = $4, Seasonal = $5 WHERE Component_Name ILIKE $6 RETURNING*;',
      [component_name, category, availability, premium, seasonal, origComponent]
    );
    if(result.rowCount > 0){
      res.json(result.rows[0]);
    }
    else{
      // console.log(result.rowCount);
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

//deletes the given component from the components table in the database
app.delete('/api/components/delete/:compName', async (req, res) => {
  const {compName} = req.params;
  try{
    const result = await pool.query(
      `DELETE FROM Components WHERE component_name ILIKE $1 RETURNING*`, [compName]
    );
    if(result.rowCount > 0){
      res.json({message: 'Component item deleted', item: result.rows[0]});
    } else{
      res.status(404).send('Component item not found');
    }
  } catch (error){
      console.log(error);
      res.status(500).send('Server error');
  }
});


app.post('/api/inventory/add/:itemid', async(req, res) => {
  const {itemid} = req.params;
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

// adds a new component to the components table within the database
app.post('/api/components/add/:componentID', async(req, res) => {
  const {componentID} = req.params;
  const {component_name, category, availability, premium, seasonal} = req.body;

  try{
    const result = await pool.query(
      `INSERT INTO Components (ComponentID, Component_Name, Category, Availability, Premium, Seasonal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*;`,
      [componentID, component_name, category, availability, premium, seasonal]
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

// API to fetch sales report for trends
app.get('/api/sales-report', async(req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = `
      SELECT c.Component_Name, COUNT(DISTINCT t.OrderID) as order_count, SUM(t.Amount) as total_sales
      FROM Transactions t 
      JOIN OrderXComponents oxc ON t.OrderID = oxc.OrderID
      JOIN Components c ON oxc.ComponentID = c.ComponentID
      WHERE t.Timestamp BETWEEN $1 AND $2 
      GROUP BY c.ComponentID, c.Component_Name;
    `;

    // Pass startDate and endDate as query parameters
    const result = await pool.query(query, [startDate, endDate]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching sales report data:", error);
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