/**
 * ApexERP Inventory Barcode & QR Code Engine
 */
export const generateSKUBarcode = (sku, batchNumber) => {
  const formattedSku = String(sku).toUpperCase().trim();
  const checksum = formattedSku.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 10;
  return {
    sku: formattedSku,
    batchNumber: batchNumber || 'BATCH-001',
    barcodeString: `APEX-${formattedSku}-${checksum}`,
    qrCodePayload: JSON.stringify({ sku: formattedSku, batch: batchNumber })
  };
};

export const parseBarcodePayload = (barcodeString) => {
  const parts = barcodeString.split('-');
  if (parts.length < 3 || parts[0] !== 'APEX') {
    return { valid: false, error: 'Invalid Apex ERP Barcode Format' };
  }
  return {
    valid: true,
    sku: parts[1],
    checksum: parts[2]
  };
};
