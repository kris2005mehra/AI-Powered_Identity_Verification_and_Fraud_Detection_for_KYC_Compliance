export const verificationLogs = [
  {
    id: 'VER-001',
    userName: 'Rajesh Kumar',
    docType: 'Aadhaar',
    status: 'Safe',
    fraudScore: 12,
    date: '2025-11-22 14:30',
  },
  {
    id: 'VER-002',
    userName: 'Priya Sharma',
    docType: 'PAN',
    status: 'Safe',
    fraudScore: 8,
    date: '2025-11-22 13:45',
  },
  {
    id: 'VER-003',
    userName: 'Amit Patel',
    docType: 'Driving License',
    status: 'Risky',
    fraudScore: 67,
    date: '2025-11-22 12:20',
  },
  {
    id: 'VER-004',
    userName: 'Sneha Reddy',
    docType: 'Aadhaar',
    status: 'Fraud',
    fraudScore: 94,
    date: '2025-11-22 11:15',
  },
  {
    id: 'VER-005',
    userName: 'Vikram Singh',
    docType: 'PAN',
    status: 'Safe',
    fraudScore: 15,
    date: '2025-11-22 10:30',
  },
  {
    id: 'VER-006',
    userName: 'Ananya Iyer',
    docType: 'Aadhaar',
    status: 'Safe',
    fraudScore: 5,
    date: '2025-11-22 09:45',
  },
  {
    id: 'VER-007',
    userName: 'Rohit Mehta',
    docType: 'Driving License',
    status: 'Risky',
    fraudScore: 72,
    date: '2025-11-22 09:00',
  },
  {
    id: 'VER-008',
    userName: 'Kavya Nair',
    docType: 'PAN',
    status: 'Safe',
    fraudScore: 18,
    date: '2025-11-21 16:30',
  },
  {
    id: 'VER-009',
    userName: 'Arjun Gupta',
    docType: 'Aadhaar',
    status: 'Fraud',
    fraudScore: 89,
    date: '2025-11-21 15:20',
  },
  {
    id: 'VER-010',
    userName: 'Divya Krishnan',
    docType: 'Driving License',
    status: 'Safe',
    fraudScore: 22,
    date: '2025-11-21 14:10',
  },
];

export const fraudAlerts = [
  {
    id: 'ALT-001',
    user: 'Sneha Reddy',
    reason: 'Document tampering detected',
    severity: 'High',
    time: '2 hours ago',
  },
  {
    id: 'ALT-002',
    user: 'Arjun Gupta',
    reason: 'Suspicious pattern match',
    severity: 'Critical',
    time: '1 day ago',
  },
  {
    id: 'ALT-003',
    user: 'Amit Patel',
    reason: 'Multiple verification attempts',
    severity: 'Medium',
    time: '3 hours ago',
  },
];

export const riskDistribution = [
  { risk: 'Safe', count: 6 },
  { risk: 'Risky', count: 2 },
  { risk: 'Fraud', count: 2 },
];

export const docTypeDistribution = [
  { name: 'Aadhaar', value: 40 },
  { name: 'PAN', value: 35 },
  { name: 'Driving License', value: 25 },
];

export const extractedData = {
  aadhaar: {
    name: 'RAJESH KUMAR SHARMA',
    aadhaarNumber: 'XXXX-XXXX-4567',
    dob: '15/08/1990',
    gender: 'Male',
    address: 'House No. 123, Sector 15, New Delhi, 110001',
  },
  pan: {
    name: 'RAJESH KUMAR SHARMA',
    panNumber: 'XXXPK1234X',
    dob: '15/08/1990',
    fatherName: 'KUMAR SHARMA',
  },
  dl: {
    name: 'RAJESH KUMAR SHARMA',
    dlNumber: 'DL-0120XXXXXXXX',
    dob: '15/08/1990',
    doi: '10/05/2020',
    validity: '09/05/2040',
    address: 'House No. 123, Sector 15, New Delhi',
  },
};
