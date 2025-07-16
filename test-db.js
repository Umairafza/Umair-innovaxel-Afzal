const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'url_shortener',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function testDatabaseConnection() {
  let connection;
  
  try {
    console.log('🔌 Testing MySQL connection...');
    console.log('Database config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    });
    
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    console.log(' MySQL connection successful!');
    
    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log(' Basic query test passed:', rows[0]);
    
    // Check if urls table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "urls"');
    if (tables.length > 0) {
      console.log(' URLs table exists');
      
      // Get table structure
      const [columns] = await connection.execute('DESCRIBE urls');
      console.log(' Table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
      });
      
      // Count records
      const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM urls');
      console.log(` Total URLs in database: ${countResult[0].count}`);
      
      // Get recent URLs
      const [recentUrls] = await connection.execute('SELECT * FROM urls ORDER BY created_at DESC LIMIT 5');
      console.log(' Recent URLs:');
      recentUrls.forEach(url => {
        console.log(`  - ${url.short_code} -> ${url.original_url} (${url.access_count} clicks)`);
      });
      
    } else {
      console.log(' URLs table does not exist. Please run the database.sql script first.');
    }
    
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    console.log('\n Make sure to:');
    console.log('1. Install MySQL server');
    console.log('2. Create a .env file with your database credentials:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_USER=root');
    console.log('   DB_PASSWORD=your_password');
    console.log('   DB_NAME=url_shortener');
    console.log('3. Run the database.sql script to create the database and table');
  } finally {
    if (connection) {
      await connection.end();
      console.log(' Database connection closed');
    }
  }
}

async function runCustomQuery(query, params = []) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log(` Running query: ${query}`);
    console.log(` Parameters:`, params);
    
    const [rows] = await connection.execute(query, params);
    console.log(' Query executed successfully!');
    console.log(' Results:', rows);
    
    return rows;
  } catch (error) {
    console.error(' Query failed:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}



// Main execution
if (require.main === module) {
  testDatabaseConnection().then(() => {
    console.log('\n🎉 Database test completed!');
    console.log('\n💡 You can also run custom queries:');
    console.log('   node test-db.js --query "SELECT * FROM urls LIMIT 5"');
  });
}

module.exports = { testDatabaseConnection, runCustomQuery }; 