// Master Mock Data Engine for Quick Dry Cleaning (QDC) Management Portal
// All customer profiles and orders configured with authentic Muslim names & Pakistani cities

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-100',
    membershipId: 'MEM-8800',
    name: 'Tariq Mehmood',
    mobile: '0300-8800957',
    email: 'tariq.mehmood@gmail.com',
    address: '140-H, Phase 5, DHA, Lahore',
    preferences: ['Medium Starch', 'Hanger Pack'],
    rating: 5,
    creditRating: 'A+',
    lastVisit: '1 Days',
    customerSince: '2015-01-10',
    notes: 'Regular premium client. Delicate woolens and suits.',
    amountDue: 270,
    totalSpent: 12500
  },
  {
    id: 'CUST-101',
    membershipId: 'MEM-8821',
    name: 'Muhammad Ashfaq',
    mobile: '0300-9811234',
    email: 'ashfaq.m@gmail.com',
    address: 'B-142, Block 4, Clifton, Karachi',
    preferences: ['Medium Starch', 'Flat Pressing', 'Collar Stiffener'],
    rating: 5,
    creditRating: 'A+',
    lastVisit: '4 days ago',
    customerSince: '2022-03-15',
    notes: 'Handles high-end designer suits. Always fold silk kurtas.',
    amountDue: 1450,
    totalSpent: 48900
  },
  {
    id: 'CUST-102',
    membershipId: 'MEM-9410',
    name: 'Muhammad Bilal',
    mobile: '0321-9876543',
    email: 'bilal.m@gmail.com',
    address: 'House #18, Block B, Model Town, Lahore',
    preferences: ['No Starch', 'Hanger Pack'],
    rating: 4,
    creditRating: 'A',
    lastVisit: 'Yesterday',
    customerSince: '2023-01-10',
    notes: 'Urgent delivery preferred for three-piece suits.',
    amountDue: 620,
    totalSpent: 24500
  },
  {
    id: 'CUST-103',
    membershipId: 'MEM-7734',
    name: 'Usman Tariq',
    mobile: '0333-5551234',
    email: 'usman.tariq@gmail.com',
    address: 'Flat 4B, Gulberg Heights, Gulberg III, Lahore',
    preferences: ['Light Starch', 'Flat Pressing'],
    rating: 5,
    creditRating: 'A+',
    lastVisit: '3 days ago',
    customerSince: '2021-11-20',
    notes: 'Heavy winter blankets and duvet regular client.',
    amountDue: 0,
    totalSpent: 39100
  },
  {
    id: 'CUST-104',
    membershipId: 'MEM-5519',
    name: 'Dr. Sarah Khan',
    mobile: '0300-8889922',
    email: 'sarah.khan@gmail.com',
    address: 'Villa 29, Sector F-7/2, Islamabad',
    preferences: ['Hard Starch', 'Hanger Pack', 'Eco-Friendly Detergent'],
    rating: 5,
    creditRating: 'A+',
    lastVisit: '1 week ago',
    customerSince: '2020-08-04',
    notes: 'Doctors lab coats and formal dresses.',
    amountDue: 850,
    totalSpent: 62000
  },
  {
    id: 'CUST-105',
    membershipId: 'MEM-3302',
    name: 'Chaudhry Rashid',
    mobile: '0321-9871100',
    email: 'ch.rashid@gmail.com',
    address: 'C-55, Satellite Town, Rawalpindi',
    preferences: ['Medium Starch', 'Crease Sleeves'],
    rating: 4,
    creditRating: 'B+',
    lastVisit: '10 days ago',
    customerSince: '2023-05-18',
    notes: 'Cotton shalwar kameez specialist service.',
    amountDue: 2100,
    totalSpent: 18400
  },
  {
    id: 'CUST-106',
    membershipId: 'MEM-4421',
    name: 'Fatima Zahra',
    mobile: '0302-7771234',
    email: 'fatima.zahra@gmail.com',
    address: 'House 82, Johar Town, Lahore',
    preferences: ['No Starch', 'Soft Pressing'],
    rating: 5,
    creditRating: 'A+',
    lastVisit: '2 days ago',
    customerSince: '2023-09-01',
    notes: 'Silk abayas and embroidered formal wear.',
    amountDue: 0,
    totalSpent: 15400
  },
  {
    id: 'CUST-107',
    membershipId: 'MEM-6612',
    name: 'Omer Farooq',
    mobile: '0345-6668899',
    email: 'omer.farooq@gmail.com',
    address: 'Sector G-11/3, Islamabad',
    preferences: ['Medium Starch', 'Hanger Pack'],
    rating: 5,
    creditRating: 'A',
    lastVisit: '5 days ago',
    customerSince: '2022-12-11',
    notes: 'Corporate shirts and winter coats.',
    amountDue: 400,
    totalSpent: 21000
  }
];

