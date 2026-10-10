import React, { useState, useEffect, useMemo } from 'react';
import TopHeader from './components/Layout/TopHeader';
import Sidebar from './components/Layout/Sidebar';
import LoginModal from './components/Auth/LoginModal';
import HomeSearchPortal from './components/Portal/HomeSearchPortal';
import CustomerOrderDetailView from './components/Customer/CustomerOrderDetailView';
import DropNewBookingView from './components/Booking/DropNewBookingView';
import NewCustomerModal from './components/Customer/NewCustomerModal';
import DailyDashboardModal from './components/Dashboard/DailyDashboardModal';
import PickUpSettlementModal from './components/Customer/PickUpSettlementModal';

// Existing POS Components from Phase 1-5
import ServiceSelector from './components/POS/ServiceSelector';
import ItemGrid from './components/POS/ItemGrid';
import CartDrawer from './components/POS/CartDrawer';
import OrderTable from './components/Orders/OrderTable';
import ThermalSlip from './components/Print/ThermalSlip';

import { SERVICES, getPiecesRatio } from './data/mockData';
import {
  INITIAL_CUSTOMERS,
  INITIAL_QDC_ORDERS,
  WORKSHOP_METRICS
} from './data/qdcData';

// Helper to calculate default date (+3 days from now)
const getDefaultDeliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split('T')[0];
};

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('qdc_user');
      return saved ? JSON.parse(saved) : { name: 'Farhan Ali (Store Manager)', role: 'Admin' };
    } catch {
      return { name: 'Farhan Ali (Store Manager)', role: 'Admin' };
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // App Layout State
  const [activeMenu, setActiveMenu] = useState('home'); // 'home' | 'dashboard' | 'customer' | 'pos' | 'reports' | 'setup' | 'support'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Data Stores
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState(INITIAL_QDC_ORDERS);

  // Active Customer View (In-place tabular view, no dialog box)
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Customer Directory Search Filter & View Mode
  const [customerFilterText, setCustomerFilterText] = useState('');
  const [customerViewMode, setCustomerViewMode] = useState('table'); // 'table' | 'grid'

  // New Customer Modal
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [newCustomerInitialQuery, setNewCustomerInitialQuery] = useState('');

  // Daily Dashboard Modal
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);

  // Pick Up Settlement Modal
  const [isPickUpModalOpen, setIsPickUpModalOpen] = useState(false);

  // POS State
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [cart, setCart] = useState([]);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(getDefaultDeliveryDate);
  const [advancePaid, setAdvancePaid] = useState('');

  // Print Order Target (80mm Thermal Slip)
  const [currentPrintOrder, setCurrentPrintOrder] = useState(orders[0] || null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Keyboard shortcut listener (Ctrl+H for Home, Esc to close modals)
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setActiveMenu('home');
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Customer Selection Handler from Search
  const handleSelectCustomer = (cust) => {
    setSelectedCustomer(cust);
    setActiveMenu('customer');
  };

  // Order/Invoice Selection from Search
  const handleSelectOrderFromSearch = (ord) => {
    const cust = customers.find(
      (c) =>
        c.id === ord.customerId ||
        (ord.phone && c.mobile.replace(/\D/g, '') === ord.phone.replace(/\D/g, ''))
    );
    if (cust) {
      setSelectedCustomer(cust);
      setActiveMenu('customer');
    } else {
      handlePrintReceipt(ord);
    }
  };

  // Trigger New Customer Creation Modal
  const handleOpenNewCustomerModal = (query = '') => {
    setNewCustomerInitialQuery(query);
    setIsNewCustomerModalOpen(true);
  };

  // Save New Customer
  const handleSaveCustomer = (newCust) => {
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`Customer "${newCust.name}" added successfully.`);
    setSelectedCustomer(newCust);
    setActiveMenu('customer');
  };

  // "Drop" Action: Opens dedicated frm_New_Booking.aspx style Drop Booking screen
  const handleDropNewOrder = (cust) => {
    setSelectedCustomer(cust);
    setActiveMenu('drop_booking');
    showToast(`Opening New Booking for ${cust.name}...`);
  };

  // Save Booking from Drop Screen
  const handleSaveDropBookingOrder = (newOrderObj, cust) => {
    setOrders((prev) => [newOrderObj, ...prev]);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === cust.id
          ? {
              ...c,
              amountDue: (c.amountDue || 0) + newOrderObj.balanceAmount,
              totalSpent: (c.totalSpent || 0) + newOrderObj.amount,
              lastVisit: 'Today (Booking)'
            }
          : c
      )
    );
    showToast(`Order #${newOrderObj.orderNo} booked successfully!`);
    setSelectedCustomer(cust);
    setActiveMenu('customer');
  };

  // "Pick Up" Action: Opens settlement modal
  const handleOpenPickUpModal = (cust) => {
    setSelectedCustomer(cust);
    setIsPickUpModalOpen(true);
  };

  // Confirm Delivery & Settlement
  const handleConfirmPickUpSettlement = (cust, pendingOrders, totalBalance, selectedOrderIds) => {
    // Update orders to delivered
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        const ordId = ord.orderNo || ord.id;
        const isMatch = selectedOrderIds && selectedOrderIds.length > 0
          ? selectedOrderIds.includes(ordId)
          : (ord.customerId === cust.id ||
             (ord.phone && ord.phone.replace(/\D/g, '') === cust.mobile.replace(/\D/g, '')) ||
             (ord.customerName && ord.customerName.toLowerCase() === cust.name.toLowerCase()));

        if (isMatch && ord.status !== 'delivered') {
          const pcs = ord.totalPcs || ord.totalPieces || (ord.items?.reduce((s, it) => s + (it.qty || 1), 0)) || 1;
          return {
            ...ord,
            status: 'delivered',
            ready: 0,
            underProcess: 0,
            delivered: pcs,
            balanceAmount: 0,
            advancePaid: ord.amount,
            paymentStatus: 'paid'
          };
        }
        return ord;
      })
    );

    // Update customer due amount in state
    setCustomers((prevCusts) =>
      prevCusts.map((c) =>
        c.id === cust.id
          ? {
              ...c,
              amountDue: Math.max(0, (c.amountDue || 0) - totalBalance),
              lastVisit: 'Today (Pickup)'
            }
          : c
      )
    );

    // Also update selectedCustomer in state so CustomerOrderDetailView updates instantly
    setSelectedCustomer((prev) =>
      prev && prev.id === cust.id
        ? {
            ...prev,
            amountDue: Math.max(0, (prev.amountDue || 0) - totalBalance),
            lastVisit: 'Today (Pickup)'
          }
        : prev
    );

    showToast(`Delivered garments for ${cust.name}. Balance of Rs. ${totalBalance} settled!`);
  };

  // Print 80mm Slip
  const handlePrintReceipt = (ord) => {
    // Format order object to match ThermalSlip props
    const printableOrder = {
      id: ord.orderNo || ord.id,
      customerName: ord.customerName,
      phone: ord.phone,
      bookingDate: ord.orderDate || ord.bookingDate,
      deliveryDate: ord.dueDate || ord.deliveryDate,
      items: ord.items || [],
      totalAmount: ord.amount || ord.totalAmount,
      advancePaid: ord.advancePaid || 0,
      balance: ord.balanceAmount !== undefined ? ord.balanceAmount : (ord.balance || 0),
      totalPieces: ord.totalPcs || ord.totalPieces
    };

    setCurrentPrintOrder(printableOrder);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // POS State Handlers
  const handleAddItemToCart = (item, computedPrice) => {
    const cartId = `${item.id}_${selectedService.id}`;
    const ratio = item.pcsPerUnit || getPiecesRatio(item.name);
    setCart((prevCart) => {
      const idx = prevCart.findIndex((c) => c.cartId === cartId);
      if (idx > -1) {
        const updated = [...prevCart];
        const currentQty = updated[idx].qty;
        const currentPcs = updated[idx].pcs !== undefined ? updated[idx].pcs : currentQty * ratio;
        updated[idx] = {
          ...updated[idx],
          qty: currentQty + 1,
          pcs: currentPcs + ratio,
          ratio: ratio
        };
        return updated;
      }
      return [
        ...prevCart,
        {
          cartId,
          itemId: item.id,
          name: item.name,
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          price: computedPrice,
          qty: 1,
          pcs: ratio,
          ratio: ratio
        }
      ];
    });
  };

  const handleUpdateCartQty = (targetKey, delta, maybeDelta) => {
    const actualDelta = typeof maybeDelta === 'number' ? maybeDelta : (typeof delta === 'number' ? delta : 1);
    setCart((prevCart) =>
      prevCart
        .map((it) => {
          const isMatch =
            it.cartId === targetKey ||
            it.itemId === targetKey ||
            `${it.itemId}_${it.serviceId}` === targetKey ||
            (typeof targetKey === 'string' && (targetKey.startsWith(it.itemId) || targetKey.includes(it.cartId)));

          if (isMatch) {
            const newQty = it.qty + actualDelta;
            if (newQty <= 0) return null;
            const ratio = it.ratio || getPiecesRatio(it.name);
            const currentPcs = it.pcs !== undefined ? it.pcs : it.qty * ratio;
            const newPcs = Math.max(1, currentPcs + (actualDelta * ratio));
            return { ...it, qty: newQty, pcs: newPcs, ratio };
          }
          return it;
        })
        .filter(Boolean)
    );
  };

  const handleUpdateCartPcs = (targetKey, delta, maybeDelta) => {
    const actualDelta = typeof maybeDelta === 'number' ? maybeDelta : (typeof delta === 'number' ? delta : 1);
    setCart((prevCart) =>
      prevCart.map((it) => {
        const isMatch =
          it.cartId === targetKey ||
          it.itemId === targetKey ||
          `${it.itemId}_${it.serviceId}` === targetKey ||
          (typeof targetKey === 'string' && (targetKey.startsWith(it.itemId) || targetKey.includes(it.cartId)));

        if (isMatch) {
          const currentPcs = it.pcs !== undefined ? it.pcs : it.qty;
          const newPcs = Math.max(1, currentPcs + actualDelta);
          return { ...it, pcs: newPcs };
        }
        return it;
      })
    );
  };

  const handleRemoveCartItem = (targetKey, serviceId) => {
    setCart((prevCart) =>
      prevCart.filter((it) => {
        const isMatch =
          it.cartId === targetKey ||
          it.itemId === targetKey ||
          `${it.itemId}_${it.serviceId}` === targetKey ||
          (serviceId && it.itemId === targetKey && it.serviceId === serviceId) ||
          (typeof targetKey === 'string' && (targetKey.startsWith(it.itemId) || targetKey.includes(it.cartId)));
        return !isMatch;
      })
    );
  };

  const handleClearCart = () => {
    setCart([]);
    setAdvancePaid('');
  };

  // Complete POS Order & Auto-Generate QDC Order
  const handleCompletePOSOrder = () => {
    if (cart.length === 0 || !customerPhone.trim()) return;

    const totalBill = cart.reduce((acc, it) => acc + it.price * it.qty, 0);
    const advanceAmount = Number(advancePaid) || 0;
    const balanceDue = Math.max(0, totalBill - advanceAmount);
    const totalQty = cart.reduce((acc, it) => acc + it.qty, 0);
    const totalPcs = cart.reduce((acc, it) => acc + (it.pcs !== undefined ? it.pcs : it.qty), 0);

    // Find or create customer
    const existingCust = customers.find(
      (c) => c.mobile.replace(/\D/g, '') === customerPhone.replace(/\D/g, '')
    );
    const customerId = existingCust ? existingCust.id : `CUST-${Math.floor(100 + Math.random() * 900)}`;

    const nextOrderNum = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      orderNo: nextOrderNum,
      id: nextOrderNum,
      customerId: customerId,
      customerName: customerName.trim() || (existingCust?.name || 'Walk-in Customer'),
      phone: customerPhone.trim(),
      orderDate: new Date().toISOString().split('T')[0],
      dueDate: deliveryDate || getDefaultDeliveryDate(),
      totalQty: totalQty,
      totalPcs: totalPcs,
      totalPieces: totalPcs,
      underProcess: totalPcs,
      ready: 0,
      delivered: 0,
      amount: totalBill,
      totalAmount: totalBill,
      advancePaid: advanceAmount,
      balanceAmount: balanceDue,
      balance: balanceDue,
      status: 'process',
      paymentStatus: balanceDue === 0 ? 'paid' : (advanceAmount > 0 ? 'partial' : 'unpaid'),
      items: cart.map((c) => ({
        name: c.name,
        serviceName: c.serviceName,
        qty: c.qty,
        pcs: c.pcs !== undefined ? c.pcs : c.qty,
        price: c.price
      }))
    };

    // Prepend to orders
    setOrders((prev) => [newOrder, ...prev]);

    // Update customer due amount if needed
    if (existingCust && balanceDue > 0) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === existingCust.id
            ? { ...c, amountDue: (c.amountDue || 0) + balanceDue, lastVisit: 'Today' }
            : c
        )
      );
    } else if (!existingCust) {
      // Create new customer profile
      const newCust = {
        id: customerId,
        membershipId: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
        name: customerName.trim() || 'Walk-in Customer',
        mobile: customerPhone.trim(),
        email: `${customerName.trim().toLowerCase().replace(/\s+/g, '') || 'client'}@example.com`,
        address: 'Walk-in Store Order',
        preferences: ['Medium Starch'],
        rating: 5,
        creditRating: 'A',
        lastVisit: 'Today',
        customerSince: new Date().toISOString().split('T')[0],
        notes: 'Walk-in POS booking',
        amountDue: balanceDue,
        totalSpent: totalBill
      };
      setCustomers((prev) => [newCust, ...prev]);
    }

    // Set thermal print
    setCurrentPrintOrder({
      id: newOrder.orderNo,
      customerName: newOrder.customerName,
      phone: newOrder.phone,
      bookingDate: newOrder.orderDate,
      deliveryDate: newOrder.dueDate,
      items: newOrder.items,
      totalAmount: newOrder.amount,
      advancePaid: newOrder.advancePaid,
      balance: newOrder.balanceAmount,
      totalPieces: newOrder.totalPcs
    });

    // Reset POS
    setCart([]);
    setAdvancePaid('');
    setCustomerPhone('');
    setCustomerName('');
    setDeliveryDate(getDefaultDeliveryDate());

    showToast(`Order #${nextOrderNum} booked! Printing 80mm receipt...`);

    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Workshop Pipeline status changer
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.orderNo === orderId || o.id === orderId) {
          const isReady = newStatus === 'Ready for Pickup' || newStatus === 'ready';
          const isDelivered = newStatus === 'Delivered' || newStatus === 'delivered';

          return {
            ...o,
            status: isDelivered ? 'delivered' : isReady ? 'ready' : 'process',
            ready: isReady ? o.totalPcs : isDelivered ? 0 : 0,
            underProcess: isReady || isDelivered ? 0 : o.totalPcs,
            delivered: isDelivered ? o.totalPcs : 0,
            balanceAmount: isDelivered ? 0 : o.balanceAmount
          };
        }
        return o;
      })
    );
    showToast(`Order #${orderId} marked as "${newStatus}"!`);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">

      {/* 80mm Monospace Thermal Receipt for Print Preview */}
      <ThermalSlip order={currentPrintOrder} />

      {/* Login Gate Modal */}
      {!currentUser && (
        <LoginModal
          isOpen={!currentUser}
          onLogin={(user) => {
            setCurrentUser(user);
            showToast(`Welcome back, ${user.name}!`);
          }}
        />
      )}

      {/* Top Header with Alerts & Operator Pill */}
      <TopHeader
        currentUser={currentUser}
        onLogout={() => {
          localStorage.removeItem('qdc_user');
          setCurrentUser(null);
        }}
        pendingPickups={WORKSHOP_METRICS.pendingDeliveries}
        onOpenPendingModal={() => setIsDashboardModalOpen(true)}
        onNavigateHome={() => setActiveMenu('home')}
      />

      {/* Shell Layout: Sidebar + Main Content */}
      <div className="flex-1 flex items-start">

        {/* Collapsible Left Vertical Sidebar */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={(menuId) => {
            if (menuId === 'customer') {
              setSelectedCustomer(null);
            }
            setActiveMenu(menuId);
          }}
          collapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Center Work Area */}
        <main className="flex-1 min-w-0">

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/25 flex items-center space-x-3 text-sm animate-bounce border border-emerald-400">
              <span className="text-white text-lg font-black">✓</span>
              <span className="font-semibold">{toastMessage}</span>
            </div>
          )}

          {/* View 1: Home Search Portal (image_5d591d layout) */}
          {activeMenu === 'home' && (
            <HomeSearchPortal
              customers={customers}
              orders={orders}
              onSelectCustomer={handleSelectCustomer}
              onSelectOrder={handleSelectOrderFromSearch}
              onAddNewCustomer={handleOpenNewCustomerModal}
              onOpenDashboard={() => setIsDashboardModalOpen(true)}
              onOpenPOSBooking={() => setActiveMenu('pos')}
            />
          )}

          {/* View 2: POS Booking Terminal */}
          {activeMenu === 'pos' && (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    Counter POS Terminal &amp; Garment Tagging
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Fast single-store garment booking with instant service multiplier
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMenu('home')}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  ← Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                  <ServiceSelector
                    selectedService={selectedService}
                    onSelectService={setSelectedService}
                  />
                  <ItemGrid
                    selectedService={selectedService}
                    onAddItem={handleAddItemToCart}
                    cart={cart}
                  />
                </div>

                <div className="lg:col-span-5 xl:col-span-4 sticky top-4">
                  <CartDrawer
                    cart={cart}
                    onUpdateQty={handleUpdateCartQty}
                    onUpdatePcs={handleUpdateCartPcs}
                    onRemoveItem={handleRemoveCartItem}
                    onClearCart={handleClearCart}
                    customerPhone={customerPhone}
                    setCustomerPhone={setCustomerPhone}
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    deliveryDate={deliveryDate}
                    setDeliveryDate={setDeliveryDate}
                    advancePaid={advancePaid}
                    setAdvancePaid={setAdvancePaid}
                    onCompleteOrder={handleCompletePOSOrder}
                  />
                </div>
              </div>
            </div>
          )}

          {/* View 2.5: Dedicated Drop / New Booking Screen (frm_New_Booking.aspx layout from user screenshot) */}
          {activeMenu === 'drop_booking' && (
            <DropNewBookingView
              customer={selectedCustomer}
              allCustomers={customers}
              orders={orders}
              onBack={() => {
                if (selectedCustomer) {
                  setActiveMenu('customer');
                } else {
                  setActiveMenu('home');
                }
              }}
              onSaveOrder={handleSaveDropBookingOrder}
              onPrintReceipt={handlePrintReceipt}
            />
          )}

          {/* View 3: Customer Hub & Tabular Order History View */}
          {activeMenu === 'customer' && selectedCustomer && (
            <CustomerOrderDetailView
              customer={selectedCustomer}
              orders={orders}
              onBack={() => setSelectedCustomer(null)}
              onDropNewOrder={handleDropNewOrder}
              onPickUpOrder={handleOpenPickUpModal}
              onPrintOrder={handlePrintReceipt}
              onEditCustomer={(cust) => {
                showToast(`Editing profile for ${cust.name}`);
              }}
            />
          )}

          {activeMenu === 'customer' && !selectedCustomer && (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    Customer Database &amp; Accounts
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Total {customers.length} registered customers • Click any customer to view detailed tabular order history
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {/* View Mode Switcher */}
                  <div className="bg-slate-200/80 p-1 rounded-xl flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setCustomerViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${customerViewMode === 'table'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      📋 Table View
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerViewMode('grid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${customerViewMode === 'grid'
                          ? 'bg-white text-emerald-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      ⊞ Cards Grid
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Search name, phone..."
                      value={customerFilterText}
                      onChange={(e) => setCustomerFilterText(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-slate-800"
                    />
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenNewCustomerModal('')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all whitespace-nowrap"
                  >
                    + Add New Customer
                  </button>
                </div>
              </div>

              {/* View Mode 1: Tabular Directory Table */}
              {customerViewMode === 'table' && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#6c757d] text-white font-bold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Contact Phone</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Address</th>
                        <th className="py-3 px-4 text-center">Last Visit</th>
                        <th className="py-3 px-4 text-right">Balance Due</th>
                        <th className="py-3 px-4 text-center">Rating</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers
                        .filter((c) => {
                          if (!customerFilterText.trim()) return true;
                          const q = customerFilterText.toLowerCase().trim();
                          return (
                            c.name.toLowerCase().includes(q) ||
                            c.mobile.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
                            c.address.toLowerCase().includes(q)
                          );
                        })
                        .map((c) => (
                          <tr
                            key={c.id}
                            onClick={() => handleSelectCustomer(c)}
                            className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                                  {c.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{c.name}</span>
                                  {c.membershipId && (
                                    <span className="text-[10px] text-slate-400 font-mono">{c.membershipId}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-slate-700">
                              {c.mobile}
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {c.email || '—'}
                            </td>
                            <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                              {c.address}
                            </td>
                            <td className="py-3 px-4 text-center font-medium text-slate-700">
                              {c.lastVisit || '1 Days'}
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold">
                              <span className={c.amountDue > 0 ? 'text-rose-600' : 'text-emerald-700'}>
                                Rs. {c.amountDue || 0}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-amber-500 font-bold">
                              ★ {c.rating}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectCustomer(c);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition-all shadow-2xs"
                              >
                                View Order History ➔
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* View Mode 2: Cards Grid */}
              {customerViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customers
                    .filter((c) => {
                      if (!customerFilterText.trim()) return true;
                      const q = customerFilterText.toLowerCase().trim();
                      return (
                        c.name.toLowerCase().includes(q) ||
                        c.mobile.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
                        c.address.toLowerCase().includes(q)
                      );
                    })
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCustomer(c)}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg cursor-pointer transition-all space-y-3 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                              {c.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{c.name}</h3>
                              <span className="text-[11px] font-mono text-slate-400">{c.mobile}</span>
                            </div>
                          </div>
                          <span className="text-amber-500 text-xs">★ {c.rating}</span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1">📍 {c.address}</p>

                        <div className="flex flex-wrap gap-1">
                          {c.preferences.map((p, i) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                              {p}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className={c.amountDue > 0 ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                            {c.amountDue > 0 ? `Due: Rs. ${c.amountDue}` : 'No Balance'}
                          </span>
                          <span className="text-emerald-600 font-bold group-hover:text-emerald-700 underline">
                            📋 Tabular Order History ➔
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* View 4: Dashboard / Order Processing Pipeline */}
          {activeMenu === 'dashboard' && (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    Workshop Processing &amp; Orders Pipeline
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Live tracking of garments in wash, pressing, ready, and delivered
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDashboardModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all"
                >
                  Open Daily Pulse Modal
                </button>
              </div>

              <OrderTable
                orders={orders.map((o) => ({
                  id: o.orderNo || o.id,
                  customerName: o.customerName,
                  phone: o.phone,
                  totalPieces: o.totalPcs || o.totalPieces,
                  deliveryDate: o.dueDate || o.deliveryDate,
                  bookingDate: o.orderDate || o.bookingDate,
                  totalAmount: o.amount || o.totalAmount,
                  advancePaid: o.advancePaid || 0,
                  balance: o.balanceAmount !== undefined ? o.balanceAmount : (o.balance || 0),
                  status: o.status === 'ready' ? 'Ready for Pickup' : o.status === 'delivered' ? 'Delivered' : 'In Wash',
                  items: o.items || []
                }))}
                onUpdateStatus={handleUpdateOrderStatus}
                onPrintOrder={handlePrintReceipt}
              />
            </div>
          )}

          {/* View 5: Reports / Setup / Support Info */}
          {(activeMenu === 'reports' || activeMenu === 'setup' || activeMenu === 'support' || activeMenu === 'livechat') && (
            <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-3xl">
                ⚙️
              </div>
              <h2 className="text-xl font-black text-slate-900 capitalize">
                {activeMenu} Management Module
              </h2>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Single-store operational preferences, daily revenue statement, GST reporting, and support hotline integration.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => setActiveMenu('home')}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Return to Home Search
                </button>
                <button
                  onClick={() => setActiveMenu('pos')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all"
                >
                  Go to POS Booking
                </button>
              </div>
            </div>
          )}

        </main>

      </div>


      {/* New Customer Modal */}
      <NewCustomerModal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        onSaveCustomer={handleSaveCustomer}
        initialQuery={newCustomerInitialQuery}
      />

      {/* Daily Dashboard Modal */}
      <DailyDashboardModal
        isOpen={isDashboardModalOpen}
        onClose={() => setIsDashboardModalOpen(false)}
        metrics={WORKSHOP_METRICS}
        orders={orders}
        onSelectOrder={handleSelectOrderFromSearch}
      />

      {/* Pick Up & Settlement Modal */}
      <PickUpSettlementModal
        customer={selectedCustomer}
        orders={orders}
        isOpen={isPickUpModalOpen}
        onClose={() => setIsPickUpModalOpen(false)}
        onConfirmDelivery={handleConfirmPickUpSettlement}
      />

    </div>
  );
}
