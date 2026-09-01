/**
 * ApexERP Enterprise Full Customer & Vendor Directory
 * 1,000+ Customers and Vendors profiles.
 */

export const FULL_CUSTOMER_DIRECTORY = [];
export const FULL_VENDOR_DIRECTORY = [];

const industries = [
  'AeroSpace Dynamics', 'Global Logistics Corp', 'Apex Precision Engineering',
  'Nexus Cloud Systems', 'Starlight Aviation Systems', 'Quantum Cybernetics',
  'Vanguard Defense Systems', 'OmniCorp Industrial Solutions', 'Titanium Motors Group',
  'Blue Horizon Telecom', 'Hyperion Energy Grid', 'Orion Cloud Datacenters',
  'Polaris Biotech Labs', 'Zenith Logistics Hub', 'Apex Robotics Int'
];

for (let i = 1; i <= 600; i++) {
  const ind = industries[i % industries.length];
  FULL_CUSTOMER_DIRECTORY.push({
    customerId: `CUST-FULL-${String(i).padStart(4, '0')}`,
    companyName: `${ind} Client Division #${i}`,
    contactName: `Corporate Lead ${i}`,
    email: `client.${i}@${ind.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+1-555-019-${String(i).padStart(4, '0')}`,
    creditLimit: 100000 + (i * 5000),
    currentBalance: Number(((i * 2450) % 75000).toFixed(2)),
    paymentTermsDays: i % 2 === 0 ? 30 : 60,
    taxId: `US-EIN-${String(10000000 + i)}`
  });
}

for (let i = 1; i <= 500; i++) {
  const ind = industries[i % industries.length];
  FULL_VENDOR_DIRECTORY.push({
    vendorId: `VEND-FULL-${String(i).padStart(4, '0')}`,
    supplierName: `${ind} Supplier Facility #${i}`,
    contactPerson: `Account Representative ${i}`,
    email: `vendor.${i}@${ind.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+1-555-028-${String(i).padStart(4, '0')}`,
    paymentTermsDays: 45,
    outstandingBalance: Number(((i * 3150) % 95000).toFixed(2)),
    rating: 4.8
  });
}
