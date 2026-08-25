/**
 * Test Case 2: FIFO Inventory Valuation & Stock Movement Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { InventoryEngine } from '../src/engine/inventory/stockEngine.js';

describe('FIFO Inventory Valuation Engine', () => {
  let inventory;

  beforeEach(() => {
    const items = [
      { sku: 'TEST-ITEM-01', name: 'Test Component', category: 'Raw Materials', costPrice: 10, reorderLevel: 5, totalQuantityOnHand: 0 }
    ];
    inventory = new InventoryEngine(items);
  });

  it('should receive stock batches and consume them strictly in FIFO order', () => {
    // Receive Batch 1: 10 units @ $10 ($100 total)
    inventory.receiveStock({ sku: 'TEST-ITEM-01', quantity: 10, unitCost: 10 });
    // Receive Batch 2: 10 units @ $20 ($200 total)
    inventory.receiveStock({ sku: 'TEST-ITEM-01', quantity: 10, unitCost: 20 });

    const itemAfterReceiving = inventory.getItem('TEST-ITEM-01');
    expect(itemAfterReceiving.totalQuantityOnHand).toBe(20);
    expect(itemAfterReceiving.inventoryValue).toBe(300);

    // Issue 15 units -> Must consume all 10 units from Batch 1 ($10/ea) + 5 units from Batch 2 ($20/ea)
    // Expected COGS = (10 * 10) + (5 * 20) = 100 + 100 = $200
    const issueResult = inventory.issueStock({ sku: 'TEST-ITEM-01', quantity: 15 });

    expect(issueResult.totalCostOfGoodsSold).toBe(200);

    const itemAfterIssue = inventory.getItem('TEST-ITEM-01');
    expect(itemAfterIssue.totalQuantityOnHand).toBe(5);
    expect(itemAfterIssue.inventoryValue).toBe(100); // 5 units remaining @ $20
  });

  it('should prevent issuing more stock than available on hand', () => {
    inventory.receiveStock({ sku: 'TEST-ITEM-01', quantity: 5, unitCost: 10 });

    expect(() => inventory.issueStock({ sku: 'TEST-ITEM-01', quantity: 10 })).toThrow(/Insufficient stock/i);
  });
});
