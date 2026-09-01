/**
 * ApexERP Enterprise Item Master Catalog Repository
 * Comprehensive catalog of industrial products, sub-assemblies, and raw materials.
 */

export const ENTERPRISE_ITEM_CATALOG = [
  // FINISHED GOODS - HARDWARE & SERVERS
  { sku: 'APX-SER-001', name: 'ApexERP Enterprise Server 1U Rack Mount', category: 'Hardware', costPrice: 1200.00, sellingPrice: 3500.00, unitOfMeasure: 'PCS', reorderLevel: 10, totalQuantityOnHand: 85, inventoryValue: 102000.00 },
  { sku: 'APX-SER-002', name: 'ApexERP Enterprise High-Density 4U Blade Cluster', category: 'Hardware', costPrice: 4800.00, sellingPrice: 12500.00, unitOfMeasure: 'PCS', reorderLevel: 5, totalQuantityOnHand: 24, inventoryValue: 115200.00 },
  { sku: 'APX-IOT-500', name: 'Industrial IoT Telemetry Sensor Gateway v2', category: 'Hardware', costPrice: 320.00, sellingPrice: 750.00, unitOfMeasure: 'PCS', reorderLevel: 25, totalQuantityOnHand: 180, inventoryValue: 57600.00 },
  { sku: 'APX-MOD-800', name: 'Ruggedized Warehouse Mobile RFID Scanner', category: 'Hardware', costPrice: 450.00, sellingPrice: 990.00, unitOfMeasure: 'PCS', reorderLevel: 15, totalQuantityOnHand: 65, inventoryValue: 29250.00 },
  { sku: 'APX-CAM-900', name: 'AI Machine Vision Assembly Line Camera', category: 'Hardware', costPrice: 890.00, sellingPrice: 2200.00, unitOfMeasure: 'PCS', reorderLevel: 8, totalQuantityOnHand: 32, inventoryValue: 28480.00 },

  // SUB-ASSEMBLIES & ELECTRONICS
  { sku: 'SUB-PCB-101', name: 'ARM Cortex H7 Dual-Core Controller PCB', category: 'Electronics', costPrice: 85.00, sellingPrice: 180.00, unitOfMeasure: 'PCS', reorderLevel: 50, totalQuantityOnHand: 450, inventoryValue: 38250.00 },
  { sku: 'SUB-PWR-202', name: 'Redundant 80-Plus Platinum 1200W Power Supply Unit', category: 'Electronics', costPrice: 140.00, sellingPrice: 290.00, unitOfMeasure: 'PCS', reorderLevel: 30, totalQuantityOnHand: 220, inventoryValue: 30800.00 },
  { sku: 'SUB-MEM-303', name: '64GB DDR5 ECC Registered Server Memory Module', category: 'Electronics', costPrice: 190.00, sellingPrice: 380.00, unitOfMeasure: 'PCS', reorderLevel: 100, totalQuantityOnHand: 580, inventoryValue: 110200.00 },
  { sku: 'SUB-SSD-404', name: '3.84TB Enterprise NVMe U.2 SSD Storage', category: 'Electronics', costPrice: 380.00, sellingPrice: 790.00, unitOfMeasure: 'PCS', reorderLevel: 40, totalQuantityOnHand: 290, inventoryValue: 110200.00 },

  // RAW MATERIALS & METALS
  { sku: 'RAW-ALU-6001', name: 'Aerospace Grade 6061-T6 Aluminum Billet', category: 'Raw Materials', costPrice: 45.00, sellingPrice: 90.00, unitOfMeasure: 'KG', reorderLevel: 200, totalQuantityOnHand: 1450, inventoryValue: 65250.00 },
  { sku: 'RAW-COP-6002', name: 'High-Purity Oxygen-Free Copper Sheet (2mm)', category: 'Raw Materials', costPrice: 85.00, sellingPrice: 160.00, unitOfMeasure: 'KG', reorderLevel: 100, totalQuantityOnHand: 890, inventoryValue: 75650.00 },
  { sku: 'RAW-SIL-6003', name: 'Thermal Conductive Silicone Paste', category: 'Raw Materials', costPrice: 18.00, sellingPrice: 40.00, unitOfMeasure: 'KG', reorderLevel: 50, totalQuantityOnHand: 340, inventoryValue: 6120.00 }
];
