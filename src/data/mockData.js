export const SERVICES = [
  {
    id: 'dc',
    name: 'Dry Clean',
    code: 'DC',
    multiplier: 1.0,
    description: 'Special chemical solvent clean & press',
    color: 'emerald'
  },
  {
    id: 'wi',
    name: 'Wash & Iron',
    code: 'WI',
    multiplier: 0.6,
    description: 'Hygienic water wash & crisp press',
    color: 'teal'
  },
  {
    id: 'si',
    name: 'Steam Iron',
    code: 'SI',
    multiplier: 0.35,
    description: 'High-temperature steam press only',
    color: 'teal'
  }
];

export const CATEGORIES = ['All', 'Men', 'Women', 'Household'];

export const getPiecesRatio = (itemOrName) => {
  if (!itemOrName) return 1;
  if (typeof itemOrName === 'object') {
    if (itemOrName.pcsPerUnit) return itemOrName.pcsPerUnit;
    itemOrName = itemOrName.name || '';
  }
  const str = String(itemOrName);
  if (str.includes('(3 Pc)') || str.includes('3 Pc') || str.includes('3Pc') || str.includes('3-Pc')) return 3;
  if (str.includes('(2 Pc)') || str.includes('2 Pc') || str.includes('2Pc') || str.includes('2-Pc')) return 2;
  if (str.includes('Shalwar Kameez') || str.includes('Kurta Shalwar')) return 2;
  return 1;
};

export const ITEMS = [
  { id: 'it_1', name: 'Suit (2 Pc)', category: 'Men', basePrice: 500, icon: '👔', pcsPerUnit: 2 },
  { id: 'it_2', name: 'Shirt', category: 'Men', basePrice: 200, icon: '👕', pcsPerUnit: 1 },
  { id: 'it_3', name: 'Trousers / Pent', category: 'Men', basePrice: 200, icon: '👖', pcsPerUnit: 1 },
  { id: 'it_4', name: 'Shalwar Kameez', category: 'Men', basePrice: 350, icon: '👘', pcsPerUnit: 2 },
  { id: 'it_5', name: 'Coat / Blazer', category: 'Men', basePrice: 400, icon: '🧥', pcsPerUnit: 1 },
  { id: 'it_6', name: 'Ladies Suit (3 Pc)', category: 'Women', basePrice: 450, icon: '👗', pcsPerUnit: 3 },
  { id: 'it_7', name: 'Blanket (Single)', category: 'Household', basePrice: 600, icon: '🛏️', pcsPerUnit: 1 },
  { id: 'it_8', name: 'Blanket (Double)', category: 'Household', basePrice: 900, icon: '🛌', pcsPerUnit: 1 },
  { id: 'it_9', name: 'Curtain Panel', category: 'Household', basePrice: 300, icon: '🪟', pcsPerUnit: 1 }
];

export const INITIAL_ORDERS = [
  {
    id: 1001,
    customerName: 'Muhammad Bilal',
    phone: '0321-9876543',
    items: [
      { name: 'Suit (2 Pc)', serviceName: 'Dry Clean', qty: 2, price: 500 },
      { name: 'Shirt', serviceName: 'Wash & Iron', qty: 1, price: 120 }
    ],
    totalAmount: 1120,
    advancePaid: 500,
    balance: 620,
    status: 'In Wash',
    bookingDate: '2026-10-08',
    deliveryDate: '2026-10-11',
    totalPieces: 3
  },
  {
    id: 1002,
    customerName: 'Usman Tariq',
    phone: '0333-5551234',
    items: [
      { name: 'Blanket (Double)', serviceName: 'Dry Clean', qty: 1, price: 900 }
    ],
    totalAmount: 900,
    advancePaid: 900,
    balance: 0,
    status: 'Ready for Pickup',
    bookingDate: '2026-10-07',
    deliveryDate: '2026-10-10',
    totalPieces: 1
  }
];
