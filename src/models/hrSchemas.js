/**
 * ApexERP Enterprise HR & Human Capital Management (HCM) Schemas
 */

export const JOB_LEVELS_AND_GRADES = {
  EXECUTIVE_E1: { grade: 'E1', title: 'Chief Executive Officer', salaryBandMin: 18000, salaryBandMax: 35000 },
  EXECUTIVE_E2: { grade: 'E2', title: 'VP / C-Level Director', salaryBandMin: 13000, salaryBandMax: 22000 },
  SENIOR_MANAGEMENT_M1: { grade: 'M1', title: 'Department Director', salaryBandMin: 10000, salaryBandMax: 16000 },
  MANAGEMENT_M2: { grade: 'M2', title: 'Team Manager / Lead', salaryBandMin: 7500, salaryBandMax: 12000 },
  PROFESSIONAL_P3: { grade: 'P3', title: 'Senior Engineer / Specialist', salaryBandMin: 6500, salaryBandMax: 10500 },
  PROFESSIONAL_P2: { grade: 'P2', title: 'Staff Engineer / Specialist', salaryBandMin: 4800, salaryBandMax: 7800 },
  ENTRY_P1: { grade: 'P1', title: 'Associate / Junior Specialist', salaryBandMin: 3200, salaryBandMax: 5200 }
};

export const LEAVE_TYPES_REGISTRY = [
  { leaveTypeCode: 'ANNUAL_VACATION', name: 'Annual Paid Vacation Leave', maxAccrualDaysPerYear: 20, isPaid: true },
  { leaveTypeCode: 'SICK_MEDICAL', name: 'Medical & Sick Leave', maxAccrualDaysPerYear: 12, isPaid: true },
  { leaveTypeCode: 'MATERNITY_PATERNITY', name: 'Parental Leave', maxAccrualDaysPerYear: 90, isPaid: true },
  { leaveTypeCode: 'BEREAVEMENT', name: 'Compassionate Bereavement Leave', maxAccrualDaysPerYear: 5, isPaid: true },
  { leaveTypeCode: 'UNPAID_PERSONAL', name: 'Unpaid Personal Leave of Absence', maxAccrualDaysPerYear: 30, isPaid: false }
];

export const HRSchemaDefinitions = {
  JobPositionSchema: {
    positionId: { type: 'string', primaryKey: true },
    title: { type: 'string', required: true },
    departmentCode: { type: 'string', required: true },
    jobGrade: { type: 'string', required: true },
    targetHeadcount: { type: 'number', default: 1 },
    currentHeadcount: { type: 'number', default: 0 }
  },

  LeaveRequestSchema: {
    requestId: { type: 'string', primaryKey: true },
    employeeId: { type: 'string', required: true },
    leaveTypeCode: { type: 'string', required: true },
    startDate: { type: 'date', required: true },
    endDate: { type: 'date', required: true },
    totalDays: { type: 'number', required: true },
    status: { type: 'enum', values: ['SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED'], default: 'SUBMITTED' },
    approverEmployeeId: { type: 'string', nullable: true }
  }
};
