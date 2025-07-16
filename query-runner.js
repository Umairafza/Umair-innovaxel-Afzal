const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'url_shortener',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function runQuery(query, params = []) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(` Running: ${query}`);
    if (params.length > 0) {
      console.log(` Parameters: ${JSON.stringify(params)}`);
    }
    
    const [rows] = await connection.query(query, params);
    console.log(' Query executed successfully!');
    console.log(` Results (${rows.length} rows):`);
    
    if (rows.length > 0) {
      console.table(rows);
    } else {
      console.log('No results found');
    }
    
    return rows;
  } catch (error) {
    console.error('❌ Query failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


const examples = {
  // Get all URLs
  'Get all URLs': 'SELECT * FROM urls ORDER BY created_at DESC',
  
  // Get popular URLs
  'Get popular URLs': 'SELECT * FROM urls WHERE access_count > 0 ORDER BY access_count DESC LIMIT 10',
  
  // Get URLs created today
  'Get today URLs': 'SELECT * FROM urls WHERE DATE(created_at) = CURDATE()',
  
  // Get total clicks
  'Get total clicks': 'SELECT SUM(access_count) as total_clicks FROM urls',
  
  // Get URLs by domain
  'Get Google URLs': 'SELECT * FROM urls WHERE original_url LIKE "%google%"',
  
  // Get URL count by domain
  'Count by domain': 'SELECT COUNT(*) as count FROM urls WHERE original_url LIKE "%google%"',
  
  // Get recent activity
  'Recent activity': 'SELECT short_code, original_url, access_count, created_at FROM urls ORDER BY created_at DESC LIMIT 5',
  
  // Get average clicks
  'Average clicks': 'SELECT AVG(access_count) as avg_clicks FROM urls'
};


if (process.argv.length > 2) {
  const query = process.argv[2];
  const params = process.argv.slice(3);
  runQuery(query, params);
} else {
  
  console.log(' MySQL Query Runner');
  console.log('Available example queries:\n');
  
  Object.entries(examples).forEach(([name, query], index) => {
    console.log(`${index + 1}. ${name}:`);
    console.log(`   ${query}\n`);
  });
  
  console.log(' Usage:');
  console.log('   node query-runner.js "SELECT * FROM urls LIMIT 5"');
  console.log('   node query-runner.js "SELECT * FROM urls WHERE short_code = ?" "google"');
}

module.exports = { runQuery }; 