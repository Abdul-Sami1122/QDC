# Single-Store Dry Cleaning POS — Master Prototype Specification

## 1. Project Overview & Target
Ek fast, responsive single-store Dry Cleaning & Laundry Point of Sale (POS) prototype build karna hai jo React.js aur Tailwind CSS par chalay. Is prototype ka maqsad client ko ek realistic, fully interactive UI demo dikhana hai jahan zero backend setup ke sath sirf local state (useState / mock data) use ho.

---

## 2. Directory Structure
dryclean-pos/
├── index.html
├── package.json
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── data/
│   │   └── mockData.js
│   └── components/
│       ├── Navbar.jsx
│       ├── POS/
│       │   ├── ServiceSelector.jsx
│       │   ├── ItemGrid.jsx
│       │   └── CartDrawer.jsx
│       ├── Orders/
│       │   └── OrderTable.jsx
│       └── Print/
│           └── ThermalSlip.jsx

---

## 3. Phase 1: Environment & Print Styling

### 3.1 Setup Commands
npm create vite@latest dryclean-pos -- --template react
cd dryclean-pos
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

### 3.2 Tailwind Config (tailwind.config.js)
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

### 3.3 Print Styling (src/index.css)
@tailwind base;
@tailwind components;
@tailwind utilities;

@media print {
  body * {
    visibility: hidden !important;
  }
  #thermal-receipt, #thermal-receipt * {
    visibility: visible !important;
  }
  #thermal-receipt {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 80mm !important;
    margin: 0 !important;
    padding: 8px !important;
    background: white !important;
    color: black !important;
    display: block !important;
  }
}

---

## 4. Phase 2: Master Mock Data (src/data/mockData.js)

export const SERVICES = [
  { id: 'dc', name: 'Dry Clean', code: 'DC', multiplier: 1.0 },
  { id: 'wi', name: 'Wash & Iron', code: 'WI', multiplier: 0.6 },
  { id: 'si', name: 'Steam Iron', code: 'SI', multiplier: 0.35 }
];

export const CATEGORIES = ['All', 'Men', 'Women', 'Household'];

export const ITEMS = [
  { id: 'it_1', name: 'Suit (2 Pc)', category: 'Men', basePrice: 500, icon: '👔' },
  { id: 'it_2', name: 'Shirt', category: 'Men', basePrice: 200, icon: '👕' },
  { id: 'it_3', name: 'Trousers / Pent', category: 'Men', basePrice: 200, icon: '👖' },
  { id: 'it_4', name: 'Shalwar Kameez', category: 'Men', basePrice: 350, icon: '👘' },
  { id: 'it_5', name: 'Coat / Blazer', category: 'Men', basePrice: 400, icon: '🧥' },
  { id: 'it_6', name: 'Ladies Suit (3 Pc)', category: 'Women', basePrice: 450, icon: '👗' },
  { id: 'it_7', name: 'Blanket (Single)', category: 'Household', basePrice: 600, icon: '🛏️' },
  { id: 'it_8', name: 'Blanket (Double)', category: 'Household', basePrice: 900, icon: '🛌' },
  { id: 'it_9', name: 'Curtain Panel', category: 'Household', basePrice: 300, icon: '🪟' }
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

---

## 5. Phase 3: UI Components Specification

### 5.1 Navbar (src/components/Navbar.jsx)
- Brand Name aur logo display.
- Tab Buttons: New Booking (POS) aur Orders Tracking.
- Badge: Orders counter badge.

### 5.2 Service Selector (src/components/POS/ServiceSelector.jsx)
- Props: selectedService, onSelectService.
- 3 Tabs: Dry Clean, Wash & Iron, Steam Iron. Active service highlight with indigo accent.

### 5.3 Item Grid (src/components/POS/ItemGrid.jsx)
- Category filter buttons (All, Men, Women, Household).
- Responsive Grid (4 columns desktop, 2 columns tablet).
- Dynamic Price Display: Math.round(item.basePrice * serviceMultiplier).
- Click event: Calls onAddItem(item, computedPrice).

### 5.4 Cart Drawer (src/components/POS/CartDrawer.jsx)
- Customer phone number aur customer name inputs.
- Target delivery date picker (defaults to +3 days from current date).
- Cart Items List: Item name, service name, quantity increment/decrement, and subtotal.
- Calculation Summary:
  - Total Bill: Sum of (price * qty) for all cart items.
  - Advance Paid input field.
  - Balance Due calculation: Math.max(0, totalBill - advancePaid).
- Submit Action: Complete & Print button with window.print() trigger.

### 5.5 Order Table (src/components/Orders/OrderTable.jsx)
- Displays all current orders.
- Columns: Order #, Customer (Name + Phone), Delivery Date, Total Bill, Balance, Status Badge, Actions.
- Status Transitions:
  - In Wash -> Button: "Mark Ready" (updates status to Ready for Pickup).
  - Ready for Pickup -> Button: "Collect & Deliver" (updates status to Delivered).

### 5.6 Thermal Receipt (src/components/Print/ThermalSlip.jsx)
- Clean black & white monospace receipt formatted specifically for 80mm roll printers.
- Hidden on web screen (hidden), visible on print (print:block).
- Includes shop header, customer phone/name, order ID, itemized table, total, advance, balance, and collection terms.

---

## 6. Phase 4: Core State Management (src/App.jsx)

### 6.1 State Hooks Required
- activeTab: 'pos' | 'orders'
- orders: Array initialized with INITIAL_ORDERS
- cart: Array of items [{ cartId, itemId, name, serviceId, serviceName, price, qty }]
- selectedService: 'dc' | 'wi' | 'si'
- customerPhone: String
- customerName: String
- deliveryDate: Date string (YYYY-MM-DD)
- advancePaid: Number

### 6.2 Key State Operations
- handleAddItem(item): Check if item with identical itemId and serviceId exists in cart. If yes, increment qty; otherwise, append to array.
- handleUpdateQty(cartId, delta): Modify qty by +1 or -1. If qty drops to 0, filter item out of cart.
- handleCompleteOrder():
  1. Validate cart length > 0.
  2. Create new order object with incremented ID.
  3. Prepend new order to orders state array.
  4. Trigger window.print().
  5. Reset cart and advancePaid.

---

## 7. Phase 5: Client Walkthrough & Validation Checklist

- [ ] Open app on local browser / deployed URL.
- [ ] Select customer input and enter dummy number.
- [ ] Change service tab (e.g. from Dry Clean to Steam Iron) and verify card prices recalculate instantly.
- [ ] Add 2-3 items to cart, adjust quantities using + and -.
- [ ] Enter Advance payment amount and verify remaining balance calculates accurately.
- [ ] Click Complete & Print Slip and verify browser thermal print preview modal opens.
- [ ] Switch to Orders Tracking tab and confirm the new order appears on top.
- [ ] Advance order status from In Wash to Ready for Pickup, and then to Delivered.