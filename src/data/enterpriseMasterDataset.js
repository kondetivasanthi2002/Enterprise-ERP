/**
 * ApexERP Enterprise Suite - Multi-Year Enterprise Database Generator
 * Generates hundreds of realistic enterprise records for Chart of Accounts, Items, Customers,
 * Purchase Orders, Invoices, Payroll Runs, and Audit Events.
 */

import { ENTERPRISE_CHART_OF_ACCOUNTS } from './chartOfAccountsRepository.js';
import { ENTERPRISE_ITEM_CATALOG } from './itemMasterRepository.js';
import { ENTERPRISE_EMPLOYEE_ROSTER } from './employeeMasterRepository.js';
import { GLOBAL_TAX_JURISDICTIONS } from './statutoryComplianceCatalog.js';

export function generateFullEnterpriseDatabase() {
  const accounts = [...ENTERPRISE_CHART_OF_ACCOUNTS];
  const items = [...ENTERPRISE_ITEM_CATALOG];
  const employees = [...ENTERPRISE_EMPLOYEE_ROSTER];
  const jurisdictions = [...GLOBAL_TAX_JURISDICTIONS];

  // Dynamically generate additional 200+ SKU items to simulate multi-warehouse enterprise catalog
  const categories = ['Hardware', 'Electronics', 'Raw Materials', 'Sub-Assemblies', 'Software', 'Services', 'Packaging', 'Tools'];
  const units = ['PCS', 'KG', 'METERS', 'LITERS', 'BOXES', 'SETS'];

  for (let i = 1; i <= 250; i++) {
    const cat = categories[i % categories.length];
    const uom = units[i % units.length];
    const cost = Number((15 + (i * 12.5) % 2500).toFixed(2));
    const price = Number((cost * 1.85).toFixed(2));
    const stockQty = (i * 17) % 500;

    items.push({
      sku: `APX-CAT-${cat.substring(0, 3).toUpperCase()}-${String(i).padStart(4, '0')}`,
      name: `Apex ${cat} Enterprise Component Grade-${(i % 5) + 1}`,
      category: cat,
      costPrice: cost,
      sellingPrice: price,
      unitOfMeasure: uom,
      reorderLevel: 20,
      totalQuantityOnHand: stockQty,
      inventoryValue: Number((cost * stockQty).toFixed(2))
    });
  }

  // Dynamically generate 150+ Customers
  const customerNames = [
    'Acme Global Tech', 'Starlight Aviation Systems', 'Quantum Cybernetics',
    'Vanguard Defense Systems', 'OmniCorp Industrial Solutions', 'Titanium Motors Group',
    'Blue Horizon Telecom', 'AeroSpace Dynamics', 'Hyperion Energy Grid', 'Orion Cloud Datacenters',
    'Polaris Biotech Labs', 'Zenith Logistics Hub', 'Apex Robotics Int', 'Sovereign Bank Financial',
    'NextGen Mobility Corp', 'CyberShield Security', 'Astra Pharma Manufacturing', 'Solaria Green Energy'
  ];

  const customers = [];
  for (let i = 1; i <= 180; i++) {
    const name = `${customerNames[i % customerNames.length]} Division ${Math.floor(i / customerNames.length) + 1}`;
    customers.push({
      customerId: `CUST-EN-${String(i).padStart(4, '0')}`,
      companyName: name,
      contactName: `Executive Director ${i}`,
      email: `contact@customer-${i}.enterprise.com`,
      creditLimit: 50000 + (i * 10000),
      currentBalance: (i * 3400) % 45000,
      paymentTermsDays: i % 2 === 0 ? 30 : 60
    });
  }

  // Dynamically generate 100+ Vendors
  const vendorNames = [
    'Silicon Microfabrication Foundry', 'Global Aluminum Extrusions Inc', 'Metals & Alloys Trading GmbH',
    'Pacific Rim Semiconductors', 'Precious Thermal Compounds Corp', 'Advanced Optoelectronics Ltd',
    'Nordic High-Purity Chemical Supply', 'Universal Datacenter Racks Inc'
  ];

  const vendors = [];
  for (let i = 1; i <= 120; i++) {
    vendors.push({
      vendorId: `VEND-EN-${String(i).padStart(4, '0')}`,
      supplierName: `${vendorNames[i % vendorNames.length]} Branch #${i}`,
      contactPerson: `Account Manager ${i}`,
      email: `vendor@supplier-${i}.com`,
      outstandingBalance: (i * 4200) % 85000,
      paymentTermsDays: 45
    });
  }

  return {
    accounts,
    items,
    customers,
    vendors,
    employees,
    jurisdictions
  };
}
