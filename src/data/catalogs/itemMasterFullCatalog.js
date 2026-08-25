/**
 * ApexERP Enterprise Full Item Master Catalog
 * Comprehensive 2,000+ Stock Keeping Units (SKU) catalog.
 */

export const FULL_ITEM_MASTER_CATALOG = [];

const categories = [
  { name: 'Hardware', prefix: 'HW', count: 400 },
  { name: 'Electronics', prefix: 'EL', count: 400 },
  { name: 'Raw Materials', prefix: 'RM', count: 400 },
  { name: 'Sub-Assemblies', prefix: 'SA', count: 300 },
  { name: 'Software', prefix: 'SW', count: 200 },
  { name: 'Services', prefix: 'SV', count: 150 },
  { name: 'Consumables', prefix: 'CS', count: 150 }
];

const uoms = ['PCS', 'KG', 'METERS', 'LITERS', 'BOXES', 'ROLLS', 'HOURS'];

categories.forEach(cat => {
  for (let i = 1; i <= cat.count; i++) {
    const sku = `APX-${cat.prefix}-${String(i).padStart(4, '0')}`;
    const uom = uoms[i % uoms.length];
    const costPrice = Number((25.0 + ((i * 19.8) % 4500)).toFixed(2));
    const sellingPrice = Number((costPrice * 1.75).toFixed(2));
    const qty = (i * 13) % 800;

    FULL_ITEM_MASTER_CATALOG.push({
      sku,
      name: `Apex Enterprise ${cat.name} Item Grade-${(i % 5) + 1} #${i}`,
      category: cat.name,
      unitOfMeasure: uom,
      costPrice,
      sellingPrice,
      valuationMethod: 'FIFO',
      reorderLevel: 25,
      reorderQuantity: 100,
      totalQuantityOnHand: qty,
      inventoryValue: Number((costPrice * qty).toFixed(2)),
      isBatchTracked: i % 2 === 0,
      isSerialTracked: i % 3 === 0
    });
  }
});
