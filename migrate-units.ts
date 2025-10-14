import Database from "better-sqlite3";
import path from "path";

// Migration script for unit conversion
const dbPath = path.join(process.cwd(), "shop.db");
const db = new Database(dbPath);

console.log("Starting unit conversion migration...");

try {
  // Check if products table needs unit columns
  const columns: any[] = db.prepare("PRAGMA table_info(products)").all();
  const hasUnitColumns = columns.some(col => col.name === "unit_type");

  if (!hasUnitColumns) {
    console.log("Adding unit conversion columns to products...");
    
    // Add columns for unit conversion
    db.exec(`
      ALTER TABLE products ADD COLUMN unit_type TEXT DEFAULT 'piece';
      ALTER TABLE products ADD COLUMN units_per_package INTEGER DEFAULT 1;
      ALTER TABLE products ADD COLUMN package_name TEXT;
    `);
    
    console.log("Unit conversion columns added successfully!");
  }

  console.log("Migration completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  db.close();
}
