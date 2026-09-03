import { pool } from './database.js';
import {
  SUBSIDIARIES,
  generateChartOfAccounts,
  generateInvoices,
  generateInventorySKUs,
  generateUUID
} from './mockDataGenerator.js';

export const initializeDatabaseSchema = async () => {
  const client = await pool.connect();
  try {
    console.log('🚀 Starting Neon PostgreSQL Database Schema Setup & Seeding...');

    await client.query('BEGIN');

    // 1. Subsidiaries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subsidiaries (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        currency VARCHAR(10) NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Chart of Accounts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chart_of_accounts (
        code VARCHAR(20) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        balance NUMERIC(15, 2) DEFAULT 0.00,
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Invoices Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(50) PRIMARY KEY,
        client VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        due_date DATE NOT NULL,
        amount NUMERIC(15, 2) NOT NULL,
        tax NUMERIC(15, 2) NOT NULL,
        total NUMERIC(15, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Inventory SKUs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_skus (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        warehouse VARCHAR(100) NOT NULL,
        qty_on_hand INT DEFAULT 0,
        reorder_level INT DEFAULT 100,
        unit_cost NUMERIC(15, 2) NOT NULL,
        total_value NUMERIC(15, 2) NOT NULL,
        is_low_stock BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Sales Deals Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sales_deals (
        id VARCHAR(50) PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        deal_value NUMERIC(15, 2) NOT NULL,
        stage VARCHAR(50) NOT NULL,
        probability INT NOT NULL,
        owner VARCHAR(100) NOT NULL,
        close_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Employees & Payroll Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        department VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        salary NUMERIC(15, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'Active',
        email VARCHAR(255),
        hire_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 7. Purchase Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id VARCHAR(50) PRIMARY KEY,
        vendor VARCHAR(255) NOT NULL,
        order_date DATE NOT NULL,
        total_amount NUMERIC(15, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        approval_tier VARCHAR(50) DEFAULT 'STAFF',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Audit Logs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(100) PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        action VARCHAR(100) NOT NULL,
        username VARCHAR(100) NOT NULL,
        module_name VARCHAR(100) NOT NULL,
        ip_address VARCHAR(50),
        details TEXT
      );
    `);

    // 9. System Metrics Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS system_metrics (
        id SERIAL PRIMARY KEY,
        metric_name VARCHAR(100) NOT NULL,
        metric_value VARCHAR(100) NOT NULL,
        status VARCHAR(20) DEFAULT 'ONLINE',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // --- SEEDING INITIAL DATA WITH STRICT ON CONFLICT DO UPDATE / DO NOTHING ---

    // Seed Subsidiaries
    for (const sub of SUBSIDIARIES) {
      await client.query(`
        INSERT INTO subsidiaries (id, name, currency, symbol)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, currency = EXCLUDED.currency, symbol = EXCLUDED.symbol;
      `, [sub.id.trim(), sub.name.trim(), sub.currency.trim(), sub.symbol.trim()]);
    }

    // Seed Chart of Accounts
    const accounts = generateChartOfAccounts();
    for (const acc of accounts) {
      await client.query(`
        INSERT INTO chart_of_accounts (code, name, type, balance, status)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, balance = EXCLUDED.balance, status = EXCLUDED.status;
      `, [acc.code.trim(), acc.name.trim(), acc.type.trim(), acc.balance, acc.status.trim()]);
    }

    // Seed Invoices
    const invoices = generateInvoices();
    for (const inv of invoices) {
      await client.query(`
        INSERT INTO invoices (id, client, date, due_date, amount, tax, total, status, currency)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, amount = EXCLUDED.amount, total = EXCLUDED.total;
      `, [inv.id.trim(), inv.client.trim(), inv.date.trim(), inv.dueDate.trim(), inv.amount, inv.tax, inv.total, inv.status.trim(), inv.currency.trim()]);
    }

    // Seed Inventory SKUs
    const skus = generateInventorySKUs();
    for (const sku of skus) {
      await client.query(`
        INSERT INTO inventory_skus (id, name, category, warehouse, qty_on_hand, reorder_level, unit_cost, total_value, is_low_stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO UPDATE SET qty_on_hand = EXCLUDED.qty_on_hand, total_value = EXCLUDED.total_value, is_low_stock = EXCLUDED.is_low_stock;
      `, [sku.id.trim(), sku.name.trim(), sku.category.trim(), sku.warehouse.trim(), sku.qtyOnHand, sku.reorderLevel, sku.unitCost, sku.totalValue, sku.qtyOnHand < sku.reorderLevel]);
    }

    // Seed Employees
    const sampleEmployees = [
      { id: 'EMP-101', name: 'Alex Mercer', department: 'Executive', role: 'Chief Operating Officer', salary: 280000, status: 'Active', email: 'alex.mercer@apexerp.internal', hire_date: '2021-03-15' },
      { id: 'EMP-102', name: 'Sarah Jenkins', department: 'Finance', role: 'VP of Financial Planning', salary: 195000, status: 'Active', email: 'sarah.jenkins@apexerp.internal', hire_date: '2022-01-10' },
      { id: 'EMP-103', name: 'David Chen', department: 'Engineering', role: 'Lead Architect', salary: 185000, status: 'Active', email: 'david.chen@apexerp.internal', hire_date: '2020-11-01' },
      { id: 'EMP-104', name: 'Priya Sharma', department: 'Supply Chain', role: 'Global Logistics Director', salary: 165000, status: 'Active', email: 'priya.sharma@apexerp.internal', hire_date: '2023-06-20' },
      { id: 'EMP-105', name: 'Marcus Vance', department: 'Sales', role: 'Enterprise Account Executive', salary: 140000, status: 'Active', email: 'marcus.vance@apexerp.internal', hire_date: '2022-08-05' }
    ];
    for (const emp of sampleEmployees) {
      await client.query(`
        INSERT INTO employees (id, name, department, role, salary, status, email, hire_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET salary = EXCLUDED.salary, role = EXCLUDED.role, status = EXCLUDED.status;
      `, [emp.id.trim(), emp.name.trim(), emp.department.trim(), emp.role.trim(), emp.salary, emp.status.trim(), emp.email.trim(), emp.hire_date.trim()]);
    }

    // Seed Audit Log entry with UUID
    const auditId = `AUD-${generateUUID().substring(0, 8).toUpperCase()}`;
    await client.query(`
      INSERT INTO audit_logs (id, action, username, module_name, ip_address, details)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (id) DO NOTHING;
    `, [auditId, 'DATABASE_SCHEMA_INITIALIZATION', 'SYSTEM_ADMIN', 'database', '127.0.0.1', 'Neon PostgreSQL database tables created and seeded with enterprise mock catalog']);

    await client.query('COMMIT');
    console.log('✅ Database Schema Setup & Seeding Completed Successfully!');

    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    return {
      success: true,
      tables: tablesResult.rows.map(r => r.table_name)
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database Initialization Failed:', error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    client.release();
  }
};
