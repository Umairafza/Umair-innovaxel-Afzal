const express = require('express');
const app = express();
const urlRoutes = require('./routes/urlRoutes');
const pool = require('./config/db');
require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));

app.use('/api', urlRoutes);

const PORT = process.env.PORT || 5002;

// Test database connection on startup
async function testDatabaseConnection() {
  try {
    const [result] = await pool.query('SELECT 1 as test');
    console.log('✅ Database connection successful!');
    
    // Get URL count
    const [countResult] = await pool.query('SELECT COUNT(*) as count FROM urls');
    console.log(`📊 Total URLs in database: ${countResult[0].count}`);
    
    // Show recent URLs
    const [recentUrls] = await pool.query('SELECT short_code, original_url FROM urls ORDER BY created_at DESC LIMIT 3');
    if (recentUrls.length > 0) {
      console.log('🔗 Recent URLs:');
      recentUrls.forEach(url => {
        console.log(`   - ${url.short_code} -> ${url.original_url}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(` Frontend: http://localhost:${PORT}`);
  console.log('Testing database connection...');
  await testDatabaseConnection();
});