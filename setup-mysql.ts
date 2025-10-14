import mysql from 'mysql2/promise';
import { initDatabase } from './src/lib/db-mysql';

async function setup() {
  console.log('Starting MySQL database setup...');
  console.log('Make sure XAMPP MySQL is running!');
  console.log('');
  
  try {
    // First, connect without specifying a database to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'shop_management';
    
    console.log(`Creating database: ${dbName}...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log('✅ Database created/verified!');
    console.log('');
    
    await connection.end();

    // Now initialize tables
    console.log('Creating tables...');
    await initDatabase();
    console.log('');
    console.log('✅ Database setup completed successfully!');
    console.log('');
    console.log(`Database: ${dbName}`);
    console.log('Tables created: products, purchases, sales');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure XAMPP MySQL is running');
    console.log('2. Check .env.local file for correct credentials');
    console.log('3. Default XAMPP credentials are user: root, password: (empty)');
    process.exit(1);
  }
}

setup();
