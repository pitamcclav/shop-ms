import Database from "better-sqlite3";
import path from "path";

// Migration script to update existing database
const dbPath = path.join(process.cwd(), "shop.db");
const db = new Database(dbPath);

console.log("Starting database migration...");

try {
  // Check if old schema exists
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Existing tables:", tables);

  // Check if products table has old schema
  const columns: any[] = db.prepare("PRAGMA table_info(products)").all();
  const hasOldSchema = columns.some(col => col.name === "price");
  const hasNewSchema = columns.some(col => col.name === "buying_price");

  if (hasOldSchema && !hasNewSchema) {
    console.log("Migrating products table to new schema...");
    
    // Rename old table
    db.exec("ALTER TABLE products RENAME TO products_old");
    
    // Create new products table
    db.exec(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        buying_price REAL NOT NULL DEFAULT 0,
        selling_price REAL NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Migrate data (set buying_price to 70% of selling_price as default)
    db.exec(`
      INSERT INTO products (id, name, description, buying_price, selling_price, stock, category, created_at, updated_at)
      SELECT id, name, description, price * 0.7, price, stock, category, created_at, updated_at
      FROM products_old
    `);
    
    // Drop old table
    db.exec("DROP TABLE products_old");
    console.log("Products table migrated successfully!");
  }

  // Check if sales table needs migration
  const salesColumns: any[] = db.prepare("PRAGMA table_info(sales)").all();
  const salesHasOldSchema = !salesColumns.some(col => col.name === "selling_price");

  if (salesHasOldSchema) {
    console.log("Migrating sales table...");
    
    db.exec("ALTER TABLE sales RENAME TO sales_old");
    
    db.exec(`
      CREATE TABLE sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        selling_price REAL NOT NULL,
        total_price REAL NOT NULL,
        profit REAL NOT NULL DEFAULT 0,
        sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    
    // Migrate sales data (calculate selling_price from total_price / quantity)
    db.exec(`
      INSERT INTO sales (id, product_id, quantity, selling_price, total_price, profit, sale_date)
      SELECT 
        s.id, 
        s.product_id, 
        s.quantity, 
        s.total_price / s.quantity,
        s.total_price,
        0,
        s.sale_date
      FROM sales_old s
    `);
    
    db.exec("DROP TABLE sales_old");
    console.log("Sales table migrated successfully!");
  }

  // Create purchases table if it doesn't exist
  const hasPurchasesTable = tables.some((t: any) => t.name === "purchases");
  if (!hasPurchasesTable) {
    console.log("Creating purchases table...");
    db.exec(`
      CREATE TABLE purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        buying_price REAL NOT NULL,
        total_cost REAL NOT NULL,
        supplier TEXT,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    console.log("Purchases table created!");
  }

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
    CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
    CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product_id);
  `);

  console.log("Migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}
