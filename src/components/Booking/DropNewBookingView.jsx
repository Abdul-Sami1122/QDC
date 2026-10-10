import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ITEMS, SERVICES } from '../../data/mockData';

// Comprehensive list of standard dry cleaning & laundry garments
const EXPANDED_ITEMS = [
  { id: 'it_1', name: 'MENS SHIRT', category: 'Men', basePrice: 200, icon: '👕' },
  { id: 'it_2', name: 'SUIT (2 PC)', category: 'Men', basePrice: 500, icon: '👔' },
  { id: 'it_3', name: 'SUIT (3 PC)', category: 'Men', basePrice: 750, icon: '👔' },
  { id: 'it_4', name: 'TROUSERS / PENT', category: 'Men', basePrice: 200, icon: '👖' },
  { id: 'it_5', name: 'SHALWAR KAMEEZ', category: 'Men', basePrice: 350, icon: '👘' },
  { id: 'it_6', name: 'COAT / BLAZER', category: 'Men', basePrice: 400, icon: '🧥' },
  { id: 'it_7', name: 'PRINCE COAT', category: 'Men', basePrice: 600, icon: '🧥' },
  { id: 'it_8', name: 'SHERWANI', category: 'Men', basePrice: 1200, icon: '👑' },
  { id: 'it_9', name: 'WAISTCOAT', category: 'Men', basePrice: 300, icon: '🦺' },
  { id: 'it_10', name: 'KURTA', category: 'Men', basePrice: 250, icon: '👘' },
  { id: 'it_11', name: 'LADIES SUIT (2 PC)', category: 'Women', basePrice: 350, icon: '👗' },
  { id: 'it_12', name: 'LADIES SUIT (3 PC)', category: 'Women', basePrice: 450, icon: '👗' },
  { id: 'it_13', name: 'SILK DRESS / FROCK', category: 'Women', basePrice: 550, icon: '👗' },
  { id: 'it_14', name: 'ABAYA / HIJAB', category: 'Women', basePrice: 400, icon: '🧕' },
  { id: 'it_15', name: 'LEHENGA / BRIDAL', category: 'Women', basePrice: 1500, icon: '✨' },
  { id: 'it_16', name: 'SAREE / SARI', category: 'Women', basePrice: 600, icon: '🥻' },
  { id: 'it_17', name: 'DUPATTA / SHAWL', category: 'Women', basePrice: 200, icon: '🧣' },
  { id: 'it_18', name: 'BLANKET (SINGLE)', category: 'Household', basePrice: 600, icon: '🛏️' },
  { id: 'it_19', name: 'BLANKET (DOUBLE)', category: 'Household', basePrice: 900, icon: '🛌' },
  { id: 'it_20', name: 'DUVET / QUILT', category: 'Household', basePrice: 800, icon: '🛌' },
  { id: 'it_21', name: 'CURTAIN PANEL', category: 'Household', basePrice: 300, icon: '🪟' },
  { id: 'it_22', name: 'BED SHEET', category: 'Household', basePrice: 250, icon: '🛏️' },
  { id: 'it_23', name: 'LEATHER JACKET', category: 'Special', basePrice: 1000, icon: '🧥' }
];

// Common laundry and dry cleaning descriptions / remarks
const COMMON_DESCRIPTIONS = [
  'Medium Starch',
  'No Starch / Soft Press',
  'Hard Collar Starch',
  'Stain on front',
  'Stain on collar',
  'Oil / Grease mark',
  'Missing button',
  'Delicate fabric',
  'Crease sleeves',
  'Flat fold',
  'Hanger Pack',
  'Steam Press Only',
  'Urgent Delivery'
];

