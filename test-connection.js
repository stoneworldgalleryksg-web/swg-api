import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing connection to:', process.env.DB_HOST);
    console.log('Port:', process.env.DB_PORT);
    console.log('Database:', process.env.DB_NAME);
    console.log('User:', process.env.DB_USER);
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 60000
    });
    
    console.log('Database connection successful!');
    
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Query test successful:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('Database connection failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ETIMEDOUT') {
      console.log('Troubleshooting tips:');
      console.log('1. Check if your IP is whitelisted in Aiven console');
      console.log('2. Verify the hostname and port are correct');
      console.log('3. Check your internet connection');
      console.log('4. Try connecting from a different network');
    }
  }
}

testConnection();