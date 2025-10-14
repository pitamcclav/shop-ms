# MySQL Setup Guide

## ✅ Successfully Converted from SQLite to MySQL!

Your shop management system now uses MySQL instead of SQLite, making it production-ready for deployment on cPanel.

---

## 🚀 Local Development Setup (XAMPP)

### Step 1: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** and **MySQL** services

### Step 2: Create Database
1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click "New" in the left sidebar
3. Create a database named: **shop_management**
4. Click "Create"

### Step 3: Configure Environment Variables
The `.env.local` file has been created with default XAMPP settings:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=shop_management
```

**Note:** If your XAMPP MySQL has a password, update `DB_PASSWORD` in `.env.local`

### Step 4: Initialize Database Tables
Run this command to create all necessary tables:
```bash
npx tsx setup-mysql.ts
```

You should see:
```
✅ Database setup completed successfully!

Database: shop_management
Tables created: products, purchases, sales
```

### Step 5: Start Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🌐 Production Deployment (cPanel)

### Step 1: Create MySQL Database on cPanel
1. Log in to your cPanel
2. Go to **MySQL® Databases**
3. Create a new database (e.g., `your_shop_management`)
4. Create a MySQL user with a strong password
5. Add the user to the database with **ALL PRIVILEGES**
6. Note down:
   - Database name
   - Database user
   - Database password
   - Database host (usually `localhost` or specific hostname)

### Step 2: Update Environment Variables for Production
Create a `.env.production` file or update your production environment with:
```
DB_HOST=your-cpanel-mysql-host
DB_PORT=3306
DB_USER=your-cpanel-db-user
DB_PASSWORD=your-cpanel-db-password
DB_NAME=your-cpanel-db-name
```

### Step 3: Deploy Application
1. Build your Next.js app:
   ```bash
   npm run build
   ```

2. Upload these folders/files to your cPanel hosting:
   - `.next/` folder (build output)
   - `public/` folder
   - `package.json`
   - `package-lock.json`
   - `.env.production` (with production credentials)
   - All `src/` files

3. Install dependencies on server:
   ```bash
   npm install --production
   ```

4. Start the application:
   ```bash
   npm start
   ```

### Step 4: Initialize Production Database
Run the setup script on your production server:
```bash
npx tsx setup-mysql.ts
```

---

## 📊 Database Schema

### Products Table
- `id` - INT (Primary Key, Auto Increment)
- `name` - VARCHAR(255)
- `description` - TEXT
- `buying_price` - DECIMAL(10, 2)
- `selling_price` - DECIMAL(10, 2)
- `stock` - INT
- `category` - VARCHAR(100)
- `unit_type` - VARCHAR(50) - 'piece' or 'package'
- `units_per_package` - INT
- `package_name` - VARCHAR(100)
- `created_at` - TIMESTAMP
- `updated_at` - TIMESTAMP

### Purchases Table
- `id` - INT (Primary Key, Auto Increment)
- `product_id` - INT (Foreign Key → products.id)
- `quantity` - INT
- `buying_price` - DECIMAL(10, 2)
- `total_cost` - DECIMAL(10, 2)
- `supplier` - VARCHAR(255)
- `purchase_date` - TIMESTAMP

### Sales Table
- `id` - INT (Primary Key, Auto Increment)
- `product_id` - INT (Foreign Key → products.id)
- `quantity` - INT
- `selling_price` - DECIMAL(10, 2)
- `total_price` - DECIMAL(10, 2)
- `profit` - DECIMAL(10, 2)
- `sale_date` - TIMESTAMP

---

## 🔧 Troubleshooting

### "Connection refused" error
- Make sure XAMPP MySQL is running
- Check if port 3306 is available (not blocked by firewall)

### "Access denied" error
- Verify username and password in `.env.local`
- Default XAMPP credentials are `root` with empty password

### "Database doesn't exist" error
- Create the database in phpMyAdmin first
- Database name must match `DB_NAME` in `.env.local`

### Tables not created
- Run `npx tsx setup-mysql.ts` again
- Check MySQL error logs in XAMPP

---

## ✨ Features Preserved

All your existing features work with MySQL:
✅ Product management with unit conversion
✅ Stock management with weighted average buying price
✅ Sales with custom pricing and profit tracking
✅ Below-cost sale warnings
✅ Purchase history with supplier tracking
✅ Dashboard with profit metrics
✅ Bulk package to individual piece conversion

---

## 📝 Next Steps

1. Test locally with XAMPP
2. Create some test products and sales
3. Verify all features work correctly
4. Set up production database on cPanel
5. Deploy to your subdomain

Need help? Check the console logs for detailed error messages.
