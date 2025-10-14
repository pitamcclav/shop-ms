#!/usr/bin/env node

/**
 * cPanel Node.js Startup File
 * This file is the entry point for running the Next.js app on cPanel hosting
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Get port from environment or use 3000 as default
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

console.log('🚀 Starting Shop Management System...');
console.log(`Environment: ${dev ? 'Development' : 'Production'}`);
console.log(`Port: ${port}`);

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log('');
      console.log('✅ Shop Management System is running!');
      console.log(`   Local:    http://${hostname}:${port}`);
      console.log('');
      console.log('📊 Database: MySQL');
      console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
      console.log(`   Database: ${process.env.DB_NAME || 'shop_management'}`);
      console.log('');
      console.log('Press Ctrl+C to stop the server');
    });
});

// Handle process termination gracefully
process.on('SIGTERM', () => {
  console.log('');
  console.log('👋 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('');
  console.log('👋 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});
