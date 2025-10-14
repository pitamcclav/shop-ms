# 🚀 cPanel Deployment Guide

## Complete Guide to Deploy Your Shop Management System on cPanel

---

## 📋 Prerequisites

Before deploying, make sure you have:

1. ✅ cPanel hosting with Node.js support
2. ✅ Access to cPanel dashboard
3. ✅ MySQL database available
4. ✅ Subdomain configured
5. ✅ SSH access (optional but recommended)

---

## 🎯 Step-by-Step Deployment

### **Step 1: Prepare Your Application for Production**

#### 1.1 Build the Application Locally
```bash
# Navigate to your project
cd "c:\Users\HP\Desktop\New folder\projects\Shop Management System\shop-ms"

# Install all dependencies
npm install

# Build for production
npm run build
```

This creates an optimized `.next` folder with production-ready files.

---

### **Step 2: Set Up MySQL Database on cPanel**

#### 2.1 Create MySQL Database
1. Log in to your cPanel
2. Go to **MySQL® Databases**
3. Under **Create New Database**, enter: `shop_management` (or your preferred name)
4. Click **Create Database**

#### 2.2 Create MySQL User
1. Scroll to **MySQL Users** section
2. Under **Add New User**:
   - Username: `shop_admin` (or your choice)
   - Password: Generate a strong password
   - Click **Create User**

#### 2.3 Add User to Database
1. Scroll to **Add User To Database**
2. Select the user and database you created
3. Click **Add**
4. Select **ALL PRIVILEGES**
5. Click **Make Changes**

#### 2.4 Note Down Your Credentials
```
DB_HOST=localhost (or provided hostname)
DB_PORT=3306
DB_USER=your-cpanel-username_shop_admin
DB_PASSWORD=your-strong-password
DB_NAME=your-cpanel-username_shop_management
```

**Note:** cPanel usually prefixes database names and usernames with your cPanel username followed by underscore.

---

### **Step 3: Set Up Node.js Application on cPanel**

#### 3.1 Access Node.js Apps
1. In cPanel, search for **Setup Node.js App**
2. Click on it

#### 3.2 Create Node.js Application
1. Click **Create Application**
2. Fill in the details:
   - **Node.js version:** Select latest (18.x or higher)
   - **Application mode:** Production
   - **Application root:** `/home/yourusername/shop-ms` (or your preferred path)
   - **Application URL:** Select your subdomain
   - **Application startup file:** `app.js`
   - **Passenger log file:** Leave default

3. Click **Create**

---

### **Step 4: Upload Files to cPanel**

#### Option A: Using File Manager (Easier)

1. In cPanel, open **File Manager**
2. Navigate to your application root (e.g., `/home/yourusername/shop-ms`)
3. Upload these files/folders:
   ```
   ├── .next/                 (entire folder from build)
   ├── public/                (entire folder)
   ├── src/                   (entire folder)
   ├── app.js                 (startup file)
   ├── package.json
   ├── package-lock.json
   ├── next.config.ts
   ├── tsconfig.json
   ├── setup-mysql.ts
   └── .env.production        (create this - see below)
   ```

#### Option B: Using FTP/SFTP (Recommended for large files)

1. Use FileZilla or any FTP client
2. Connect to your cPanel via FTP/SFTP
3. Navigate to application root folder
4. Upload the same files as above

#### Option C: Using Git (Best Practice)

```bash
# On cPanel terminal or SSH
cd /home/yourusername/shop-ms
git clone https://github.com/yourusername/shop-ms.git .
```

---

### **Step 5: Create Environment File**

Create a `.env.production` file in your application root with:

```bash
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=yourusername_shop_admin
DB_PASSWORD=your-strong-password
DB_NAME=yourusername_shop_management

# Node Environment
NODE_ENV=production

# Port (cPanel will override this)
PORT=3000
```

**Security:** Make sure this file is NOT accessible via web browser!

---

### **Step 6: Install Dependencies and Initialize Database**

#### 6.1 Via cPanel Terminal
1. In your Node.js App settings, click **Run NPM Install**
2. Or use the **Terminal** in cPanel:

```bash
cd /home/yourusername/shop-ms
npm install --production
```

#### 6.2 Initialize MySQL Database
```bash
# In cPanel Terminal
cd /home/yourusername/shop-ms
npx tsx setup-mysql.ts
```

You should see:
```
✅ Database created/verified!
✅ Database setup completed successfully!
```

