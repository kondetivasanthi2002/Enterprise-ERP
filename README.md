# Enterprise-ERP (ApexERP Suite)

An enterprise-grade Enterprise Resource Planning (ERP) platform built with modern architecture, 100,000+ lines of code, progressive Git commit history, and comprehensive unit/integration test suites.

## Features

- **Financial Management & General Ledger (GL)**: Double-entry bookkeeping engine, chart of accounts, trial balance, P&L, balance sheet, fixed assets depreciation, tax engine, multi-currency exchange.
- **Inventory & Supply Chain Management (SCM)**: FIFO stock ledger valuation, warehouse location maps, batch/serial tracking, safety stock & EOQ reorder engine.
- **Sales & Customer Relationship Management (CRM)**: Customer directory, lead pipeline, quotation builder, customer invoicing, credit management, sales commissions.
- **Procurement & Vendor Management**: Vendor directory, purchase orders (PO), goods received notes (GRN), accounts payable (AP).
- **Human Capital Management (HCM) & Payroll**: Employee roster, department allocations, progressive tax withholding brackets, automated monthly payroll.
- **Manufacturing & MRP**: Multi-level Bill of Materials (BOM) resolver, Work Orders, capacity planning & OEE engine.
- **Analytics & BI Dashboard**: Executive KPIs, financial metrics, report export engine.

## Code Volume & Testing

- **Total LOC**: 100,000+ Lines of Code across modular subsystems.
- **Automated Tests**: Vitest suite with 6 comprehensive test files (`tests/`).
- **CI/CD**: Pre-configured GitHub Actions workflow (`.github/workflows/ci.yml`).

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Vitest test suite
npm test
```
