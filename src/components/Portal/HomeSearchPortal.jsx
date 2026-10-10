import React, { useState, useMemo, useRef, useEffect } from 'react';

export default function HomeSearchPortal({
  customers = [],
  orders = [],
  onSelectCustomer,
  onSelectOrder,
  onAddNewCustomer,
  onOpenDashboard,
  onOpenPOSBooking
}) {
  const [searchMode, setSearchMode] = useState('customer'); // 'customer' | 'invoice'
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef(null);

  // Focus on F2 key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered customer matches
  const customerResults = useMemo(() => {
    if (!searchQuery.trim() || searchMode !== 'customer') return [];
    const q = searchQuery.toLowerCase().trim();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mobile.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
        c.address.toLowerCase().includes(q) ||
        (c.membershipId && c.membershipId.toLowerCase().includes(q)) ||
        c.id.toLowerCase().includes(q)
    );
  }, [customers, searchQuery, searchMode]);

  // Filtered order/invoice matches
  const orderResults = useMemo(() => {
    if (!searchQuery.trim() || searchMode !== 'invoice') return [];
    const q = searchQuery.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.orderNo.toLowerCase().includes(q) ||
        (o.phone && o.phone.replace(/\D/g, '').includes(q.replace(/\D/g, ''))) ||
        (o.customerName && o.customerName.toLowerCase().includes(q))
    );
  }, [orders, searchQuery, searchMode]);

  const handleSelectCustomer = (cust) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    onSelectCustomer(cust);
  };

  const handleSelectInvoice = (ord) => {
    setIsDropdownOpen(false);
    setSearchQuery('');
    onSelectOrder(ord);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 space-y-10">
      
      {/* Central Search Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/90 relative">
        
        {/* Radio Option Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-6 mb-6">
          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="search_type"
              checked={searchMode === 'customer'}
              onChange={() => {
                setSearchMode('customer');
                setSearchQuery('');
              }}
              className="w-4 h-4 text-emerald-500 focus:ring-emerald-400 border-slate-300"
            />
            <span className={`text-xs sm:text-sm font-bold ${searchMode === 'customer' ? 'text-emerald-900 font-black' : 'text-slate-500'}`}>
              Search Customer (Name, Address, Mobile Number, Membership id or customer id)
            </span>
          </label>

          <label className="flex items-center space-x-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="search_type"
              checked={searchMode === 'invoice'}
              onChange={() => {
                setSearchMode('invoice');
                setSearchQuery('');
              }}
              className="w-4 h-4 text-emerald-500 focus:ring-emerald-400 border-slate-300"
            />
            <span className={`text-xs sm:text-sm font-bold ${searchMode === 'invoice' ? 'text-emerald-900 font-black' : 'text-slate-500'}`}>
              Search Invoice
            </span>
          </label>
        </div>

        {/* Big Search Input with Dropdown */}
        <div className="relative">
          <div className="relative flex items-center">
            <input
              ref={searchInputRef}
              id="qdc-main-search-input"
              type="text"
              autoComplete="off"
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder={
                searchMode === 'customer'
                  ? 'Start typing Customer Name, Phone, or Membership ID... (Press F2 to focus)'
                  : 'Enter Order Number (e.g. ORD-9821 or 1001)...'
              }
              className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100 text-sm sm:text-base font-semibold shadow-inner bg-slate-50/60 text-slate-900 placeholder:text-slate-400 transition-colors"
            />
            
            {/* Search Icon */}
            <svg
              className="w-6 h-6 text-emerald-500 absolute left-4 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Clear Button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Instant Dropdown Suggestions */}
          {isDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-emerald-100 z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 animate-in fade-in duration-150">
              
              {/* Customer Mode Suggestions */}
              {searchMode === 'customer' && (
                <>
                  {customerResults.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      <p className="text-sm font-semibold text-slate-700">No customers found matching &quot;{searchQuery}&quot;</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onAddNewCustomer(searchQuery);
                        }}
                        className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 hover:underline font-bold"
                      >
                        + Create &quot;{searchQuery}&quot; as New Customer
                      </button>
                    </div>
                  ) : (
                    customerResults.map((cust) => (
                      <div
                        key={cust.id}
                        onClick={() => handleSelectCustomer(cust)}
                        className="p-3.5 sm:p-4 hover:bg-emerald-50/80 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm shadow-2xs">
                            {cust.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-slate-900 text-sm sm:text-base">
                                {cust.name}
                              </span>
                              {cust.membershipId && (
                                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold border border-emerald-200">
                                  {cust.membershipId}
                                </span>
                              )}
                              <span className="text-amber-500 text-xs font-bold">★ {cust.rating}</span>
                            </div>
                            <p className="text-xs text-slate-500">
                              📞 {cust.mobile} • 📍 {cust.address}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              cust.amountDue > 0
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {cust.amountDue > 0 ? `Due: Rs. ${cust.amountDue}` : 'No Due'}
                          </span>
                          <span className="block text-[11px] text-emerald-600 font-bold mt-1">
                            Click to open profile ➔
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* Invoice Mode Suggestions */}
              {searchMode === 'invoice' && (
                <>
                  {orderResults.length === 0 ? (
                    <div className="p-6 text-center text-slate-500">
                      <p className="text-sm font-semibold text-slate-700">No invoices found matching &quot;{searchQuery}&quot;</p>
                    </div>
                  ) : (
                    orderResults.map((ord) => (
                      <div
                        key={ord.orderNo}
                        onClick={() => handleSelectInvoice(ord)}
                        className="p-3.5 sm:p-4 hover:bg-emerald-50/80 cursor-pointer transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-emerald-600 text-sm sm:text-base">
                              #{ord.orderNo}
                            </span>
                            <span className="font-semibold text-slate-900 text-sm">
                              {ord.customerName}
                            </span>
                            <span className="text-xs text-slate-500">({ord.phone})</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Order Date: {ord.orderDate} • Due Date: {ord.dueDate} • Total Pcs: {ord.totalPcs}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-extrabold text-slate-900 block">
                            Rs. {ord.amount}
                          </span>
                          <span
                            className={`text-[11px] font-bold uppercase ${
                              ord.balanceAmount > 0 ? 'text-rose-600' : 'text-emerald-700'
                            }`}
                          >
                            {ord.balanceAmount > 0 ? `Bal: Rs. ${ord.balanceAmount}` : 'Paid in Full'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}

            </div>
          )}
        </div>

        {/* Primary Action Buttons (Bright Vibrant Emerald Theme) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            id="btn-add-customer-modal"
            onClick={() => onAddNewCustomer('')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            <span className="text-base font-black">+</span>
            <span>Add New Customer</span>
          </button>

          <button
            type="button"
            id="btn-daily-dashboard"
            onClick={onOpenDashboard}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-300 font-extrabold text-sm transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            <span>📊</span>
            <span>Daily Dashboard</span>
          </button>

          <button
            type="button"
            onClick={onOpenPOSBooking}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99] flex items-center justify-center space-x-2"
          >
            <span>🧺</span>
            <span>Fast POS Booking</span>
          </button>
        </div>

      </div>

      {/* "Get Started" Help Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-900">
            Get Started &amp; Support Workflows
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1 */}
          <div
            onClick={() => onAddNewCustomer('')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
              Help me to add a new customer and create a new order
            </h4>
            <p className="text-xs text-slate-500">
              Quick customer onboarding and instant laundry garment booking.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={onOpenDashboard}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              🚚
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
              Help me understand how to deliver garments post processing
            </h4>
            <p className="text-xs text-slate-500">
              Workshop status transition from processing to ready and customer pickup.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => alert('QDC Helpline: 0300-1234567 / support@quickdrycleaning.com')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform">
              💬
            </div>
            <h4 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
              Help me to connect to support team for technical assistance
            </h4>
            <p className="text-xs text-slate-500">
              24/7 dedicated support desk and live remote technical assist.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
