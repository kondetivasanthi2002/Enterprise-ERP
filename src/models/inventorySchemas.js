/**
 * ApexERP Enterprise Supply Chain - Detailed Inventory, Warehouse & Logistics Schemas
 * Comprehensive field specifications, validation matrices, and metadata definitions.
 */

export const WAREHOUSE_TYPES = {
  CENTRAL_DISTRIBUTION_CENTER: 'CENTRAL_DISTRIBUTION_CENTER',
  REGIONAL_HUB: 'REGIONAL_HUB',
  MANUFACTURING_STORE: 'MANUFACTURING_STORE',
  TRANSIT_HUB: 'TRANSIT_HUB',
  THIRD_PARTY_LOGISTICS_3PL: 'THIRD_PARTY_LOGISTICS_3PL',
  RETURNS_DISPOSITION: 'RETURNS_DISPOSITION'
};

export const STORAGE_TEMPERATURE_ZONES = {
  AMBIENT: 'AMBIENT',
  CONTROLLED_ROOM_TEMPERATURE: 'CONTROLLED_ROOM_TEMPERATURE',
  REFRIGERATED_COLD_CHAIN: 'REFRIGERATED_COLD_CHAIN',
  FROZEN_DEEP_COLD: 'FROZEN_DEEP_COLD',
  HAZARDOUS_CONTAINMENT: 'HAZARDOUS_CONTAINMENT'
};

export const HAZMAT_CLASSES = {
  CLASS_1_EXPLOSIVES: 'CLASS_1_EXPLOSIVES',
  CLASS_2_GASES: 'CLASS_2_GASES',
  CLASS_3_FLAMMABLE_LIQUIDS: 'CLASS_3_FLAMMABLE_LIQUIDS',
  CLASS_4_FLAMMABLE_SOLIDS: 'CLASS_4_FLAMMABLE_SOLIDS',
  CLASS_5_OXIDIZERS: 'CLASS_5_OXIDIZERS',
  CLASS_6_TOXIC_SUBSTANCES: 'CLASS_6_TOXIC_SUBSTANCES',
  CLASS_7_RADIOACTIVE: 'CLASS_7_RADIOACTIVE',
  CLASS_8_CORROSIVES: 'CLASS_8_CORROSIVES',
  CLASS_9_MISCELLANEOUS_HAZMAT: 'CLASS_9_MISCELLANEOUS_HAZMAT',
  NOT_APPLICABLE: 'NOT_APPLICABLE'
};

export const ITEM_CATEGORIES_REGISTRY = [
  { categoryId: 'CAT-HW-SER', name: 'Rackmount & Blade Datacenter Servers', parentCategory: 'Hardware', defaultValuation: 'FIFO', assetAccountCode: '12100' },
  { categoryId: 'CAT-HW-IOT', name: 'Industrial Edge IoT Telemetry Sensors', parentCategory: 'Hardware', defaultValuation: 'FIFO', assetAccountCode: '12200' },
  { categoryId: 'CAT-HW-RUG', name: 'Ruggedized Mobile Handheld Terminals', parentCategory: 'Hardware', defaultValuation: 'FIFO', assetAccountCode: '12200' },
  { categoryId: 'CAT-EL-PCB', name: 'Surface Mount Controller Circuit Boards', parentCategory: 'Electronics', defaultValuation: 'WEIGHTED_AVERAGE', assetAccountCode: '12500' },
  { categoryId: 'CAT-EL-MEM', name: 'DRAM Memory Modules & NVMe SSDs', parentCategory: 'Electronics', defaultValuation: 'FIFO', assetAccountCode: '12500' },
  { categoryId: 'CAT-RM-MET', name: 'Aerospace Grade Aluminum & Copper Billets', parentCategory: 'Raw Materials', defaultValuation: 'WEIGHTED_AVERAGE', assetAccountCode: '12400' },
  { categoryId: 'CAT-RM-CHM', name: 'Thermal Pastes & Encapsulation Resins', parentCategory: 'Raw Materials', defaultValuation: 'FIFO', assetAccountCode: '12400' }
];

export const HARMONIZED_SYSTEM_HS_CODES = [
  { hsCode: '8471.50.01', description: 'Processing units for digital automatic data processing machines', importDutyRatePercent: 0.0, exportRebateRatePercent: 13.0 },
  { hsCode: '8517.62.00', description: 'Machines for the reception, conversion and transmission of voice/data', importDutyRatePercent: 2.5, exportRebateRatePercent: 13.0 },
  { hsCode: '8534.00.00', description: 'Printed circuits for industrial controller assemblies', importDutyRatePercent: 3.2, exportRebateRatePercent: 10.0 },
  { hsCode: '7604.29.00', description: 'Bars, rods and profiles of aluminum alloys', importDutyRatePercent: 5.0, exportRebateRatePercent: 0.0 }
];

export const InventorySchemaDefinitions = {
  WarehouseLocationSchema: {
    locationId: { type: 'string', primaryKey: true },
    warehouseName: { type: 'string', required: true },
    type: { type: 'enum', values: Object.values(WAREHOUSE_TYPES), required: true },
    temperatureZone: { type: 'enum', values: Object.values(STORAGE_TEMPERATURE_ZONES), default: STORAGE_TEMPERATURE_ZONES.AMBIENT },
    addressStreet: { type: 'string' },
    city: { type: 'string' },
    stateProvince: { type: 'string' },
    postalCode: { type: 'string' },
    countryCode: { type: 'string', default: 'US' },
    totalCapacityCubicMeters: { type: 'number', default: 10000 },
    currentUtilizedCubicMeters: { type: 'number', default: 0 }
  },

  WarehouseBinSchema: {
    binId: { type: 'string', primaryKey: true },
    warehouseId: { type: 'string', required: true },
    aisleNumber: { type: 'string', required: true },
    rackNumber: { type: 'string', required: true },
    shelfLevel: { type: 'string', required: true },
    binPosition: { type: 'string', required: true },
    maxWeightCapacityKg: { type: 'number', default: 1000 },
    isOccupied: { type: 'boolean', default: false },
    assignedSku: { type: 'string', nullable: true }
  },

  BatchLotMasterSchema: {
    batchNumber: { type: 'string', primaryKey: true },
    sku: { type: 'string', required: true },
    manufactureDate: { type: 'date', required: true },
    expirationDate: { type: 'date', nullable: true },
    countryOfOrigin: { type: 'string', default: 'US' },
    qualityStatus: { type: 'enum', values: ['PASSED', 'QUARANTINE', 'REJECTED'], default: 'PASSED' },
    certificateOfAnalysisNumber: { type: 'string', nullable: true }
  }
};
