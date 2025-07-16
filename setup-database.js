const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Setting up database...');
    
    // First connect without specifying database
    const configWithoutDB = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };
    
    connection = await mysql.createConnection(configWithoutDB);
    console.log(' Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS url_shortener');
    console.log(' Database "url_shortener" created/verified');
    
    // Use the database
    await connection.query('USE url_shortener');
    console.log(' Using database "url_shortener"');
    
    // Create urls table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS urls (
        id INT AUTO_INCREMENT PRIMARY KEY,
        original_url VARCHAR(255) NOT NULL,
        short_code VARCHAR(50) NOT NULL UNIQUE,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        access_count INT DEFAULT 0
      )
    `;
    
    await connection.query(createTableSQL);
    console.log(' Table "urls" created/verified');
    
    // Show table structure
    const [columns] = await connection.query('DESCRIBE urls');
    console.log('Table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : ''} ${col.Key === 'PRI' ? 'PRIMARY KEY' : ''}`);
    });
    
    // Insert some sample data
    const sampleUrls = [
      {
        original_url: 'https://www.google.com',
        short_code: 'google',
        created_at: new Date(),
        updated_at: new Date(),
        access_count: 0
      },
      {
        original_url: 'https://www.github.com',
        short_code: 'github',
        created_at: new Date(),
        updated_at: new Date(),
        access_count: 0
      }
    ];
    
    for (const url of sampleUrls) {
      try {
        await connection.query(
          'INSERT INTO urls (original_url, short_code, created_at, updated_at, access_count) VALUES (?, ?, ?, ?, ?)',
          [url.original_url, url.short_code, url.created_at, url.updated_at, url.access_count]
        );
        console.log(` Added sample URL: ${url.short_code} -> ${url.original_url}`);
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`ℹ Sample URL ${url.short_code} already exists`);
        } else {
          console.error(`❌ Error adding sample URL ${url.short_code}:`, error.message);
        }
      }
    }
    
    // Show total count
    const [countResult] = await connection.query('SELECT COUNT(*) as count FROM urls');
    console.log(` Total URLs in database: ${countResult[0].count}`);
    
    console.log('\n Database setup completed successfully!');
    console.log(' You can now run your server with: npm start');
    
  } catch (error) {
    console.error(' Database setup failed:', error.message);
    console.log('\n Make sure your .env file contains:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_USER=root');
    console.log('   DB_PASSWORD=your_password');
    console.log('   DB_NAME=url_shortener');
  } finally {
    if (connection) {
      await connection.end();
      console.log(' Database connection closed');
    }
  }
}

// Run the setup
setupDatabase(); 