export const INITIAL_QDC_ORDERS = [
  {
    orderNo: 'R783',
    customerId: 'CUST-100',
    customerName: 'Tariq Mehmood',
    phone: '0300-8800957',
    orderDate: '23 Feb 2015',
    dueDate: '30 Jan 2015',
    totalPcs: 2,
    underProcess: 0,
    ready: 0,
    delivered: 0,
    amount: 90,
    advancePaid: 0,
    balanceAmount: 90,
    status: 'process',
    paymentStatus: 'unpaid',
    items: [
      { name: 'Shirt Wash & Iron', serviceName: 'Laundry', qty: 2, price: 45 }
    ]
  },
  {
    orderNo: 'R791',
    customerId: 'CUST-100',
    customerName: 'Tariq Mehmood',
    phone: '0300-8800957',
    orderDate: '23 Feb 2015',
    dueDate: '02 Feb 2015',
    totalPcs: 2,
    underProcess: 0,
    ready: 0,
    delivered: 0,
    amount: 90,
    advancePaid: 0,
    balanceAmount: 90,
    status: 'process',
    paymentStatus: 'unpaid',
    items: [
      { name: 'Trouser Iron', serviceName: 'Steam Press', qty: 2, price: 45 }
    ]
  },
  {
    orderNo: 'S153',
    customerId: 'CUST-100',
    customerName: 'Tariq Mehmood',
    phone: '0300-8800957',
    orderDate: '23 Feb 2015',
    dueDate: '26 Feb 2015',
    totalPcs: 2,
    underProcess: 2,
    ready: 0,
    delivered: 0,
    amount: 90,
    advancePaid: 0,
    balanceAmount: 90,
    status: 'process',
    paymentStatus: 'unpaid',
    items: [
      { name: 'Kurta Dry Clean', serviceName: 'Dry Clean', qty: 2, price: 45 }
    ]
  },
  {
    orderNo: 'ORD-9821',
    customerId: 'CUST-101',
    customerName: 'Muhammad Ashfaq',
    phone: '0300-9811234',
    orderDate: '2026-10-05',
    dueDate: '2026-10-10',
    totalPcs: 8,
    underProcess: 2,
    ready: 6,
    delivered: 0,
    amount: 2450,
    advancePaid: 1000,
    balanceAmount: 1450,
    status: 'process',
    paymentStatus: 'partial',
    items: [
      { name: 'Suit (2 Pc)', serviceName: 'Dry Clean', qty: 2, price: 500 },
      { name: 'Formal Shirts', serviceName: 'Wash & Iron', qty: 4, price: 200 },
      { name: 'Silk Tie', serviceName: 'Dry Clean', qty: 2, price: 325 }
    ]
  },
  {
    orderNo: 'ORD-9640',
    customerId: 'CUST-101',
    customerName: 'Muhammad Ashfaq',
    phone: '0300-9811234',
    orderDate: '2026-09-28',
    dueDate: '2026-10-02',
    totalPcs: 5,
    underProcess: 0,
    ready: 0,
    delivered: 5,
    amount: 1800,
    advancePaid: 1800,
    balanceAmount: 0,
    status: 'delivered',
    paymentStatus: 'paid',
    items: [
      { name: 'Coat / Blazer', serviceName: 'Dry Clean', qty: 2, price: 400 },
      { name: 'Trousers / Pent', serviceName: 'Steam Iron', qty: 5, price: 200 }
    ]
  },
  {
    orderNo: 'ORD-1001',
    customerId: 'CUST-102',
    customerName: 'Muhammad Bilal',
    phone: '0321-9876543',
    orderDate: '2026-10-08',
    dueDate: '2026-10-11',
    totalPcs: 3,
    underProcess: 3,
    ready: 0,
    delivered: 0,
    amount: 1120,
    advancePaid: 500,
    balanceAmount: 620,
    status: 'process',
    paymentStatus: 'partial',
    items: [
      { name: 'Suit (2 Pc)', serviceName: 'Dry Clean', qty: 2, price: 500 },
      { name: 'Shirt', serviceName: 'Wash & Iron', qty: 1, price: 120 }
    ]
  },
  {
    orderNo: 'ORD-1002',
    customerId: 'CUST-103',
    customerName: 'Usman Tariq',
    phone: '0333-5551234',
    orderDate: '2026-10-07',
    dueDate: '2026-10-10',
    totalPcs: 1,
    underProcess: 0,
    ready: 1,
    delivered: 0,
    amount: 900,
    advancePaid: 900,
    balanceAmount: 0,
    status: 'ready',
    paymentStatus: 'paid',
    items: [
      { name: 'Blanket (Double)', serviceName: 'Dry Clean', qty: 1, price: 900 }
    ]
  },
  {
    orderNo: 'ORD-1003',
    customerId: 'CUST-104',
    customerName: 'Dr. Sarah Khan',
    phone: '0300-8889922',
    orderDate: '2026-10-02',
    dueDate: '2026-10-06',
    totalPcs: 4,
    underProcess: 0,
    ready: 4,
    delivered: 0,
    amount: 1650,
    advancePaid: 800,
    balanceAmount: 850,
    status: 'ready',
    paymentStatus: 'partial',
    items: [
      { name: 'Lab Coat', serviceName: 'Wash & Iron', qty: 2, price: 250 },
      { name: 'Ladies Suit (3 Pc)', serviceName: 'Dry Clean', qty: 2, price: 575 }
    ]
  },
  {
    orderNo: 'ORD-1004',
    customerId: 'CUST-105',
    customerName: 'Chaudhry Rashid',
    phone: '0321-9871100',
    orderDate: '2026-09-29',
    dueDate: '2026-10-03',
    totalPcs: 6,
    underProcess: 0,
    ready: 6,
    delivered: 0,
    amount: 2100,
    advancePaid: 0,
    balanceAmount: 2100,
    status: 'ready',
    paymentStatus: 'unpaid',
    items: [
      { name: 'Shalwar Kameez', serviceName: 'Dry Clean', qty: 6, price: 350 }
    ]
  },
  {
    orderNo: 'ORD-1005',
    customerId: 'CUST-106',
    customerName: 'Fatima Zahra',
    phone: '0302-7771234',
    orderDate: '2026-10-07',
    dueDate: '2026-10-10',
    totalPcs: 2,
    underProcess: 2,
    ready: 0,
    delivered: 0,
    amount: 1400,
    advancePaid: 1400,
    balanceAmount: 0,
    status: 'process',
    paymentStatus: 'paid',
    items: [
      { name: 'Embroidered Abaya', serviceName: 'Dry Clean', qty: 2, price: 700 }
    ]
  },
  {
    orderNo: 'ORD-1006',
    customerId: 'CUST-107',
    customerName: 'Omer Farooq',
    phone: '0345-6668899',
    orderDate: '2026-10-04',
    dueDate: '2026-10-08',
    totalPcs: 3,
    underProcess: 0,
    ready: 3,
    delivered: 0,
    amount: 1200,
    advancePaid: 800,
    balanceAmount: 400,
    status: 'ready',
    paymentStatus: 'partial',
    items: [
      { name: 'Coat / Blazer', serviceName: 'Dry Clean', qty: 1, price: 400 },
      { name: 'Shirts', serviceName: 'Wash & Iron', qty: 4, price: 200 }
    ]
  }
];

export const WORKSHOP_METRICS = {
  todayBookings: 18,
  todayRevenue: 28450,
  inProcessGarments: 42,
  readyGarments: 36,
  pendingDeliveries: 14,
  overdueOrders: 2
};
