/**
 * ApexERP Enterprise Manufacturing - Bill of Materials (BOM) & Work Order Engine
 */

import { WORK_ORDER_STATUS } from '../../models/schemas.js';
import { GlobalAuditLogger } from '../core/auditLog.js';
import { GlobalEventBus } from '../core/eventBus.js';

export class ManufacturingEngine {
  constructor(boms = [], inventoryEngine = null, ledgerEngine = null) {
    this.bomsMap = new Map();
    this.workOrders = [];
    this.inventoryEngine = inventoryEngine;
    this.ledgerEngine = ledgerEngine;

    boms.forEach(b => this.bomsMap.set(b.bomId, { ...b }));
  }

  getBOM(bomId) {
    const b = this.bomsMap.get(bomId);
    if (!b) throw new Error(`Bill of Materials '${bomId}' not found.`);
    return b;
  }

  /**
   * Resolve multi-level BOM components and calculate manufacturing unit cost
   */
  calculateBOMCost(bomId) {
    const bom = this.getBOM(bomId);
    let totalComponentCost = 0;

    const resolvedComponents = bom.components.map(comp => {
      let unitCost = comp.unitCost || 0;
      if (this.inventoryEngine && this.inventoryEngine.itemsMap.has(comp.componentSku)) {
        unitCost = this.inventoryEngine.getItem(comp.componentSku).costPrice || unitCost;
      }

      const totalQty = comp.quantityRequired * (1 + (comp.scrapFactorPercentage || 0) / 100);
      const lineCost = totalQty * unitCost;
      totalComponentCost += lineCost;

      return {
        componentSku: comp.componentSku,
        quantityRequired: comp.quantityRequired,
        scrapFactorPercentage: comp.scrapFactorPercentage || 0,
        totalQtyWithScrap: Number(totalQty.toFixed(2)),
        unitCost: Number(unitCost.toFixed(2)),
        lineCost: Number(lineCost.toFixed(2))
      };
    });

    return {
      bomId: bom.bomId,
      parentItemSku: bom.parentItemSku,
      resolvedComponents,
      totalEstimatedCost: Number(totalComponentCost.toFixed(2))
    };
  }

  /**
   * Create Work Order for Production
   */
  createWorkOrder({ bomId, targetQuantity, plannedStartDate = null, user = null }) {
    const bomCosting = this.calculateBOMCost(bomId);
    const totalProductionCost = Number((bomCosting.totalEstimatedCost * targetQuantity).toFixed(2));

    const workOrder = {
      workOrderId: `WO-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bomId,
      parentItemSku: bomCosting.parentItemSku,
      targetQuantity,
      completedQuantity: 0,
      status: WORK_ORDER_STATUS.RELEASED,
      plannedStartDate: plannedStartDate || new Date().toISOString(),
      unitCost: bomCosting.totalEstimatedCost,
      totalProductionCost,
      componentsNeeded: bomCosting.resolvedComponents.map(c => ({
        ...c,
        totalRequiredForRun: Number((c.totalQtyWithScrap * targetQuantity).toFixed(2))
      }))
    };

    this.workOrders.unshift(workOrder);
    GlobalAuditLogger.logEvent({ user, action: 'CREATE_WORK_ORDER', entity: 'WorkOrder', entityId: workOrder.workOrderId, newState: workOrder });
    return workOrder;
  }

  /**
   * Complete Work Order Run -> Consumes Component Stock & Receives Finished Product Stock
   */
  completeWorkOrderRun({ workOrderId, quantityProduced, user = null }) {
    const wo = this.workOrders.find(w => w.workOrderId === workOrderId);
    if (!wo) throw new Error(`Work Order '${workOrderId}' not found.`);

    if (quantityProduced <= 0) throw new Error('Quantity produced must be greater than zero.');

    // 1. Consume Raw Materials from Inventory
    wo.componentsNeeded.forEach(comp => {
      const qtyToConsume = (comp.totalQtyWithScrap * quantityProduced);
      if (this.inventoryEngine) {
        this.inventoryEngine.issueStock({
          sku: comp.componentSku,
          quantity: qtyToConsume,
          movementType: 'PRODUCTION_CONSUMPTION',
          reference: `Work Order ${workOrderId}`,
          user
        });
      }
    });

    // 2. Receive Finished Goods into Inventory
    if (this.inventoryEngine) {
      this.inventoryEngine.receiveStock({
        sku: wo.parentItemSku,
        quantity: quantityProduced,
        unitCost: wo.unitCost,
        movementType: 'PRODUCTION_OUTPUT',
        reference: `Work Order Completion ${workOrderId}`,
        user
      });
    }

    wo.completedQuantity += quantityProduced;
    if (wo.completedQuantity >= wo.targetQuantity) {
      wo.status = WORK_ORDER_STATUS.COMPLETED;
    } else {
      wo.status = WORK_ORDER_STATUS.IN_PROGRESS;
    }

    GlobalAuditLogger.logEvent({ user, action: 'COMPLETE_WORK_ORDER_RUN', entity: 'WorkOrder', entityId: workOrderId, newState: wo });
    GlobalEventBus.publish('WORK_ORDER_RUN_COMPLETED', { workOrderId, quantityProduced });

    return wo;
  }
}
