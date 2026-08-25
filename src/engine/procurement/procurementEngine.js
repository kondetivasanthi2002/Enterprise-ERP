/**
 * ApexERP Enterprise Procurement & Vendor Management Engine
 */

import { PO_STATUS } from '../../models/schemas.js';
import { GlobalTaxEngine } from '../finance/taxEngine.js';
import { GlobalAuditLogger } from '../core/auditLog.js';
import { GlobalEventBus } from '../core/eventBus.js';

export class ProcurementEngine {
  constructor(initialVendors = [], initialPOs = [], inventoryEngine = null, ledgerEngine = null) {
    this.vendorsMap = new Map();
    this.purchaseOrders = [];
    this.vendorBills = [];
    this.inventoryEngine = inventoryEngine;
    this.ledgerEngine = ledgerEngine;

    initialVendors.forEach(v => this.vendorsMap.set(v.vendorId, { ...v }));
    initialPOs.forEach(po => this.purchaseOrders.push({ ...po }));
  }

  getVendor(vendorId) {
    const v = this.vendorsMap.get(vendorId);
    if (!v) throw new Error(`Vendor '${vendorId}' not found in Vendor Master.`);
    return v;
  }

  getAllVendors() {
    return Array.from(this.vendorsMap.values());
  }

  /**
   * Create Purchase Order (PO)
   */
  createPurchaseOrder({ vendorId, items = [], taxCode = 'VAT_STANDARD', expectedDeliveryDate = null, user = null }) {
    const vendor = this.getVendor(vendorId);

    let subTotal = 0;
    const processedItems = items.map(item => {
      const net = item.quantity * item.unitCost;
      subTotal += net;
      return {
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        receivedQuantity: 0,
        unitCost: item.unitCost,
        totalNet: Number(net.toFixed(2))
      };
    });

    const taxCalc = GlobalTaxEngine.calculateTax({ netAmount: subTotal, taxCode });

    const po = {
      poNumber: `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      vendorId,
      vendorName: vendor.supplierName,
      createdDate: new Date().toISOString(),
      expectedDeliveryDate: expectedDeliveryDate || new Date(Date.now() + 14 * 86400000).toISOString(),
      status: PO_STATUS.APPROVED,
      items: processedItems,
      subTotal: Number(subTotal.toFixed(2)),
      taxAmount: taxCalc.taxAmount,
      totalAmount: taxCalc.grossAmount
    };

    this.purchaseOrders.unshift(po);
    GlobalAuditLogger.logEvent({ user, action: 'CREATE_PURCHASE_ORDER', entity: 'PurchaseOrder', entityId: po.poNumber, newState: po });
    return po;
  }

  /**
   * Receive Goods against PO -> Updates Inventory via InventoryEngine & Posts Accounts Payable
   */
  receiveGoods({ poNumber, warehouseId = 'WH-MAIN', itemsReceived = [], user = null }) {
    const po = this.purchaseOrders.find(p => p.poNumber === poNumber);
    if (!po) throw new Error(`Purchase Order '${poNumber}' not found.`);

    let fullyReceived = true;
    let totalReceivedValue = 0;

    itemsReceived.forEach(rec => {
      const poItem = po.items.find(i => i.sku === rec.sku);
      if (poItem) {
        const qtyToReceive = Math.min(rec.quantityReceived, poItem.quantity - poItem.receivedQuantity);
        poItem.receivedQuantity += qtyToReceive;
        const value = qtyToReceive * poItem.unitCost;
        totalReceivedValue += value;

        if (this.inventoryEngine && qtyToReceive > 0) {
          this.inventoryEngine.receiveStock({
            sku: poItem.sku,
            quantity: qtyToReceive,
            unitCost: poItem.unitCost,
            warehouseId,
            reference: `GRN for ${poNumber}`,
            user
          });
        }
      }

      if (poItem && poItem.receivedQuantity < poItem.quantity) {
        fullyReceived = false;
      }
    });

    po.status = fullyReceived ? PO_STATUS.FULLY_RECEIVED : PO_STATUS.PARTIALLY_RECEIVED;

    // Post Vendor Bill into Accounts Payable
    const vendor = this.getVendor(po.vendorId);
    vendor.outstandingBalance = Number((vendor.outstandingBalance + po.totalAmount).toFixed(2));

    if (this.ledgerEngine) {
      this.ledgerEngine.postJournalEntry({
        description: `Vendor Bill for PO ${poNumber} (${vendor.supplierName})`,
        lineItems: [
          { accountCode: '12000', description: 'Inventory Control Asset', debit: po.subTotal, credit: 0 },
          { accountCode: '22000', description: 'Input VAT / Tax Receivable', debit: po.taxAmount, credit: 0 },
          { accountCode: '20000', description: 'Accounts Payable', debit: 0, credit: po.totalAmount }
        ]
      }, user);
    }

    GlobalAuditLogger.logEvent({ user, action: 'RECEIVE_GOODS_GRN', entity: 'PurchaseOrder', entityId: poNumber, newState: po });
    GlobalEventBus.publish('GOODS_RECEIVED_GRN', { poNumber, totalReceivedValue });

    return po;
  }
}
