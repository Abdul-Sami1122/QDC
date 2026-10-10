# QDC Clone: Single-Store Dry Cleaning POS & Customer Hub

## 📌 Project Overview
Ek comprehensive, desktop-optimized Single-Store Dry Cleaning POS aur Management Portal banana hai jo Quick Dry Cleaning (QDC) ke UI/UX workflow par based ho. Isme unified Admin/POS authentication, vertical navigation sidebar, global customer/invoice search engine, aur ek rich Customer Order History Dialog shamil hoga.

---

## 🏗️ System Architecture & Workflow

1. **Authentication Gate:** Single login screen (Admin/Operator) credentials verify karega aur main portal open karega.
2. **Main Application Shell:**
   - **Left Sidebar:** Collapsible black vertical menu (Home, Dashboard, Customer, Reports, Set Up, Support, Live Chat).
   - **Top Bar:** Quick Dry Cleaning branding, notification strip, active user profile.
3. **Home Search Portal:**
   - Radio toggle: "Search Customer (Name, Address, Mobile Number, Membership id or customer id)" vs "Search Invoice".
   - Search input box with instant filtered suggestions.
   - Primary action buttons: "Add New Customer" modal trigger aur "Daily Dashboard" router.
4. **Customer 360° Order History Modal:**
   - Triggered jab search bar se koi customer select kiya jaye.
   - Header: Name, Mobile, Email, Address, Preferences (e.g., Medium Starch, Flat Pressing), Loyalty stars, Last visit.
   - Metrics Bar: Pending Orders count, Amount Due, Pcs Under Process, Pcs Ready.
   - Interactive History Table: Order No, Order Date, Due Date, Total Pcs, Under Process, Delivered, Ready, Amount, Balance, Status icons.
   - Bottom Bar: Export to Excel, SMS Pending Balance, Send Email, Drop (New Order), Pick Up.

---

## 🚀 Step-by-Step Implementation Phases

### Phase 1: Authentication & App Shell Layout
- [ ] **1.1 Login Screen Component (`LoginModal.jsx`):**
  - Username & Password inputs with dummy validation (`admin` / `123456`).
  - Single role handling (Admin & POS handled by one operator).
  - Authenticated session persistence in `localStorage` or React state.
- [ ] **1.2 Top Navigation Header (`TopHeader.jsx`):**
  - Software logo, Title ("Quick Dry Cleaning Software").
  - Dynamic pending pick-up alert banner ("You have 94 pending pick up requests.").
  - Logged-in user profile pill ("Hi, Ashwani") with logout trigger.
- [ ] **1.3 Vertical Sidebar (`Sidebar.jsx`):**
  - Dark-themed icons with text labels:
    - Home (Ctrl+H)
    - Dashboard (New badge)
    - Customer
    - Reports
    - Set Up
    - Support
    - Live Chat
  - Active state indicator and section switching.

---

### Phase 2: Master Mock Data Engine (`src/data/qdcData.js`)
- [ ] **2.1 Comprehensive Customer & Order Dataset:**
  - Customer Object Schema:
    - `id`, `name`, `mobile`, `email`, `address`, `membershipId`
    - `preferences` (Starch type, pressing instructions)
    - `rating` (1-5 stars), `creditRating`
    - `amountDue`, `lastVisit`
  - Order Object Schema:
    - `orderNo`, `customerId`, `orderDate`, `dueDate`
    - `totalPcs`, `underProcess`, `delivered`, `ready`
    - `amount`, `balanceAmount`, `status` (`ready`, `process`, `delivered`, `payment_due`)

---

### Phase 3: Home Search Portal & Customer Registration
- [ ] **3.1 Central Search Component (`HomeSearchPortal.jsx`):**
  - Radio options:
    - `Search Customer (Name, Address, Mobile Number, Membership id or customer id)`
    - `Search Invoice`
  - Debounced input field matching against customer name, phone, address, or order number.
  - Dropdown result list showing quick matches with keyboard navigation (`Enter` to open).
- [ ] **3.2 Action Buttons:**
  - `Add New Customer`: Opens a quick-entry modal (Name, Mobile, Address, Default Service preferences).
  - `Daily Dashboard`: Navigates to workshop metrics / daily income breakdown.
- [ ] **3.3 "Get Started" Help Section:**
  - Quick tour guide links matching the original layout:
    - "Help me to add a new customer and create a new order"
    - "Help me understand how to deliver garments post processing"
    - "Help me to connect to support team for technical assistance"

---

### Phase 4: Customer 360° Order Details Modal
- [ ] **4.1 Customer Header & Preferences Banner:**
  - Displays customer full profile, star rating, green dollar badges, and last visit days.
  - Tags for garment handling notes: `Medium Starch`, `Hard Starch || Flat Pressing`.
  - Buttons: "Show Details" and "Edit (F4)".
- [ ] **4.2 KPI Summary Cards:**
  - `Pending Orders: X`
  - `Amount Due: Rs. XXXX`
  - `Pcs Under Process: X`
  - `Pcs Ready: X`
- [ ] **4.3 Order History Grid:**
  - Filter dropdown: "Show: Garment or Payment".
  - Multi-column table with colored indicators:
    - Ready count highlighted in amber/green.
    - Balance Amount highlighted in red if unpaid.
    - Status icon badges (Shirt icon for garment ready, Red/Green $ badges for payment).
- [ ] **4.4 Bottom Action Controls:**
  - Buttons: `Export to Excel`, `SMS Pending Balance`, `Send Email`.
  - Primary CTA: `Drop` (Proceed to New Order Booking POS) and `Pick Up` (Settle Balance & Deliver).

---

### Phase 5: POS Booking & Workshop Pipeline Integration
- [ ] **5.1 POS Booking Modal (Triggered from 'Drop' button):**
  - Pre-fills the selected customer details.
  - Category selector (Men, Women, Household) and service multiplier.
  - Real-time cart calculation (Total, Advance, Balance).
- [ ] **5.2 Thermal Receipt Print Generator:**
  - `@media print` 80mm slip generation on order submission.
- [ ] **5.3 Order Delivery / Pickup Settlement (Triggered from 'Pick Up' button):**
  - Single-click balance collection.
  - Sets remaining balance to 0 and marks order status as Delivered.

---

### Phase 6: Keyboard Shortcuts & Quality Assurance
- [ ] `Ctrl + H`: Return to Home Search Portal.
- [ ] `F2`: Focus global Search Bar.
- [ ] `F4`: Edit selected customer modal.
- [ ] `Esc`: Close active dialog / modal.
- [ ] Responsive fit check for desktop / 1080p POS touch monitors.