// Common garment colors with visual swatches
const COMMON_COLORS = [
  { name: 'White', hex: '#ffffff', border: true },
  { name: 'Black', hex: '#000000' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Grey / Charcoal', hex: '#64748b' },
  { name: 'Dark Brown', hex: '#78350f' },
  { name: 'Beige / Cream', hex: '#fef08a', border: true },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Maroon', hex: '#881337' },
  { name: 'Dark Green', hex: '#15803d' },
  { name: 'Yellow', hex: '#eab308' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Golden', hex: '#d97706' },
  { name: 'Silver', hex: '#94a3b8' },
  { name: 'Multi-Color / Printed', hex: 'linear-gradient(135deg, #ef4444, #eab308, #3b82f6)' }
];

export default function DropNewBookingView({
  customer,
  allCustomers = [],
  orders = [],
  onBack,
  onSaveOrder,
  onPrintReceipt
}) {
  // Booking Header State
  const [selectedCust, setSelectedCust] = useState(customer || allCustomers[0] || null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState(customer ? customer.name : '');
  const [orderDate, setOrderDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  });
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  });
  const [dueTime, setDueTime] = useState('4 PM');
  const [remarks, setRemarks] = useState('');
  const [rateList, setRateList] = useState('Default');
  const [commPref, setCommPref] = useState('WhatsApp');
  const [homeDelivery, setHomeDelivery] = useState('No');
  const [smsNotification, setSmsNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [workshopNotes, setWorkshopNotes] = useState('');
  const [checkedBy, setCheckedBy] = useState('Farhan Ali (Store Manager)');

  // Surcharges
  const [sameDayExtra, setSameDayExtra] = useState(false);
  const [nextDayExtra, setNextDayExtra] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  // New Garment Row Entry State (Table inputs from screenshot)
  const [entryQty, setEntryQty] = useState(1);
  const [entryPcs, setEntryPcs] = useState(1);
  const [entryItemName, setEntryItemName] = useState('MENS SHIRT');
  const [entryDescription, setEntryDescription] = useState('');
  const [entryColor, setEntryColor] = useState('');
  const [entryServiceCode, setEntryServiceCode] = useState('DC');
  const [entryPrice, setEntryPrice] = useState(200);
  const [editingGarmentId, setEditingGarmentId] = useState(null);

  // Helper to detect multi-piece garments
  const getPiecesRatio = (name) => {
    if (!name) return 1;
    if (name.includes('(3 PC)') || name.includes('3 PC')) return 3;
    if (name.includes('(2 PC)') || name.includes('2 PC')) return 2;
    return 1;
  };

  // Added Garments in this Booking
  const [bookedGarments, setBookedGarments] = useState([
    {
      id: 1,
      qty: 1,
      pcs: 1,
      name: 'MENS SHIRT',
      description: 'Starch medium collar',
      color: 'White',
      serviceCode: 'DC',
      serviceName: 'Dry Clean',
      price: 200,
      amount: 200
    }
  ]);

  // Payment & Discount State
  const [discountType, setDiscountType] = useState('flat'); // 'flat' | 'percent'
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [advancePaid, setAdvancePaid] = useState('');

  // Update customer fields when customer prop changes
  useEffect(() => {
    if (customer) {
      setSelectedCust(customer);
      setCustomerSearchQuery(customer.name);
    }
  }, [customer]);

  // Autocomplete Suggestions State for Item Name
  const [isItemSuggestionsOpen, setIsItemSuggestionsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const itemInputRef = useRef(null);
  const suggestionsBoxRef = useRef(null);

  // Suggestions State for Description
  const [isDescSuggestionsOpen, setIsDescSuggestionsOpen] = useState(false);
  const descBoxRef = useRef(null);

  // Suggestions State for Color
  const [isColorSuggestionsOpen, setIsColorSuggestionsOpen] = useState(false);
  const colorBoxRef = useRef(null);

  // Filtered Item Suggestions based on custom typing
  const filteredItemSuggestions = useMemo(() => {
    const query = (entryItemName || '').trim().toLowerCase();
    if (!query) return EXPANDED_ITEMS;
    return EXPANDED_ITEMS.filter(
      (it) =>
        it.name.toLowerCase().includes(query) ||
        it.category.toLowerCase().includes(query)
    );
  }, [entryItemName]);

  // Filtered Description Suggestions
  const filteredDescSuggestions = useMemo(() => {
    const q = (entryDescription || '').trim().toLowerCase();
    if (!q) return COMMON_DESCRIPTIONS;
    return COMMON_DESCRIPTIONS.filter((d) => d.toLowerCase().includes(q));
  }, [entryDescription]);

  // Filtered Color Suggestions
  const filteredColorSuggestions = useMemo(() => {
    const q = (entryColor || '').trim().toLowerCase();
    if (!q) return COMMON_COLORS;
    return COMMON_COLORS.filter((c) => c.name.toLowerCase().includes(q));
  }, [entryColor]);

  // Check if any autocomplete dropdown is open
  const isAnyDropdownOpen = isItemSuggestionsOpen || isDescSuggestionsOpen || isColorSuggestionsOpen;

  // Click outside listener to close all suggestion dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsBoxRef.current && !suggestionsBoxRef.current.contains(e.target)) {
        setIsItemSuggestionsOpen(false);
      }
      if (descBoxRef.current && !descBoxRef.current.contains(e.target)) {
        setIsDescSuggestionsOpen(false);
      }
      if (colorBoxRef.current && !colorBoxRef.current.contains(e.target)) {
        setIsColorSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation for item suggestions
  const handleItemInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsItemSuggestionsOpen(true);
      setHighlightedIndex((prev) =>
        prev < filteredItemSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsItemSuggestionsOpen(true);
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItemSuggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (isItemSuggestionsOpen && highlightedIndex >= 0 && filteredItemSuggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelectSuggestion(filteredItemSuggestions[highlightedIndex]);
      } else {
        setIsItemSuggestionsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsItemSuggestionsOpen(false);
    }
  };

  // Select Item from Suggestion Dropdown
  const handleSelectSuggestion = (item) => {
    setEntryItemName(item.name);
    setIsItemSuggestionsOpen(false);
    const srv = SERVICES.find((s) => s.code === entryServiceCode) || SERVICES[0];
    setEntryPrice(Math.round(item.basePrice * srv.multiplier));
    setEntryPcs(Math.max(1, Number(entryQty) || 1) * getPiecesRatio(item.name));
    itemInputRef.current?.focus();
  };

  // Dynamic Price update when item or service changes
  const handleItemSelect = (itemName) => {
    setEntryItemName(itemName);
    const foundItem = EXPANDED_ITEMS.find((it) => it.name.toLowerCase() === itemName.toLowerCase());
    const base = foundItem ? foundItem.basePrice : 200;
    const srv = SERVICES.find((s) => s.code === entryServiceCode) || SERVICES[0];
    setEntryPrice(Math.round(base * srv.multiplier));
    setEntryPcs(Math.max(1, Number(entryQty) || 1) * getPiecesRatio(itemName));
  };

  const handleServiceSelect = (code) => {
    setEntryServiceCode(code);
    const foundItem = EXPANDED_ITEMS.find((it) => it.name.toLowerCase() === entryItemName.toLowerCase());
    const base = foundItem ? foundItem.basePrice : 200;
    const srv = SERVICES.find((s) => s.code === code) || SERVICES[0];
    setEntryPrice(Math.round(base * srv.multiplier));
  };

  // Add or Update Row in Table
  const handleAddGarment = () => {
    if (!entryItemName.trim()) return;
    const qty = Math.max(1, Number(entryQty) || 1);
    const pcs = Math.max(1, Number(entryPcs) || qty);
    const price = Math.max(0, Number(entryPrice) || 0);
    const srv = SERVICES.find((s) => s.code === entryServiceCode) || { name: 'Dry Clean' };

    if (editingGarmentId) {
      setBookedGarments((prev) =>
        prev.map((g) =>
          g.id === editingGarmentId
            ? {
                ...g,
                qty,
                pcs,
                name: entryItemName.trim(),
                description: entryDescription.trim() || '—',
                color: entryColor.trim() || 'Standard',
                serviceCode: entryServiceCode,
                serviceName: srv.name,
                price,
                amount: qty * price
              }
            : g
        )
      );
      setEditingGarmentId(null);
    } else {
      const newRow = {
        id: Date.now(),
        qty,
        pcs,
        name: entryItemName.trim(),
        description: entryDescription.trim() || '—',
        color: entryColor.trim() || 'Standard',
        serviceCode: entryServiceCode,
        serviceName: srv.name,
        price,
        amount: qty * price
      };
      setBookedGarments((prev) => [...prev, newRow]);
    }

    // Reset entry inputs
    setEntryQty(1);
    setEntryPcs(1);
    setEntryDescription('');
    setEntryColor('');
  };

  // Edit Row in Table
  const handleEditGarment = (garment) => {
    setEditingGarmentId(garment.id);
    setEntryQty(garment.qty);
    setEntryPcs(garment.pcs || garment.qty);
    setEntryItemName(garment.name);
    setEntryDescription(garment.description === '—' ? '' : garment.description);
    setEntryColor(garment.color === 'Standard' ? '' : garment.color);
    setEntryServiceCode(garment.serviceCode);
    setEntryPrice(garment.price);
    itemInputRef.current?.focus();
  };

  const handleCancelEdit = () => {
    setEditingGarmentId(null);
    setEntryQty(1);
    setEntryPcs(1);
    setEntryDescription('');
    setEntryColor('');
  };

  // Remove Row from Table
  const handleRemoveGarment = (id) => {
    setBookedGarments((prev) => prev.filter((g) => g.id !== id));
  };

  // Totals & KPI Calculations
  const totalQty = useMemo(() => {
    return bookedGarments.reduce((sum, g) => sum + g.qty, 0);
  }, [bookedGarments]);

  const totalPieces = useMemo(() => {
    return bookedGarments.reduce((sum, g) => sum + (g.pcs || g.qty), 0);
  }, [bookedGarments]);

  const grossTotal = useMemo(() => {
    return bookedGarments.reduce((sum, g) => sum + g.amount, 0);
  }, [bookedGarments]);

  // Surcharge percentage
  const surchargeRate = (sameDayExtra ? 1.0 : 0) + (nextDayExtra ? 0.5 : 0) + (isUrgent ? 0.3 : 0);
  const surchargeAmount = Math.round(grossTotal * surchargeRate);

  const calculatedDiscount = useMemo(() => {
    if (discountType === 'percent') {
      return Math.round((grossTotal * (Number(discountValue) || 0)) / 100);
    }
    return Math.min(grossTotal, Number(discountValue) || 0);
  }, [grossTotal, discountType, discountValue]);

  const taxAmount = 0; // Configurable GST
  const netTotal = Math.max(0, grossTotal + surchargeAmount - calculatedDiscount + taxAmount);
  const advanceAmount = Math.min(netTotal, Number(advancePaid) || 0);
  const balanceDue = Math.max(0, netTotal - advanceAmount);

  // Customer Orders Pending Metrics
  const customerPendingMetrics = useMemo(() => {
    if (!selectedCust) return { clothes: 0, amount: 0, orders: 0 };
    const custOrders = orders.filter(
      (o) =>
        o.customerId === selectedCust.id ||
        (o.phone && selectedCust.mobile && o.phone.replace(/\D/g, '') === selectedCust.mobile.replace(/\D/g, ''))
    );
    const pendingOrdersList = custOrders.filter((o) => o.status !== 'delivered');
    const clothes = pendingOrdersList.reduce((sum, o) => sum + (o.totalPcs || 0), 0);
    const amount = pendingOrdersList.reduce((sum, o) => sum + (o.balanceAmount || 0), 0);
    return {
      clothes,
      amount,
      orders: pendingOrdersList.length
    };
  }, [orders, selectedCust]);

  // Save Booking Handler
  const handleFinalSave = (actionType = 'save') => {
    if (bookedGarments.length === 0) {
      alert('Please add at least one garment before saving.');
      return;
    }
    if (!selectedCust) {
      alert('Please select or specify a customer for this order.');
      return;
    }

    const orderNo = `S${Math.floor(160 + Math.random() * 840)}`;
    const newOrderObj = {
      orderNo,
      id: orderNo,
      customerId: selectedCust.id,
      customerName: selectedCust.name,
      phone: selectedCust.mobile,
      orderDate,
      dueDate,
      dueTime,
      totalPcs: totalPieces,
      underProcess: totalPieces,
      ready: 0,
      delivered: 0,
      amount: netTotal,
      advancePaid: advanceAmount,
      balanceAmount: balanceDue,
      status: 'process',
      paymentStatus: balanceDue === 0 ? 'paid' : advanceAmount > 0 ? 'partial' : 'unpaid',
      items: bookedGarments.map((g) => ({
        name: g.name,
        serviceName: g.serviceName,
        qty: g.qty,
        pcs: g.pcs || g.qty,
        price: g.price,
        description: g.description,
        color: g.color
      })),
      notes: orderNotes,
      workshopNotes,
      checkedBy
    };

    onSaveOrder?.(newOrderObj, selectedCust);

    if (actionType.includes('print')) {
      onPrintReceipt?.(newOrderObj);
    }
  };

  // Keyboard shortcut listeners (F8, F9, F10, F12, Ctrl+D)
  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === 'F8') {
        e.preventDefault();
        handleFinalSave('save');
      } else if (e.key === 'F9') {
        e.preventDefault();
        handleFinalSave('save_print_receipt');
      } else if (e.key === 'F10') {
        e.preventDefault();
        handleFinalSave('save_print_tag_receipt');
      } else if (e.key === 'F12') {
        e.preventDefault();
        handleFinalSave('save_print_tag');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack?.();
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  });

  return (
    <div className="max-w-[1400px] mx-auto p-2 sm:p-4 bg-slate-50 text-slate-800 text-xs font-sans">

      {/* Top Windows Style Header Banner (like in screenshot) */}
      <div className="bg-white border border-slate-300 rounded-t-xl px-4 py-2 flex flex-wrap items-center justify-between shadow-xs">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded border border-slate-300 font-bold transition-colors cursor-pointer flex items-center space-x-1"
          >
            <span>←</span>
            <span>Back to Customer</span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="font-extrabold text-slate-700 text-sm italic tracking-wide">
            QDC Cleaners and Laundry Services
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            (frm_New_Booking.aspx)
          </span>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center space-x-3 text-[11px] font-semibold text-slate-600">
          <button onClick={onBack} className="hover:text-emerald-600 hover:underline">Customer</button>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Drop (Active)</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold">Hi, {checkedBy.split(' ')[0]}</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border-x border-b border-slate-300 shadow-md p-3 sm:p-5 pb-0 sm:pb-0 space-y-4 rounded-b-xl">

        {/* ========================================================= */}
        {/* UPPER BOOKING FORM HEADER (Exact Fields from Screenshot) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-4 gap-y-3 pb-3 border-b border-slate-200">

          {/* Col 1: Order Metadata (Last Order#, Date, Due Date, Time) */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-slate-700">Last Order#</span>
                <span className="font-black text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded font-mono text-xs">
                  S162
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <span className="font-bold text-slate-700">Date</span>
                <input
                  type="text"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="w-24 px-2 py-0.5 border border-slate-300 rounded font-medium text-slate-800 text-center bg-slate-50"
                />
              </div>

              <div className="flex items-center space-x-1">
                <span className="font-bold text-slate-700">Due Date</span>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-24 px-2 py-0.5 border border-slate-300 rounded font-medium text-slate-800 text-center bg-white"
                />
              </div>

              <div className="flex items-center space-x-1">
                <span className="font-bold text-slate-700">Time</span>
                <input
                  type="text"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-14 px-1.5 py-0.5 border border-slate-300 rounded font-medium text-slate-800 text-center bg-white"
                />
              </div>
            </div>

            {/* Customer Preference & Remarks Line */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 min-w-[70px]">Preference:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] truncate flex-1">
                {selectedCust?.preferences?.join(', ') || 'Standard Packing'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 min-w-[70px]">Remarks :</span>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Special instruction for dry clean..."
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Mobile */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 min-w-[70px]">Mob No. :</span>
              <input
                type="text"
                value={selectedCust?.mobile || ''}
                readOnly
                className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono font-bold text-slate-800 bg-slate-50"
              />
            </div>
          </div>

          {/* Col 2: Customer Address, Comm Pref */}
          <div className="lg:col-span-4 min-w-0 space-y-2.5">
            {/* Customer Select Field with (+) button */}
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className="font-bold text-slate-700 min-w-[70px]">Customer</span>
              <select
                value={selectedCust?.id || ''}
                onChange={(e) => {
                  const c = allCustomers.find((x) => x.id === e.target.value);
                  if (c) {
                    setSelectedCust(c);
                    setCustomerSearchQuery(c.name);
                  }
                }}
                className="w-32 sm:w-40 px-2 py-1 border border-slate-300 rounded font-bold text-slate-700 bg-white truncate flex-shrink-0"
              >
                <option value="">All</option>
                {allCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.mobile})
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                placeholder="Search or enter name"
                className="min-w-0 flex-1 px-2 py-1 border border-slate-300 rounded font-bold text-slate-900 bg-white"
              />
            </div>

            {/* Address */}
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-bold text-slate-600 min-w-[70px]">Address :</span>
              <span className="text-slate-700 font-medium truncate flex-1 min-w-0 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                {selectedCust?.address || 'Walk-in client'}
              </span>
            </div>

            {/* Comm Pref */}
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 min-w-[70px]">Comm Pref:</span>
              <select
                value={commPref}
                onChange={(e) => setCommPref(e.target.value)}
                className="px-2 py-1 border border-slate-300 rounded font-medium text-slate-700 bg-white"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="SMS">SMS</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          {/* Col 3: Right Extra Checkboxes (Same Day, Next Day, Urgent) */}
          <div className="lg:col-span-3 min-w-0 space-y-2 pt-1 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-4">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sameDayExtra}
                onChange={(e) => setSameDayExtra(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Same Day 100% Extra</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={nextDayExtra}
                onChange={(e) => setNextDayExtra(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Next Day 50% Extra</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
              />
              <span className="text-[11px] font-bold text-red-700">Urgent</span>
            </label>
          </div>

        </div>

        {/* ========================================================= */}
        {/* ITEM ENTRY & ORDER TABLE (Grey Header from Screenshot)   */}
        {/* ========================================================= */}
        <div className={`rounded border border-slate-300 bg-white relative overflow-visible ${isAnyDropdownOpen ? 'z-30' : 'z-0'}`}>
          <table className="w-full text-left border-separate border-spacing-0 text-xs">
            <thead className="bg-[#868e96] text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-2.5 w-12 text-center rounded-tl">S.No.</th>
                <th className="py-2.5 px-2.5 w-16 text-center">Qty</th>
                <th className="py-2.5 px-2.5 w-16 text-center">Pcs</th>
                <th className="py-2.5 px-3">Item Name</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 w-32">Color</th>
                <th className="py-2.5 px-3 w-48">Service and Price</th>
                <th className="py-2.5 px-3 w-24 text-right">Amount</th>
                <th className="py-2.5 px-2 w-28 text-center rounded-tr">Action</th>
              </tr>
            </thead>

            {/* Input Entry Row (Top of Table as seen in screenshot) */}
            <tbody className="bg-slate-50/90 border-b-2 border-slate-300 relative z-30">
              <tr className="border-b border-slate-200 relative z-30">
                <td className="py-2.5 px-2 text-center font-bold text-slate-500 border-b border-slate-200">
                  {editingGarmentId
                    ? `Edit #${bookedGarments.findIndex((g) => g.id === editingGarmentId) + 1}`
                    : bookedGarments.length + 1}
                </td>

                {/* Qty Input */}
                <td className="py-2.5 px-2 text-center border-b border-slate-200">
                  <input
                    type="number"
                    min="1"
                    value={entryQty}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEntryQty(val);
                      setEntryPcs(Math.max(1, Number(val) || 1) * getPiecesRatio(entryItemName));
                    }}
                    className="w-12 text-center py-1 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                  />
                </td>

                {/* Pcs Input */}
                <td className="py-2.5 px-2 text-center border-b border-slate-200">
                  <input
                    type="number"
                    min="1"
                    value={entryPcs}
                    onChange={(e) => setEntryPcs(e.target.value)}
                    className="w-12 text-center py-1 border border-slate-300 rounded bg-white font-bold text-slate-800 focus:ring-1 focus:ring-emerald-500"
                  />
                </td>

                {/* 1. Item Name Custom Typing & Autocomplete Suggestion Field */}
                <td className="py-2.5 px-3 relative z-50 border-b border-slate-200" ref={suggestionsBoxRef}>
                  <div className="flex items-center space-x-1">
                    <div className="relative flex-1">
                      <input
                        ref={itemInputRef}
                        type="text"
                        value={entryItemName}
                        onChange={(e) => {
                          setEntryItemName(e.target.value);
                          setIsItemSuggestionsOpen(true);
                          setHighlightedIndex(0);
                          const match = EXPANDED_ITEMS.find(
                            (it) => it.name.toLowerCase() === e.target.value.trim().toLowerCase()
                          );
                          if (match) {
                            const srv = SERVICES.find((s) => s.code === entryServiceCode) || SERVICES[0];
                            setEntryPrice(Math.round(match.basePrice * srv.multiplier));
                          }
                        }}
                        onFocus={() => {
                          setIsItemSuggestionsOpen(true);
                          setIsDescSuggestionsOpen(false);
                          setIsColorSuggestionsOpen(false);
                        }}
                        onKeyDown={handleItemInputKeyDown}
                        placeholder="Type item (e.g. Shirt, Suit, Pent...)"
                        className="w-full py-1 pl-2.5 pr-6 border border-slate-300 rounded bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 uppercase text-xs shadow-2xs"
                      />
                      {/* Dropdown toggle button */}
                      <button
                        type="button"
                        onClick={() => setIsItemSuggestionsOpen(!isItemSuggestionsOpen)}
                        className="absolute right-1 top-1 bottom-1 px-1 text-slate-400 hover:text-slate-600 rounded flex items-center justify-center cursor-pointer text-[10px]"
                        title="Show item suggestions"
                      >
                        {isItemSuggestionsOpen ? '▲' : '▼'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const custom = prompt('Enter custom item name:');
                        if (custom) handleItemSelect(custom.toUpperCase());
                      }}
                      className="px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded border border-slate-300 font-bold cursor-pointer text-xs"
                      title="Add Custom Item Name"
                    >
                      +
                    </button>
                  </div>

                  {/* Autocomplete Suggestions Dropdown Popup (Floats Above All Rows) */}
                  {isItemSuggestionsOpen && (
                    <div className="absolute left-3 top-full mt-1.5 w-80 bg-white rounded-xl shadow-2xl border border-slate-300 z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
                      <div className="px-3 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-500 flex justify-between items-center sticky top-0 z-10 border-b border-slate-200">
                        <span>SUGGESTED GARMENTS ({filteredItemSuggestions.length})</span>
                        <span className="text-slate-400 font-normal">↑↓ to navigate, Enter to select</span>
                      </div>

                      {filteredItemSuggestions.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-500">
                          <p className="font-semibold text-slate-700">No standard match for &quot;{entryItemName}&quot;</p>
                          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            ✓ You can still use this as a custom item!
                          </p>
                        </div>
                      ) : (
                        filteredItemSuggestions.map((it, idx) => {
                          const isHighlighted = idx === highlightedIndex;
                          const srv = SERVICES.find((s) => s.code === entryServiceCode) || SERVICES[0];
                          const calculatedPrice = Math.round(it.basePrice * srv.multiplier);

                          return (
                            <div
                              key={it.id || it.name}
                              onClick={() => handleSelectSuggestion(it)}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              className={`px-3 py-2 cursor-pointer flex items-center justify-between transition-colors ${
                                isHighlighted ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-800'
                              }`}
                            >
                              <div className="flex items-center space-x-2.5">
                                <span className="text-base">{it.icon || '👔'}</span>
                                <div>
                                  <span className="text-xs font-bold block">{it.name}</span>
                                  <span className="text-[10px] text-slate-400 font-semibold">{it.category}</span>
                                </div>
                              </div>

                              <div className="text-right">
                                <span className="text-xs font-mono font-bold text-emerald-700">
                                  Rs. {calculatedPrice}
                                </span>
                                <span className="text-[9px] text-slate-400 block font-mono">
                                  {entryServiceCode} rate
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </td>

                {/* 2. Description Custom Typing & Autocomplete Suggestion Field */}
                <td className="py-2.5 px-3 relative z-40 border-b border-slate-200" ref={descBoxRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={entryDescription}
                      onChange={(e) => {
                        setEntryDescription(e.target.value);
                        setIsDescSuggestionsOpen(true);
                      }}
                      onFocus={() => {
                        setIsDescSuggestionsOpen(true);
                        setIsItemSuggestionsOpen(false);
                        setIsColorSuggestionsOpen(false);
                      }}
                      placeholder="e.g. Starch / stain mark"
                      className="w-full py-1 pl-2.5 pr-6 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-xs shadow-2xs"
                    />
                    <button
                      type="button"
                      onClick={() => setIsDescSuggestionsOpen(!isDescSuggestionsOpen)}
                      className="absolute right-1 top-1 bottom-1 px-1 text-slate-400 hover:text-slate-600 rounded flex items-center justify-center cursor-pointer text-[10px]"
                      title="Show description suggestions"
                    >
                      {isDescSuggestionsOpen ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* Description Suggestions Dropdown */}
                  {isDescSuggestionsOpen && (
                    <div className="absolute left-3 top-full mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-slate-300 z-50 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
                      <div className="px-3 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-500 sticky top-0 z-10 border-b border-slate-200 flex justify-between">
                        <span>COMMON NOTES / REMARKS</span>
                        <span className="text-slate-400 font-normal">Click to insert</span>
                      </div>
                      {filteredDescSuggestions.length === 0 ? (
                        <div className="p-2.5 text-center text-xs text-slate-400 italic">
                          Custom description: &quot;{entryDescription}&quot;
                        </div>
                      ) : (
                        filteredDescSuggestions.map((descText, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setEntryDescription(descText);
                              setIsDescSuggestionsOpen(false);
                            }}
                            className="px-3 py-2 text-xs hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer text-slate-700 font-medium transition-colors flex items-center space-x-1.5"
                          >
                            <span className="text-emerald-500 font-bold text-xs">✓</span>
                            <span>{descText}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </td>

                {/* 3. Color Custom Typing & Autocomplete Suggestion Field */}
                <td className="py-2.5 px-3 relative z-30 border-b border-slate-200" ref={colorBoxRef}>
                  <div className="relative">
                    <input
                      type="text"
                      value={entryColor}
                      onChange={(e) => {
                        setEntryColor(e.target.value);
                        setIsColorSuggestionsOpen(true);
                      }}
                      onFocus={() => {
                        setIsColorSuggestionsOpen(true);
                        setIsItemSuggestionsOpen(false);
                        setIsDescSuggestionsOpen(false);
                      }}
                      placeholder="e.g. Blue"
                      className="w-full py-1 pl-2.5 pr-6 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 text-xs shadow-2xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setIsColorSuggestionsOpen(!isColorSuggestionsOpen)}
                      className="absolute right-1 top-1 bottom-1 px-1 text-slate-400 hover:text-slate-600 rounded flex items-center justify-center cursor-pointer text-[10px]"
                      title="Show color suggestions"
                    >
                      {isColorSuggestionsOpen ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* Color Suggestions Dropdown with Swatches */}
                  {isColorSuggestionsOpen && (
                    <div className="absolute left-3 top-full mt-1.5 w-64 bg-white rounded-xl shadow-2xl border border-slate-300 z-50 max-h-56 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-100">
                      <div className="px-3 py-1.5 bg-slate-100 text-[10px] font-bold text-slate-500 sticky top-0 z-10 border-b border-slate-200 flex justify-between">
                        <span>POPULAR COLORS</span>
                        <span className="text-slate-400 font-normal">Click to pick</span>
                      </div>
                      {filteredColorSuggestions.length === 0 ? (
                        <div className="p-2.5 text-center text-xs text-slate-400 italic">
                          Custom color: &quot;{entryColor}&quot;
                        </div>
                      ) : (
                        filteredColorSuggestions.map((clr, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setEntryColor(clr.name);
                              setIsColorSuggestionsOpen(false);
                            }}
                            className="px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-900 cursor-pointer text-slate-700 font-medium transition-colors flex items-center space-x-2.5"
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full inline-block shadow-2xs flex-shrink-0"
                              style={{
                                background: clr.hex,
                                border: clr.border ? '1px solid #cbd5e1' : 'none'
                              }}
                            />
                            <span>{clr.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </td>

                {/* Service and Price Input */}
                <td className="py-2 px-3">
                  <div className="flex items-center space-x-1.5">
                    <select
                      value={entryServiceCode}
                      onChange={(e) => handleServiceSelect(e.target.value)}
                      className="py-1 px-2 border border-slate-300 rounded bg-white font-bold text-slate-800"
                    >
                      <option value="DC">DC</option>
                      <option value="WI">WI</option>
                      <option value="SI">SI</option>
                    </select>

                    <input
                      type="number"
                      value={entryPrice}
                      onChange={(e) => setEntryPrice(Number(e.target.value))}
                      className="w-16 py-1 px-1.5 border border-slate-300 rounded bg-white text-right font-mono font-bold text-slate-900"
                    />

                    <span className="text-slate-400 font-bold">+</span>
                  </div>
                </td>

                {/* Calculated Amount for entry */}
                <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                  {(Number(entryQty) || 1) * (Number(entryPrice) || 0)}
                </td>

                {/* Add / Update Button */}
                <td className="py-2 px-2 text-center border-b border-slate-200">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      type="button"
                      onClick={handleAddGarment}
                      className={`px-3 py-1 rounded border font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                        editingGarmentId
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-xs'
                          : 'bg-slate-300 hover:bg-emerald-600 hover:text-white border-slate-400'
                      }`}
                    >
                      {editingGarmentId ? 'Update' : 'Add'}
                    </button>
                    {editingGarmentId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-1.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded border border-slate-300 text-xs font-bold cursor-pointer"
                        title="Cancel edit"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>

            {/* List of Added Garment Rows */}
            <tbody className="divide-y divide-slate-200 relative z-0">
              {bookedGarments.map((g, idx) => (
                <tr key={g.id} className="hover:bg-slate-50 transition-colors relative z-0">
                  <td className="py-2 px-2 text-center font-bold text-slate-600">{idx + 1}</td>
                  <td className="py-2 px-2 text-center font-bold text-slate-800">{g.qty}</td>
                  <td className="py-2 px-2 text-center font-bold text-slate-800">{g.pcs || g.qty}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{g.name}</td>
                  <td className="py-2 px-3 text-slate-600 italic">{g.description}</td>
                  <td className="py-2 px-3 text-slate-700">{g.color}</td>
                  <td className="py-2 px-3 font-semibold text-slate-800">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[11px] mr-1">
                      {g.serviceCode}
                    </span>
                    <span>Rs. {g.price}</span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                    Rs. {g.amount}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleEditGarment(g)}
                        className="text-sky-600 hover:text-sky-800 hover:bg-sky-50 px-1.5 py-0.5 rounded font-bold text-xs cursor-pointer flex items-center space-x-0.5 transition-colors"
                        title="Edit this garment item"
                      >
                        <span>✏️</span>
                        <span className="text-[10px] uppercase font-bold">Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (editingGarmentId === g.id) handleCancelEdit();
                          handleRemoveGarment(g.id);
                        }}
                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-1.5 py-0.5 rounded font-bold text-xs cursor-pointer transition-colors"
                        title="Remove garment"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* STICKY BOTTOM SECTION: QTY + 3 PANELS + 4 ACTIONS + TOTALS*/}
        {/* ========================================================= */}
        <div className="sticky bottom-0 z-20 bg-white border-t border-slate-300 -mx-3 sm:-mx-5 p-3 sm:p-4 rounded-b-xl shadow-[0_-4px_16px_rgba(0,0,0,0.12)] space-y-2">

          {/* Qty & Pcs Count Line */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <div className="flex items-center space-x-6">
              <span className="text-sm">
                Qty : <strong className="font-black text-base text-slate-900">{totalQty}</strong>
              </span>
              <span className="text-sm">
                Pcs : <strong className="font-black text-base text-emerald-800">{totalPieces}</strong>
              </span>
              <span className="text-slate-500 font-medium">Home Delivery : <kbd className="bg-slate-100 border px-1 rounded font-mono">Ctrl+H</kbd></span>
            </div>

            {surchargeAmount > 0 && (
              <span className="text-rose-600 font-bold text-xs">
                + Surcharges Applied: Rs. {surchargeAmount}
              </span>
            )}
          </div>

          {/* 3 PANELS + 4 ACTION BUTTONS + TOTALS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">

          {/* Panel 1: Home Delivery & Notes (Col 1 to 4) */}
          <div className="lg:col-span-4 border border-slate-300 rounded p-3 bg-white space-y-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* <div className="flex items-center space-x-1">
                <span className="font-bold text-slate-600">Home Delivery :</span>
                <select
                  value={homeDelivery}
                  onChange={(e) => setHomeDelivery(e.target.value)}
                  className="px-1.5 py-0.5 border border-slate-300 rounded bg-white font-semibold text-slate-700"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div> */}

              {/* <div className="flex items-center space-x-2">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <span className="font-bold text-slate-600">SMS:</span>
                  <input
                    type="checkbox"
                    checked={smsNotification}
                    onChange={(e) => setSmsNotification(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                </label>
                <select className="px-1 py-0.5 border border-slate-300 rounded text-[11px] bg-white">
                  <option value="Booking">Booking</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </div> */}

              {/* <label className="flex items-center space-x-1 cursor-pointer">
                <span className="font-bold text-slate-600">Email :</span>
                <input
                  type="checkbox"
                  checked={emailNotification}
                  onChange={(e) => setEmailNotification(e.target.checked)}
                  className="rounded text-emerald-600"
                />
              </label> */}
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 min-w-[85px]">Order Notes :</span>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="flex-1 px-2 py-0.5 border border-slate-300 rounded text-slate-800"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-600 min-w-[85px]">Workshop Notes :</span>
              <input
                type="text"
                value={workshopNotes}
                onChange={(e) => setWorkshopNotes(e.target.value)}
                className="flex-1 px-2 py-0.5 border border-slate-300 rounded text-slate-800"
              />
            </div>

            {/* <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
              <span className="font-bold text-slate-600 min-w-[85px]">Checked By :</span>
              <select
                value={checkedBy}
                onChange={(e) => setCheckedBy(e.target.value)}
                className="flex-1 px-2 py-0.5 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
              >
                <option value="Farhan Ali (Store Manager)">Farhan Ali (Store Manager)</option>
                <option value="Usman Tariq (Cashier)">Usman Tariq (Cashier)</option>
                <option value="Bilal Ahmed (Workshop Supervisor)">Bilal Ahmed (Workshop Supervisor)</option>
              </select>
            </div> */}
          </div>

          {/* Panel 2: Pending KPI Summary & 4 Big Action Buttons (Col 5 to 8) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">

            {/* KPI Summary (Pending Clothes, Pending Amount, Pending Order) */}
            <div className="flex items-center justify-around bg-slate-50 border border-slate-200 rounded p-2 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Pending Clothes :</span>
                <strong className="text-slate-900 text-sm font-black">{customerPendingMetrics.clothes}</strong>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-500 block text-[11px]">Pending Amount :</span>
                <strong className="text-rose-600 text-sm font-black font-mono">Rs. {customerPendingMetrics.amount}</strong>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-500 block text-[11px]">Pending Order :</span>
                <strong className="text-slate-900 text-sm font-black">{customerPendingMetrics.orders}</strong>
              </div>
            </div>

            {/* 4 Classic Buttons from Screenshot (F8, F9, F10, F12) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

              {/* SAVE ONLY (F8) */}
              <button
                type="button"
                id="btn-save-only"
                onClick={() => handleFinalSave('save')}
                className="py-3 px-2 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 rounded border border-slate-300 font-extrabold text-[11px] uppercase tracking-wider text-center shadow-2xs transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span>SAVE ONLY</span>
                <span className="text-[10px] text-slate-500 font-mono">(F8)</span>
              </button>

              {/* SAVE & PRINT RECEIPT (F9) */}
              <button
                type="button"
                id="btn-save-print-receipt"
                onClick={() => handleFinalSave('save_print_receipt')}
                className="py-3 px-2 bg-slate-200 hover:bg-emerald-100 hover:text-emerald-900 hover:border-emerald-300 active:bg-emerald-200 text-slate-800 rounded border border-slate-300 font-extrabold text-[11px] uppercase tracking-wider text-center shadow-2xs transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span>SAVE &amp; PRINT RECEIPT</span>
                <span className="text-[10px] text-slate-500 font-mono">(F9)</span>
              </button>

              {/* SAVE, PRINT TAG & RECEIPT (F10) */}
              <button
                type="button"
                id="btn-save-print-all"
                onClick={() => handleFinalSave('save_print_tag_receipt')}
                className="py-3 px-2 bg-slate-200 hover:bg-emerald-100 hover:text-emerald-900 hover:border-emerald-300 active:bg-emerald-200 text-slate-800 rounded border border-slate-300 font-extrabold text-[11px] uppercase tracking-wider text-center shadow-2xs transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span>SAVE, PRINT TAG &amp; RECEIPT</span>
                <span className="text-[10px] text-slate-500 font-mono">(F10)</span>
              </button>

              {/* SAVE & PRINT TAG (F12) */}
              <button
                type="button"
                id="btn-save-print-tag"
                onClick={() => handleFinalSave('save_print_tag')}
                className="py-3 px-2 bg-slate-200 hover:bg-slate-300 active:bg-slate-400 text-slate-800 rounded border border-slate-300 font-extrabold text-[11px] uppercase tracking-wider text-center shadow-2xs transition-all cursor-pointer flex flex-col items-center justify-center"
              >
                <span>SAVE &amp; PRINT TAG</span>
                <span className="text-[10px] text-slate-500 font-mono">(F12)</span>
              </button>

            </div>

          </div>

          {/* Panel 3: Right Calculation Box (Col 9 to 12) (Matches Screenshot Box) */}
          <div className="lg:col-span-3 border border-slate-300 rounded p-3 bg-white space-y-1.5 text-xs font-semibold">

            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Discount : Ctrl+D</span>
            </div>

            {/* G. Total */}
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-bold">G. Total :</span>
              <span className="font-mono font-bold text-slate-900">{grossTotal}</span>
            </div>

            {/* Discount Option with % or Flat Radio */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-rose-600 font-bold">Discount :</span>
                <label className="text-[10px] flex items-center space-x-0.5">
                  <input
                    type="radio"
                    name="disc_type"
                    checked={discountType === 'percent'}
                    onChange={() => setDiscountType('percent')}
                  />
                  <span>%</span>
                </label>
                <label className="text-[10px] flex items-center space-x-0.5">
                  <input
                    type="radio"
                    name="disc_type"
                    checked={discountType === 'flat'}
                    onChange={() => setDiscountType('flat')}
                  />
                  <span>Flat</span>
                </label>
              </div>

              <input
                type="number"
                min="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-right font-mono text-slate-900 font-bold"
              />
            </div>

            {/* Tax */}
            {/* <div className="flex justify-between items-center">
              <span className="text-slate-600">Tax :</span>
              <span className="font-mono font-bold text-slate-900">0</span>
            </div> */}

            {/* Total */}
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-slate-800 font-extrabold">Total :</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                Rs. {netTotal}
              </span>
            </div>

            {/* Advance with Payment Mode Select */}
            <div className="flex items-center justify-between">
              <span className="text-emerald-700 font-bold">Advance :</span>
              <div className="flex items-center space-x-1">
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="px-1 py-0.5 border border-slate-300 rounded text-[11px] bg-white font-medium text-slate-700"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="JazzCash">JazzCash</option>
                </select>

                <input
                  type="number"
                  min="0"
                  max={netTotal}
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  placeholder="0"
                  className="w-16 px-1.5 py-0.5 border border-slate-300 rounded text-right font-mono font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Balance Due */}
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="font-extrabold text-slate-700">Balance :</span>
              <span className={`font-mono font-black text-sm ${balanceDue > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                Rs. {balanceDue}
              </span>
            </div>

          </div>

        </div>

        </div>

      </div>

    </div>
  );
}
