/**
 * ApexERP Document Template & Exporter Service
 */
export const generateDocumentTemplate = (docType, data) => {
  const title = docType.toUpperCase();
  const dateStr = new Date().toLocaleDateString();
  return `
    ==================================================
    APEX ENTERPRISE ERP - ${title}
    Document ID: ${data.id || 'DOC-1001'} | Date: ${dateStr}
    ==================================================
    Customer / Vendor: ${data.entityName || 'N/A'}
    Total Amount: $${Number(data.totalAmount || 0).toLocaleString()}
    Status: ${data.status || 'DRAFT'}
    ==================================================
  `.trim();
};
