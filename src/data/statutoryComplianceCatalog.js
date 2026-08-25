/**
 * ApexERP Enterprise Statutory & International Trade Compliance Catalog
 * Includes global tax authority definitions, VAT/GST rules, customs compliance standards.
 */

export const GLOBAL_TAX_JURISDICTIONS = [
  { code: 'US-FED', country: 'United States', authority: 'Internal Revenue Service (IRS)', corporateTaxRatePercent: 21.0, hasVAT: false, salesTaxMaxPercent: 10.25 },
  { code: 'US-CA', country: 'United States', state: 'California', authority: 'California Franchise Tax Board', corporateTaxRatePercent: 8.84, salesTaxMaxPercent: 10.25 },
  { code: 'US-NY', country: 'United States', state: 'New York', authority: 'NY Dept of Taxation and Finance', corporateTaxRatePercent: 6.5, salesTaxMaxPercent: 8.875 },
  { code: 'GB-HMRC', country: 'United Kingdom', authority: 'HM Revenue & Customs (HMRC)', corporateTaxRatePercent: 25.0, hasVAT: true, vatStandardRatePercent: 20.0, vatReducedRatePercent: 5.0 },
  { code: 'DE-BZST', country: 'Germany', authority: 'Bundeszentralamt für Steuern (BZSt)', corporateTaxRatePercent: 15.825, hasVAT: true, vatStandardRatePercent: 19.0, vatReducedRatePercent: 7.0 },
  { code: 'JP-NTA', country: 'Japan', authority: 'National Tax Agency (NTA)', corporateTaxRatePercent: 23.2, hasVAT: true, vatStandardRatePercent: 10.0, vatReducedRatePercent: 8.0 },
  { code: 'IN-GST', country: 'India', authority: 'Central Board of Indirect Taxes and Customs (CBIC)', corporateTaxRatePercent: 25.0, hasVAT: true, vatStandardRatePercent: 18.0, vatReducedRatePercent: 5.0 }
];

export const INCOTERMS_2020_DEFINITIONS = [
  { code: 'EXW', name: 'Ex Works', obligation: 'Buyer assumes all costs and risks from sellers premises.' },
  { code: 'FCA', name: 'Free Carrier', obligation: 'Seller delivers goods to buyer-designated carrier.' },
  { code: 'CPT', name: 'Carriage Paid To', obligation: 'Seller pays freight to destination; risk transfers to buyer on carrier handover.' },
  { code: 'CIP', name: 'Carriage and Insurance Paid To', obligation: 'Seller pays freight and maximum insurance cover to destination.' },
  { code: 'DAP', name: 'Delivered at Place', obligation: 'Seller delivers to destination ready for unloading; import duties paid by buyer.' },
  { code: 'DPU', name: 'Delivered at Place Unloaded', obligation: 'Seller delivers and unloads at destination; import duties paid by buyer.' },
  { code: 'DDP', name: 'Delivered Duty Paid', obligation: 'Seller delivers ready for unloading with all import customs duties paid.' },
  { code: 'FAS', name: 'Free Alongside Ship', obligation: 'Seller places goods alongside vessel at port of shipment.' },
  { code: 'FOB', name: 'Free On Board', obligation: 'Seller loads goods on vessel at port of shipment.' },
  { code: 'CFR', name: 'Cost and Freight', obligation: 'Seller pays sea freight to destination port.' },
  { code: 'CIF', name: 'Cost, Insurance and Freight', obligation: 'Seller pays sea freight and marine insurance to destination port.' }
];
