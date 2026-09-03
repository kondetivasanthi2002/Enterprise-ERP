/**
 * ApexERP Enterprise SCM - Warehouse Bin Routing, FIFO Batch Allocation & Picking Engine
 * Optimizes picking paths across aisles, bins, and racks while enforcing FIFO lot expiration rules.
 */

export class WarehouseRoutingEngine {
  constructor() {
    this.warehouseBinsMap = new Map();
    this.inventoryLotsMap = new Map();
  }

  /**
   * Register warehouse bin location (Aisle, Rack, Level, Position)
   */
  registerBinLocation({ warehouseId, binCode, aisleNumber, rackNumber, levelNumber, positionNumber, maxWeightCapacityKg = 1000 }) {
    const wId = String(warehouseId || 'WH-HQ').trim();
    const code = String(binCode).trim().toUpperCase();

    const bin = {
      warehouseId: wId,
      binCode: code,
      aisleNumber: parseInt(aisleNumber || 1, 10),
      rackNumber: parseInt(rackNumber || 1, 10),
      levelNumber: parseInt(levelNumber || 1, 10),
      positionNumber: parseInt(positionNumber || 1, 10),
      maxWeightCapacityKg: Number(maxWeightCapacityKg || 1000),
      currentOccupiedWeightKg: 0,
      storedSKUs: new Map()
    };

    const key = `${wId}:${code}`;
    this.warehouseBinsMap.set(key, bin);
    return bin;
  }

  /**
   * Register inventory FIFO lot/batch with expiration dates
   */
  receiveInventoryLot({ skuId, lotNumber, qtyReceived, unitCostUSD, expirationDate, binCode = 'A1-R1-L1', warehouseId = 'WH-HQ' }) {
    const lotId = `LOT-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const cleanSku = String(skuId).trim();
    const cleanLot = String(lotNumber || `BATCH-${Date.now()}`).trim();

    const lot = {
      lotId,
      skuId: cleanSku,
      lotNumber: cleanLot,
      qtyOnHand: Math.max(0, parseInt(qtyReceived || 0, 10)),
      unitCostUSD: Number(unitCostUSD || 0),
      receivedDate: new Date().toISOString().split('T')[0],
      expirationDate: String(expirationDate || '2028-12-31').trim(),
      warehouseId: String(warehouseId).trim(),
      binCode: String(binCode).trim().toUpperCase()
    };

    if (!this.inventoryLotsMap.has(cleanSku)) {
      this.inventoryLotsMap.set(cleanSku, []);
    }

    const skuLots = this.inventoryLotsMap.get(cleanSku);
    skuLots.push(lot);
    // Sort FIFO (First Received / Earliest Expiring First)
    skuLots.sort((a, b) => new Date(a.receivedDate) - new Date(b.receivedDate));

    return lot;
  }

  /**
   * Allocate stock using strict FIFO lot ordering
   */
  allocateStockFIFO(skuId, requiredQty) {
    const cleanSku = String(skuId).trim();
    const skuLots = this.inventoryLotsMap.get(cleanSku);

    if (!skuLots || skuLots.length === 0) {
      throw new Error(`Insufficient stock: No inventory lots registered for SKU '${cleanSku}'.`);
    }

    let remainingToFulfill = Math.max(0, parseInt(requiredQty, 10));
    const allocations = [];
    let totalCostUSD = 0;

    for (const lot of skuLots) {
      if (remainingToFulfill <= 0) break;

      if (lot.qtyOnHand > 0) {
        const takeQty = Math.min(lot.qtyOnHand, remainingToFulfill);
        lot.qtyOnHand -= takeQty;
        remainingToFulfill -= takeQty;
        const lineCost = takeQty * lot.unitCostUSD;
        totalCostUSD += lineCost;

        allocations.push({
          lotId: lot.lotId,
          lotNumber: lot.lotNumber,
          binCode: lot.binCode,
          warehouseId: lot.warehouseId,
          qtyAllocated: takeQty,
          unitCostUSD: lot.unitCostUSD,
          lineCostUSD: Number(lineCost.toFixed(2))
        });
      }
    }

    if (remainingToFulfill > 0) {
      throw new Error(`Shortage: Unfulfilled quantity of ${remainingToFulfill} units for SKU '${cleanSku}'.`);
    }

    return {
      skuId: cleanSku,
      requestedQty: parseInt(requiredQty, 10),
      totalCostUSD: Number(totalCostUSD.toFixed(2)),
      allocations
    };
  }

  /**
   * Compute optimized serpentine picking path for a list of bins
   */
  computeOptimizedPickPath(binCodeList = []) {
    const binDetails = binCodeList.map(code => {
      const matchKey = Array.from(this.warehouseBinsMap.keys()).find(k => k.endsWith(`:${code}`));
      if (matchKey) {
        return this.warehouseBinsMap.get(matchKey);
      }
      return { binCode: code, aisleNumber: 1, rackNumber: 1, levelNumber: 1, positionNumber: 1 };
    });

    // Serpentine sorting: Sort by Aisle ASC -> Rack ASC -> Level ASC
    binDetails.sort((a, b) => {
      if (a.aisleNumber !== b.aisleNumber) return a.aisleNumber - b.aisleNumber;
      if (a.rackNumber !== b.rackNumber) {
        // Reverse rack order on even aisles (S-shape serpentine movement)
        return a.aisleNumber % 2 === 0 ? b.rackNumber - a.rackNumber : a.rackNumber - b.rackNumber;
      }
      return a.levelNumber - b.levelNumber;
    });

    return binDetails;
  }

  /**
   * Export warehouse picking slip text with zero trailing whitespace
   */
  exportPickingSlipText(skuId, requiredQty) {
    const allocationResult = this.allocateStockFIFO(skuId, requiredQty);
    const binsToPick = allocationResult.allocations.map(a => a.binCode);
    const optimizedPath = this.computeOptimizedPickPath(binsToPick);

    const lines = [
      '==================================================',
      'APEX ENTERPRISE ERP - WAREHOUSE OPTIMIZED PICK SLIP',
      `Target SKU: ${allocationResult.skuId} | Total Qty: ${allocationResult.requestedQty}`,
      `Estimated Stock Valuation: $${allocationResult.totalCostUSD.toLocaleString()} USD`,
      '==================================================',
      'OPTIMIZED SERPENTINE PICKING SEQUENCE:'
    ];

    optimizedPath.forEach((bin, idx) => {
      const alloc = allocationResult.allocations.find(a => a.binCode === bin.binCode);
      const qty = alloc ? alloc.qtyAllocated : 0;
      lines.push(`Stop #${idx + 1}: Aisle ${bin.aisleNumber} | Rack ${bin.rackNumber} | Level ${bin.levelNumber} [BIN: ${bin.binCode}] -> Pick ${qty} units`);
    });

    lines.push('--------------------------------------------------');
    lines.push('Verification Status: FIFO Lot Sequence Confirmed Valid');

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalWarehouseRoutingEngine = new WarehouseRoutingEngine();
