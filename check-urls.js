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

async function checkStoredUrls() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(' Checking stored URLs in database...\n');
    
    
    const [countResult] = await connection.query('SELECT COUNT(*) as total FROM urls');
    console.log(` Total URLs stored: ${countResult[0].total}\n`);
    
    if (countResult[0].total > 0) {
      
      const [urls] = await connection.query('SELECT * FROM urls ORDER BY created_at DESC');
      
      console.log(' All stored URLs:');
      console.log('─'.repeat(80));
      
      urls.forEach((url, index) => {
        const shortUrl = `http://localhost:4000/${url.short_code}`;
        console.log(`${index + 1}. Short Code: ${url.short_code}`);
        console.log(`   Original URL: ${url.original_url}`);
        console.log(`   Short URL: ${shortUrl}`);
        console.log(`   Clicks: ${url.access_count}`);
        console.log(`   Created: ${url.created_at.toLocaleString()}`);
        console.log('─'.repeat(80));
      });
      
      // Get statistics
      const [stats] = await connection.query('SELECT SUM(access_count) as total_clicks FROM urls');
      console.log(`\n Statistics:`);
      console.log(`   Total clicks: ${stats[0].total_clicks || 0}`);
      console.log(`   Average clicks per URL: ${Math.round((stats[0].total_clicks || 0) / countResult[0].total)}`);
      
    } else {
      console.log(' No URLs stored yet. Create some URLs using the frontend!');
    }
    
  } catch (error) {
    console.error(' Error checking URLs:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the check
checkStoredUrls(); 