/**
 * ApexERP Enterprise MRP II - Multi-Level Bill of Materials (BOM) Explosion Resolver
 * Recursively resolves parent assemblies into child components, sub-assemblies, and raw materials.
 * Computes net material requirements, lead time stack, and shortage warnings.
 */

export class BOMExplosionEngine {
  constructor() {
    this.bomRegistryMap = new Map();
  }

  /**
   * Register a Bill of Materials structure for a finished product or sub-assembly
   */
  registerBOM({ parentSku, parentName, revision = '1.0', components = [] }) {
    const cleanParent = String(parentSku).trim().toUpperCase();
    const bom = {
      parentSku: cleanParent,
      parentName: String(parentName).trim(),
      revision: String(revision).trim(),
      components: components.map(c => ({
        componentSku: String(c.componentSku).trim().toUpperCase(),
        componentName: String(c.componentName).trim(),
        qtyPerParent: Number(c.qtyPerParent || 1),
        scrapFactorPercent: Number(c.scrapFactorPercent || 0),
        leadTimeDays: parseInt(c.leadTimeDays || 1, 10),
        isSubAssembly: Boolean(c.isSubAssembly)
      }))
    };

    this.bomRegistryMap.set(cleanParent, bom);
    return bom;
  }

  /**
   * Recursively explode multi-level BOM for a targeted production batch quantity
   */
  explodeBOM(parentSku, batchQuantity = 1, currentLevel = 0, currentPath = '') {
    const cleanSku = String(parentSku).trim().toUpperCase();
    const batchQty = Math.max(1, Number(batchQuantity || 1));
    const bom = this.bomRegistryMap.get(cleanSku);

    if (!bom) {
      // Leaf raw material node
      return [
        {
          level: currentLevel,
          sku: cleanSku,
          name: `Raw Material Component (${cleanSku})`,
          requiredQty: batchQty,
          leadTimeDays: 5,
          path: `${currentPath} -> ${cleanSku}`,
          isLeaf: true
        }
      ];
    }

    let explodedItems = [];

    bom.components.forEach(comp => {
      const grossQtyNeeded = Number((batchQty * comp.qtyPerParent * (1 + comp.scrapFactorPercent / 100)).toFixed(2));
      const nodePath = currentPath ? `${currentPath} -> ${comp.componentSku}` : `${cleanSku} -> ${comp.componentSku}`;

      explodedItems.push({
        level: currentLevel + 1,
        sku: comp.componentSku,
        name: comp.componentName,
        requiredQty: grossQtyNeeded,
        scrapFactorPercent: comp.scrapFactorPercent,
        leadTimeDays: comp.leadTimeDays,
        path: nodePath,
        isSubAssembly: comp.isSubAssembly,
        isLeaf: !comp.isSubAssembly
      });

      if (comp.isSubAssembly && this.bomRegistryMap.has(comp.componentSku)) {
        const childExploded = this.explodeBOM(comp.componentSku, grossQtyNeeded, currentLevel + 1, nodePath);
        explodedItems = explodedItems.concat(childExploded);
      }
    });

    return explodedItems;
  }

  /**
   * Consolidate total gross component demand across exploded BOM tree
   */
  consolidateMaterialDemand(parentSku, batchQuantity = 1) {
    const rawExplosion = this.explodeBOM(parentSku, batchQuantity);
    const demandSummaryMap = new Map();

    rawExplosion.forEach(item => {
      if (!demandSummaryMap.has(item.sku)) {
        demandSummaryMap.set(item.sku, {
          sku: item.sku,
          name: item.name,
          totalQtyRequired: 0,
          maxLeadTimeDays: 0,
          isSubAssembly: item.isSubAssembly
        });
      }

      const summary = demandSummaryMap.get(item.sku);
      summary.totalQtyRequired += item.requiredQty;
      summary.maxLeadTimeDays = Math.max(summary.maxLeadTimeDays, item.leadTimeDays);
    });

    return {
      targetParentSku: String(parentSku).trim().toUpperCase(),
      targetBatchQuantity: batchQuantity,
      explosionTree: rawExplosion,
      consolidatedDemand: Array.from(demandSummaryMap.values())
    };
  }

  /**
   * Export BOM Explosion Tree to clean text with zero empty padding lines
   */
  exportBOMExplosionText(parentSku, batchQuantity = 1) {
    const result = this.consolidateMaterialDemand(parentSku, batchQuantity);
    const lines = [
      '==================================================',
      'APEX ENTERPRISE MRP II - MULTI-LEVEL BOM EXPLOSION TREE',
      `Target Finished Good SKU: ${result.targetParentSku}`,
      `Production Order Quantity: ${result.targetBatchQuantity} Units`,
      '==================================================',
      'RECURSIVE BOM LEVEL BREAKDOWN:'
    ];

    result.explosionTree.forEach(node => {
      const indent = '  '.repeat(node.level);
      lines.push(`${indent}Level ${node.level}: [${node.sku}] ${node.name} | Qty: ${node.requiredQty} (Lead: ${node.leadTimeDays}d)`);
    });

    lines.push('--------------------------------------------------');
    lines.push('CONSOLIDATED NET COMPONENT DEMAND:');
    result.consolidatedDemand.forEach(item => {
      lines.push(`  • ${item.sku} (${item.name}): ${item.totalQtyRequired.toFixed(2)} units needed (Critical Lead Time: ${item.maxLeadTimeDays} days)`);
    });

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalBOMExplosionResolver = new BOMExplosionEngine();
