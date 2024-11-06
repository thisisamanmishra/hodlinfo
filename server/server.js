const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;
app.use(cors());
// PostgreSQL setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'aman',
  port: 5432,
});

// Fetch data from API and store in DB
async function fetchAndStoreData() {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const tickers = Object.values(response.data).slice(0, 10);

    await pool.query('DELETE FROM tickers'); // Clear existing data

    tickers.forEach(async (ticker) => {
      const { name, last, buy, sell, volume, base_unit } = ticker;
      await pool.query(
        `INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)`,
        [name, last, buy, sell, volume, base_unit]
      );
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Run fetchAndStoreData every 5 minutes
setInterval(fetchAndStoreData, 5 * 60 * 1000);
fetchAndStoreData();

// Route to get data from DB
app.get('/api/tickers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tickers');
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database query error' });
  }
});

app.listen(8000, () => {
  console.log(`Server is running on http://localhost:8000`);
});
