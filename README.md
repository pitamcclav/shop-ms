# Shop Management System

A simple shop management system built with Next.js 15, TypeScript, Tailwind CSS, and SQLite. No authentication required.

## Features

- **Product Management**
  - Add, edit, and delete products
  - Track product details: name, description, price, stock, category
  - Visual low stock alerts

- **Sales Tracking**
  - Record sales transactions
  - Automatic inventory updates
  - Sales history with product details

- **Dashboard**
  - Key metrics: total products, total sales, total revenue
  - Low stock alerts
  - Recent sales overview
  - Sales by category

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Code Quality**: Biome

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database

The SQLite database (`shop.db`) is automatically created on first run with the following tables:

- **products**: Store product information
- **sales**: Track sales transactions

The database file is located in the project root and is excluded from git.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a single product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Record a new sale

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Project Structure

```
shop-ms/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── products/
│   │   │   ├── sales/
│   │   │   └── stats/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ProductForm.tsx
│   │   └── SaleForm.tsx
│   ├── lib/
│   │   └── db.ts
│   └── types/
│       └── index.ts
├── public/
├── shop.db (auto-generated)
└── package.json
```

## Usage

### Adding Products
1. Navigate to the "Products" tab
2. Click "Add Product"
3. Fill in the product details
4. Click "Add Product" to save

### Recording Sales
1. Navigate to the "Sales" tab
2. Select a product from the dropdown
3. Enter the quantity
4. Click "Record Sale"
5. The inventory will be automatically updated

### Viewing Dashboard
1. Navigate to the "Dashboard" tab
2. View key metrics and statistics
3. Check low stock alerts
4. Review recent sales

## License

MIT
