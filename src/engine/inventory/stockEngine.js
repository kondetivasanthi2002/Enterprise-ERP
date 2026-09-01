/**
 * ApexERP Enterprise Supply Chain - FIFO Inventory Valuation Engine
 */

import { STOCK_MOVEMENT_TYPES, STOCK_VALUATION_METHODS } from '../../models/schemas.js';
import { GlobalAuditLogger } from '../core/auditLog.js';
import { GlobalEventBus } from '../core/eventBus.js';

export class InventoryEngine {
  constructor(initialItems = [], initialMovements = []) {
    this.itemsMap = new Map();
    // FIFO Queue mapping: SKU -> Array of { qty, unitCost, batchNo, receivedDate }
    this.fifoQueuesMap = new Map();
    this.movementLedger = [];

    initialItems.forEach(item => {
      this.itemsMap.set(item.sku, { ...item, totalQuantityOnHand: 0, inventoryValue: 0 });
      this.fifoQueuesMap.set(item.sku, []);
      if (item.totalQuantityOnHand > 0) {
        this.receiveStock({
          sku: item.sku,
          quantity: item.totalQuantityOnHand,
          unitCost: item.costPrice || 10,
          movementType: STOCK_MOVEMENT_TYPES.INBOUND_PURCHASE,
          reference: 'INITIAL_BALANCE'
        });
      }
    });

    initialMovements.forEach(m => this.movementLedger.push(m));
  }

  getItem(sku) {
    const item = this.itemsMap.get(sku);
    if (!item) throw new Error(`Item with SKU '${sku}' not found in Item Master.`);
    return item;
  }

  getAllItems() {
    return Array.from(this.itemsMap.values());
  }

  /**
   * Receive stock (Inbound Purchase or Production Output) -> Adds batch to FIFO Queue
   */
  receiveStock({ sku, quantity, unitCost, batchNo = null, warehouseId = 'WH-MAIN', movementType = STOCK_MOVEMENT_TYPES.INBOUND_PURCHASE, reference = '', user = null }) {
    if (quantity <= 0) throw new Error('Received stock quantity must be greater than zero.');
    if (unitCost < 0) throw new Error('Unit cost cannot be negative.');

    const item = this.getItem(sku);
    const fifoQueue = this.fifoQueuesMap.get(sku) || [];

    const batchRecord = {
      batchId: `BATCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      batchNo: batchNo || `B-${Date.now()}`,
      quantity: Number(quantity),
      remainingQuantity: Number(quantity),
      unitCost: Number(unitCost),
      receivedDate: new Date().toISOString()
    };

    fifoQueue.push(batchRecord);
    this.fifoQueuesMap.set(sku, fifoQueue);

    item.totalQuantityOnHand += Number(quantity);
    item.inventoryValue = Number((item.inventoryValue + (quantity * unitCost)).toFixed(2));
    item.costPrice = Number((item.inventoryValue / (item.totalQuantityOnHand || 1)).toFixed(2)); // Weighted Avg Cost fallback indicator

    const movement = {
      id: `STK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      sku,
      itemName: item.name,
      movementType,
      quantityChange: Number(quantity),
      unitCost: Number(unitCost),
      totalValue: Number((quantity * unitCost).toFixed(2)),
      warehouseId,
      reference,
      balanceAfter: item.totalQuantityOnHand
    };

    this.movementLedger.unshift(movement);

    GlobalAuditLogger.logEvent({ user, action: 'STOCK_RECEIVE', entity: 'ItemMaster', entityId: sku, newState: movement });
    GlobalEventBus.publish('STOCK_RECEIVED', movement);

    return { item, movement, batchRecord };
  }

  /**
   * Issue stock (Outbound Sales or Production Consumption) using FIFO (First-In, First-Out)
   */
  issueStock({ sku, quantity, warehouseId = 'WH-MAIN', movementType = STOCK_MOVEMENT_TYPES.OUTBOUND_SALES, reference = '', user = null }) {
    if (quantity <= 0) throw new Error('Stock issue quantity must be greater than zero.');

    const item = this.getItem(sku);
    if (item.totalQuantityOnHand < quantity) {
      throw new Error(`Insufficient stock for SKU '${sku}' (${item.name}). Available: ${item.totalQuantityOnHand}, Requested: ${quantity}.`);
    }

    const fifoQueue = this.fifoQueuesMap.get(sku) || [];
    let remainingToIssue = Number(quantity);
    let totalCostOfGoodsSold = 0;
    const consumedBatches = [];

    while (remainingToIssue > 0 && fifoQueue.length > 0) {
      const currentBatch = fifoQueue[0];
      const qtyFromBatch = Math.min(remainingToIssue, currentBatch.remainingQuantity);

      currentBatch.remainingQuantity -= qtyFromBatch;
      totalCostOfGoodsSold += (qtyFromBatch * currentBatch.unitCost);
      remainingToIssue -= qtyFromBatch;

      consumedBatches.push({
        batchId: currentBatch.batchId,
        qtyTaken: qtyFromBatch,
        unitCost: currentBatch.unitCost
      });

      if (currentBatch.remainingQuantity === 0) {
        fifoQueue.shift(); // FIFO: Remove depleted batch from head of queue
      }
    }

    item.totalQuantityOnHand -= Number(quantity);
    item.inventoryValue = Number((item.inventoryValue - totalCostOfGoodsSold).toFixed(2));
    if (item.inventoryValue < 0) item.inventoryValue = 0;
    item.costPrice = item.totalQuantityOnHand > 0 ? Number((item.inventoryValue / item.totalQuantityOnHand).toFixed(2)) : item.costPrice;

    const unitCOGS = Number((totalCostOfGoodsSold / quantity).toFixed(2));

    const movement = {
      id: `STK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      sku,
      itemName: item.name,
      movementType,
      quantityChange: -Number(quantity),
      unitCost: unitCOGS,
      totalValue: Number(totalCostOfGoodsSold.toFixed(2)),
      warehouseId,
      reference,
      consumedBatches,
      balanceAfter: item.totalQuantityOnHand
    };

    this.movementLedger.unshift(movement);

    // Check reorder alert
    if (item.totalQuantityOnHand <= item.reorderLevel) {
      GlobalEventBus.publish('STOCK_LOW_REORDER_ALERT', { sku, item, currentStock: item.totalQuantityOnHand, reorderLevel: item.reorderLevel });
    }

    GlobalAuditLogger.logEvent({ user, action: 'STOCK_ISSUE', entity: 'ItemMaster', entityId: sku, newState: movement });
    GlobalEventBus.publish('STOCK_ISSUED', movement);

    return { item, movement, totalCostOfGoodsSold: Number(totalCostOfGoodsSold.toFixed(2)) };
  }

  /**
   * Query Reorder Items
   */
  getLowStockItems() {
    return Array.from(this.itemsMap.values()).filter(item => item.totalQuantityOnHand <= item.reorderLevel);
  }
}
