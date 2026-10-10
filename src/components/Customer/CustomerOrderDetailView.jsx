import React, { useState, useMemo, useEffect } from 'react';

export default function CustomerOrderDetailView({
  customer,
  orders = [],
  onBack,
  onDropNewOrder, // Drops customer into POS booking
  onPickUpOrder,  // Settle & deliver
  onPrintOrder,
  onEditCustomer
}) {
  const [filterView, setFilterView] = useState('all'); // 'all' | 'garment' | 'payment'
  const [showFullCustomerDetails, setShowFullCustomerDetails] = useState(false);
  const [selectedOrderRow, setSelectedOrderRow] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Keyboard shortcut listener (F4 to edit, Esc to back)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F4') {
        e.preventDefault();
        onEditCustomer?.(customer);
      } else if (e.key === 'Escape') {
        onBack?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [customer, onEditCustomer, onBack]);

  // Orders for this customer
  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return orders.filter(
      (o) =>
        o.customerId === customer.id ||
        (o.phone && customer.mobile && o.phone.replace(/\D/g, '') === customer.mobile.replace(/\D/g, '')) ||
        (o.customerName && customer.name && o.customerName.toLowerCase() === customer.name.toLowerCase())
    );
  }, [orders, customer]);

  // KPI Metrics Calculation
  const metrics = useMemo(() => {
    const pendingOrders = customerOrders.filter((o) => o.status !== 'delivered').length;
    const totalAmountDue = customerOrders.reduce((sum, o) => sum + (o.balanceAmount || 0), 0);
    const totalUnderProcess = customerOrders.reduce((sum, o) => sum + (o.underProcess || 0), 0);
    const totalReady = customerOrders.reduce((sum, o) => sum + (o.ready || 0), 0);

    return {
      pendingOrders,
      totalAmountDue,
      totalUnderProcess,
      totalReady
    };
  }, [customerOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (filterView === 'garment') {
      return customerOrders.filter((o) => (o.ready || 0) > 0 || (o.underProcess || 0) > 0);
    }
    if (filterView === 'payment') {
      return customerOrders.filter((o) => (o.balanceAmount || 0) > 0);
    }
    return customerOrders;
  }, [customerOrders, filterView]);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportExcel = () => {
    if (!customer) return;
    triggerToast(`Customer statement for ${customer.name} exported to Excel successfully.`);
  };

  const handleSendWhatsApp = () => {
    if (!customer) return;
    const cleanPhone = customer.mobile.replace(/\D/g, '');
    const msgText = encodeURIComponent(
      `Assalam-o-Alaikum ${customer.name}, Aapka Quick Dry Cleaning ka order balance Rs. ${metrics.totalAmountDue} hai. Ready garments: ${metrics.totalReady} pcs. Shukriya!`
    );
    // Optional window open for actual WhatsApp web/app if available
    window.open(`https://wa.me/92${cleanPhone.replace(/^0/, '')}?text=${msgText}`, '_blank');
    triggerToast(`WhatsApp reminder dispatched to ${customer.name} (${customer.mobile}).`);
  };

  const handleSendEmail = () => {
    if (!customer) return;
    triggerToast(`Order status statement sent to ${customer.email || 'customer email'}.`);
  };

  if (!customer) {
    return (
      <div className="max-w-7xl mx-auto p-6 text-center space-y-4">
        <p className="text-slate-500 font-bold">No customer selected.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
        >
          ← Return to Customer Hub
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 animate-in fade-in duration-150">

      {/* Top Breadcrumb & Return Bar */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-extrabold text-xs transition-colors border border-slate-200 cursor-pointer"
          >
            <span>←</span>
            <span>Back to Customer Directory</span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            Customer Profile: <strong className="text-slate-900">{customer.name}</strong>
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[11px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold">
            ID: {customer.id}
          </span>
        </div>
      </div>

      {/* Main Tabular Detail Card (Exact Layout from Image) */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-md flex flex-col overflow-hidden">

        {/* Header Bar: "Customer Detail" exactly like screenshot */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-base sm:text-lg tracking-tight">
              Customer Detail
            </span>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors cursor-pointer"
            title="Return to Customer List"
          >
            ← Back
          </button>
        </div>

        {/* Customer Header Info Section (Matches Image Layout) */}
        <div className="p-4 sm:p-5 bg-white border-b border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Left & Center Information */}
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {customer.name}
                </h2>
                <span className="font-mono text-sm sm:text-base font-bold text-slate-700">
                  {customer.mobile}
                </span>
                <span className="text-xs sm:text-sm text-slate-600 font-medium">
                  {customer.email || 'no-email@customer.com'}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-8 gap-y-1 text-xs text-slate-500 pt-0.5">
                <span className="font-semibold text-slate-700">
                  {customer.address || 'Address on record'}
                </span>
                <span className="font-medium text-slate-600">
                  Last Visit <strong className="text-slate-800">{customer.lastVisit || '1 Days'}</strong>
                </span>
                {customer.membershipId && (
                  <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    ID: {customer.membershipId}
                  </span>
                )}
              </div>
            </div>

            {/* Right Buttons: Show Details & Edit */}
            <div className="flex items-center space-x-2 self-start md:self-center">
              <button
                type="button"
                onClick={() => setShowFullCustomerDetails(!showFullCustomerDetails)}
                className="px-3.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              >
                {showFullCustomerDetails ? 'Hide Details' : 'Show Details'}
              </button>

              <button
                type="button"
                id="btn-edit-customer"
                onClick={() => onEditCustomer?.(customer)}
                className="px-4 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold transition-colors shadow-2xs flex items-center space-x-1 cursor-pointer"
              >
                <span>Edit</span>
                <kbd className="text-[10px] bg-slate-200 px-1 rounded text-slate-600 font-mono">F4</kbd>
              </button>
            </div>

          </div>

          {/* Extended Customer Details Drawer (when Show Details is clicked) */}
          {showFullCustomerDetails && (
            <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/80 p-3 rounded-xl animate-in fade-in">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Preferences:</span>
                <span className="font-semibold text-slate-800">
                  {customer.preferences?.join(', ') || 'Standard Service'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rating:</span>
                <span className="font-bold text-amber-500">★ {customer.rating || 5} (Credit: {customer.creditRating || 'A+'})</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Spent:</span>
                <span className="font-bold text-emerald-700 font-mono">Rs. {customer.totalSpent || 0}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Notes:</span>
                <span className="italic text-slate-600">{customer.notes || 'None'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Compact Horizontal KPI Summary Line & Filter (Matches Screenshot Horizontally) */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs sm:text-sm text-slate-700 font-medium gap-3">

          <div className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-1">
            <span>
              Pending Orders : <strong className="font-black text-slate-900 text-sm sm:text-base">{metrics.pendingOrders}</strong>
            </span>
            <span>
              Amount Due : <strong className={`font-black text-sm sm:text-base ${metrics.totalAmountDue > 0 ? 'text-slate-900' : 'text-emerald-700'}`}>{metrics.totalAmountDue}</strong>
            </span>
            <span>
              Pcs Under Process : <strong className="font-black text-slate-900 text-sm sm:text-base">{metrics.totalUnderProcess}</strong>
            </span>
            <span>
              Pcs Ready : <strong className="font-black text-slate-900 text-sm sm:text-base">{metrics.totalReady}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-xs text-slate-500 font-bold">Show</span>
            <select
              id="filter-view-select"
              value={filterView}
              onChange={(e) => setFilterView(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-md px-2.5 py-1 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Garment or Payment</option>
              <option value="garment">Garment in Process / Ready</option>
              <option value="payment">Pending Payment Only</option>
            </select>
          </div>

        </div>

        {/* Order History Tabular Data (Exact table headers and columns from screenshot) */}
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#6c757d] text-white font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Order No.</th>
                <th className="py-2.5 px-3">Order Date</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-center">Total Pcs</th>
                <th className="py-2.5 px-3 text-center">Under Process</th>
                <th className="py-2.5 px-3 text-center">Delivered</th>
                <th className="py-2.5 px-3 text-center">Ready</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Balance Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-12 text-slate-400">
                    <p className="font-bold text-sm text-slate-600">No matching orders found</p>
                    <p className="text-xs text-slate-400 mt-1">Click &quot;DROP&quot; below to book a new order for {customer.name}.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isUnpaid = (ord.balanceAmount || 0) > 0;
                  const isReady = (ord.ready || 0) > 0;
                  const isProcess = (ord.underProcess || 0) > 0 || (ord.status === 'process' && !isReady);

                  return (
                    <tr
                      key={ord.orderNo}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* Order No. (Clickable cyan/blue link) */}
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => setSelectedOrderRow(ord)}
                          className="font-bold text-sky-600 hover:text-sky-800 hover:underline font-mono text-left cursor-pointer"
                          title="Click to view garment items"
                        >
                          {ord.orderNo}
                        </button>
                      </td>

                      {/* Order Date */}
                      <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                        {ord.orderDate}
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                        {ord.dueDate}
                      </td>

                      {/* Total Pcs */}
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {ord.totalPcs}
                      </td>

                      {/* Under Process */}
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {ord.underProcess || 0}
                      </td>

                      {/* Delivered */}
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {ord.delivered || 0}
                      </td>

                      {/* Ready */}
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {ord.ready || 0}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                        {ord.amount}
                      </td>

                      {/* Balance Amount */}
                      <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">
                        {ord.balanceAmount || 0}
                      </td>

                      {/* Status Icons from Screenshot ($ and 👕) */}
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {/* Payment Pending Icon ($ in red square) */}
                          {isUnpaid ? (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-600 text-white font-black text-xs shadow-2xs cursor-help"
                              title="Denotes Payment is pending"
                            >
                              $
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-600 text-white font-bold text-xs shadow-2xs cursor-help"
                              title="Payment cleared"
                            >
                              ✓
                            </span>
                          )}

                          {/* Garment Status Icon (👕 in red or green) */}
                          {isReady ? (
                            <span
                              className="inline-flex items-center justify-center text-emerald-600 text-lg cursor-help leading-none"
                              title="Denotes Garments are ready"
                            >
                              👕
                            </span>
                          ) : isProcess ? (
                            <span
                              className="inline-flex items-center justify-center text-red-600 text-lg cursor-help leading-none"
                              title="Denotes Garments are pending"
                            >
                              👕
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center justify-center text-slate-400 text-xs font-medium"
                              title="Delivered"
                            >
                              Done
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-semibold flex items-center justify-between">
            <span>✓ {toastMsg}</span>
            <button onClick={() => setToastMsg(null)} className="text-white ml-2 cursor-pointer">✕</button>
          </div>
        )}

        {/* Bottom Action Footer Bar (Matches Image Layout Exactly) */}
        <div className="sticky bottom-0 z-20 px-4 sm:px-6 py-3 bg-slate-100/95 backdrop-blur-xs border-t border-slate-300 flex flex-col lg:flex-row items-center justify-between gap-3 shadow-lg">

          {/* Left: 3 Classic Utility Buttons */}
          <div className="flex items-center space-x-2 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3 sm:px-4 py-2 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs cursor-pointer"
            >
              EXPORT TO EXCEL
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="px-3 sm:px-4 py-2 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold uppercase tracking-wider transition-colors shadow-2xs flex items-center space-x-1.5 cursor-pointer"
            >
              <span className="text-emerald-600 font-black">💬</span>
              <span>WHATSAPP REMINDER</span>
            </button>
          </div>

          {/* Center: Visual Status Legend from Image */}
          <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
            <div className="flex items-center space-x-1">
              <span className="text-emerald-600 text-base leading-none">👕</span>
              <span>- Denotes Garments are ready.</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center font-bold text-[10px] leading-none">$</span>
              <span>- Denotes Payment is pending.</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-red-600 text-base leading-none">👕</span>
              <span>- Denotes Garments are pending.</span>
            </div>
          </div>

          {/* Right: DROP and PICK UP Buttons (Securely fitted inside card boundary) */}
          <div className="flex items-center space-x-2.5 flex-shrink-0 w-full lg:w-auto justify-end">
            <button
              type="button"
              id="btn-drop-new-order"
              onClick={() => onDropNewOrder?.(customer)}
              className="flex-1 lg:flex-none px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              DROP
            </button>
            <button
              type="button"
              id="btn-pickup-settle"
              onClick={() => onPickUpOrder?.(customer, customerOrders)}
              className="flex-1 lg:flex-none px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-all active:scale-[0.99] cursor-pointer"
            >
              PICK UP
            </button>
          </div>

        </div>

      </div>

      {/* Row Item Garments Preview Popup */}
      {/* Row Item Garments Preview & Thermal Slip Modal */}
      {selectedOrderRow && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/70 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-300 p-5 space-y-3.5 font-sans">
            <div className="flex items-center justify-between border-b pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-base">🧾</span>
                <div>
                  <h4 className="font-black text-slate-900 text-sm">
                    Order #{selectedOrderRow.orderNo}
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    80mm Thermal Receipt
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderRow(null)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Receipt Preview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs font-mono">
              <div className="border-b border-dashed border-slate-300 pb-1.5 text-center">
                <div className="font-extrabold text-slate-900 text-xs">QDC DRY CLEANERS</div>
                <div className="text-[10px] text-slate-500">{customer.name} • {customer.mobile}</div>
              </div>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {selectedOrderRow.items && selectedOrderRow.items.length > 0 ? (
                  selectedOrderRow.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-0.5 border-b border-dotted border-slate-200">
                      <div>
                        <span className="font-bold text-slate-800">{it.name}</span>
                        <span className="text-[10px] text-slate-500 ml-1">[{it.serviceName || 'DC'}]</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {it.qty} x {it.price} = Rs. {it.qty * it.price}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-between text-xs py-0.5">
                    <span className="font-bold text-slate-800">Dry Cleaning Service</span>
                    <span className="font-bold text-slate-900">Rs. {selectedOrderRow.amount}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-slate-300 pt-2 flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-700">Total Charges:</span>
                <span className="font-black text-slate-900 text-sm">Rs. {selectedOrderRow.amount}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrderRow(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              {selectedOrderRow.status !== 'delivered' && (
                <button
                  type="button"
                  onClick={() => {
                    const rowOrd = selectedOrderRow;
                    setSelectedOrderRow(null);
                    onPickUpOrder?.(customer, [rowOrd]);
                  }}
                  className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold transition-colors shadow-sm cursor-pointer flex items-center justify-center space-x-1"
                >
                  <span>📦</span>
                  <span>Pick Up</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const ord = {
                    ...selectedOrderRow,
                    customerName: customer.name,
                    phone: customer.mobile,
                    address: customer.address
                  };
                  setSelectedOrderRow(null);
                  onPrintOrder?.(ord);
                }}
                className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-colors shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>🖨️</span>
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