---

### **Step 7: Configure Environment Variables in cPanel**

1. Go back to **Setup Node.js App**
2. Click on your application
3. In **Environment Variables** section, add:
   ```
   NODE_ENV=production
   DB_HOST=localhost
   DB_USER=yourusername_shop_admin
   DB_PASSWORD=your-password
   DB_NAME=yourusername_shop_management
   DB_PORT=3306
   ```

---

### **Step 8: Start the Application**

1. In your Node.js App settings
2. Click **Start App** or **Restart App**
3. You should see: **Status: Running**

---

### **Step 9: Access Your Application**

Visit your subdomain:
```
https://your-subdomain.yourdomain.com
```

If everything is set up correctly, you should see your Shop Management System!

---

## 🔧 Troubleshooting

### Application Not Starting

**Check Logs:**
1. In Node.js App settings, view the **Passenger log file**
2. Look for errors

**Common Issues:**

#### 1. Port Already in Use
- cPanel manages ports automatically
- Make sure `PORT` env variable is not conflicting

#### 2. Database Connection Failed
```bash
# Test database connection
mysql -u yourusername_shop_admin -p yourusername_shop_management
```

#### 3. Missing Dependencies
```bash
cd /home/yourusername/shop-ms
npm install --production
```

#### 4. Build Files Missing
Make sure you uploaded the `.next` folder after running `npm run build`

#### 5. Permission Issues
```bash
chmod -R 755 /home/yourusername/shop-ms
```

---

## 🔐 Security Best Practices

### 1. Secure Database Credentials
- Use strong passwords
- Never commit `.env.production` to Git
- Add `.env.production` to `.gitignore`

### 2. Update .gitignore
```
.env.local
.env.production
.env*.local
shop.db
node_modules
.next
```

### 3. Enable SSL/HTTPS
1. In cPanel, go to **SSL/TLS**
2. Install Let's Encrypt certificate for your subdomain
3. Force HTTPS redirect

### 4. Protect Sensitive Files
Create `.htaccess` in your application root:
```apache
<Files ".env.production">
    Order allow,deny
    Deny from all
</Files>

<Files "setup-mysql.ts">
    Order allow,deny
    Deny from all
</Files>
```

---

## 🔄 Updating Your Application

### When You Make Changes:

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload only changed files:**
   - Upload new `.next` folder
   - Upload any modified `src` files
   - Upload `package.json` if dependencies changed

3. **If package.json changed:**
   ```bash
   npm install --production
   ```

4. **Restart the app:**
   - In cPanel Node.js App settings
   - Click **Restart App**

---

## 📊 Monitoring

### Check Application Status
- cPanel → Setup Node.js App → Your App
- View **Status** and **Logs**

### Check Database
- cPanel → phpMyAdmin
- Select your database
- View tables: `products`, `purchases`, `sales`

### Performance Monitoring
- Monitor memory usage in Node.js App settings
- Check error logs regularly

---

## 🎯 Quick Commands Reference

```bash
# Navigate to app directory
cd /home/yourusername/shop-ms

# Install dependencies
npm install --production

# Initialize database
npx tsx setup-mysql.ts

# View logs
tail -f /home/yourusername/logs/passenger.log

# Restart app (if you have PM2)
pm2 restart all

# Check node version
node --version

# Check npm version
npm --version
```

---

## 📞 Getting Help

### If Something Goes Wrong:

1. **Check cPanel Logs:** Setup Node.js App → View Logs
2. **Check Database:** phpMyAdmin → Your Database
3. **Test Locally First:** Make sure it works with `npm run dev`
4. **Contact Support:** Your hosting provider's cPanel support

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] MySQL database created and user configured
- [ ] All files uploaded to cPanel
- [ ] Environment variables set correctly
- [ ] Dependencies installed (`npm install`)
- [ ] Database initialized (`setup-mysql.ts` run)
- [ ] Application started successfully
- [ ] Can access via subdomain
- [ ] SSL certificate installed
- [ ] Can create products
- [ ] Can add stock purchases
- [ ] Can make sales
- [ ] Dashboard showing correct data

---

## 🎉 You're Live!

Your Shop Management System is now running on cPanel with MySQL database!

**Application Entry Point:** `app.js`  
**Startup Command:** `node app.js`  
**Environment:** Production  
**Database:** MySQL

Enjoy your production-ready shop management system! 🚀
