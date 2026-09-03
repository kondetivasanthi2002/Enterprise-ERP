/**
 * ApexERP Enterprise SCM - Landed Cost Allocation Engine
 * Allocates inbound freight, customs duties, insurance, and handling charges across inventory items based on weight/value.
 */

export class LandedCostEngine {
  constructor() {
    this.shipmentsMap = new Map();
  }

  createShipment({ shipmentId, vendorName, allocationMethod = 'VALUE_BASED' }) {
    const id = String(shipmentId || `SHIP-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase()}`).trim();

    const shipment = {
      shipmentId: id,
      vendorName: String(vendorName).trim(),
      allocationMethod: String(allocationMethod).toUpperCase().trim(),
      lineItems: [],
      additionalCosts: []
    };

    this.shipmentsMap.set(id, shipment);
    return shipment;
  }

  addShipmentLineItem(shipmentId, { itemSku, name, qty, purchasePriceUSD, weightKg }) {
    const shipment = this.shipmentsMap.get(String(shipmentId).trim().toUpperCase());
    if (!shipment) throw new Error(`Shipment '${shipmentId}' not found.`);

    const q = Math.max(1, parseInt(qty || 1, 10));
    const price = Number(purchasePriceUSD || 0);

    const item = {
      itemSku: String(itemSku).trim().toUpperCase(),
      name: String(name).trim(),
      qty: q,
      purchasePriceUSD: price,
      weightKg: Number(weightKg || 1),
      extendedValueUSD: Number((q * price).toFixed(2)),
      allocatedLandedCostUSD: 0,
      totalLandedCostUSD: Number((q * price).toFixed(2)),
      unitLandedCostUSD: price
    };

    shipment.lineItems.push(item);
    return item;
  }

  addAdditionalCost(shipmentId, { costType = 'FREIGHT', amountUSD }) {
    const shipment = this.shipmentsMap.get(String(shipmentId).trim().toUpperCase());
    if (!shipment) throw new Error(`Shipment '${shipmentId}' not found.`);

    const cost = {
      costType: String(costType).toUpperCase().trim(),
      amountUSD: Number(amountUSD || 0)
    };

    shipment.additionalCosts.push(cost);
    return cost;
  }

  allocateLandedCosts(shipmentId) {
    const shipment = this.shipmentsMap.get(String(shipmentId).trim().toUpperCase());
    if (!shipment) throw new Error(`Shipment '${shipmentId}' not found.`);

    const totalAdditionalUSD = shipment.additionalCosts.reduce((sum, c) => sum + c.amountUSD, 0);
    const totalShipmentValueUSD = shipment.lineItems.reduce((sum, i) => sum + i.extendedValueUSD, 0);
    const totalShipmentWeightKg = shipment.lineItems.reduce((sum, i) => sum + (i.weightKg * i.qty), 0);

    shipment.lineItems.forEach(item => {
      let allocationShare = 0;
      if (shipment.allocationMethod === 'WEIGHT_BASED' && totalShipmentWeightKg > 0) {
        allocationShare = (item.weightKg * item.qty) / totalShipmentWeightKg;
      } else if (totalShipmentValueUSD > 0) {
        allocationShare = item.extendedValueUSD / totalShipmentValueUSD;
      }

      item.allocatedLandedCostUSD = Number((totalAdditionalUSD * allocationShare).toFixed(2));
      item.totalLandedCostUSD = Number((item.extendedValueUSD + item.allocatedLandedCostUSD).toFixed(2));
      item.unitLandedCostUSD = Number((item.totalLandedCostUSD / item.qty).toFixed(2));
    });

    return {
      shipmentId: shipment.shipmentId,
      totalAdditionalCostsUSD: Number(totalAdditionalUSD.toFixed(2)),
      lineItems: shipment.lineItems
    };
  }

  exportLandedCostReportText(shipmentId) {
    const res = this.allocateLandedCosts(shipmentId);
    const lines = [
      '==================================================',
      'APEX ENTERPRISE SCM - LANDED COST ALLOCATION REPORT',
      `Shipment ID: ${res.shipmentId}`,
      '==================================================',
      `Total Freight/Customs/Handling Fees: $${res.totalAdditionalCostsUSD.toLocaleString()} USD`,
      '--------------------------------------------------',
      'ITEM LANDED COST BREAKDOWN:'
    ];

    res.lineItems.forEach(item => {
      lines.push(`  • [${item.itemSku}] ${item.name} (${item.qty} units)`);
      lines.push(`     Base Price: $${item.purchasePriceUSD} | Allocated Fees: $${item.allocatedLandedCostUSD.toLocaleString()} | Final Unit Landed Cost: $${item.unitLandedCostUSD.toLocaleString()}`);
    });

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalLandedCostEngine = new LandedCostEngine();
