import React, { useState, useMemo, useEffect } from 'react';

export default function PickUpSettlementModal({
  customer,
  orders = [],
  isOpen = false,
  onClose,
  onConfirmDelivery,
  onPrintDeliverySlip
}) {
  const [collectionMethod, setCollectionMethod] = useState('Cash');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [amountReceived, setAmountReceived] = useState('');

  // Filter orders strictly for this customer
  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return orders.filter(
      (o) =>
        o.customerId === customer.id ||
        (o.phone && customer.mobile && o.phone.replace(/\D/g, '') === customer.mobile.replace(/\D/g, '')) ||
        (o.customerName && customer.name && o.customerName.toLowerCase() === customer.name.toLowerCase())
    );
  }, [orders, customer]);

  const pendingOrders = useMemo(() => {
    return customerOrders.filter((o) => o.status !== 'delivered');
  }, [customerOrders]);

  // Pre-select all pending orders when modal opens
  useEffect(() => {
    if (isOpen && pendingOrders.length > 0) {
      const allIds = pendingOrders.map((o) => o.orderNo || o.id);
      setSelectedOrderIds(allIds);
      const totalDue = pendingOrders.reduce((sum, o) => sum + (o.balanceAmount || 0), 0);
      setAmountReceived(totalDue);
    } else {
      setSelectedOrderIds([]);
      setAmountReceived(0);
    }
  }, [isOpen, pendingOrders]);

  if (!isOpen || !customer) return null;

  // Selected orders subset
  const selectedOrders = pendingOrders.filter((o) =>
    selectedOrderIds.includes(o.orderNo || o.id)
  );

  const totalSelectedBalance = selectedOrders.reduce(
    (acc, o) => acc + (o.balanceAmount !== undefined ? o.balanceAmount : (o.amount || 0)),
    0
  );

  const totalSelectedPieces = selectedOrders.reduce(
    (acc, o) => acc + (o.totalPcs || o.totalPieces || (o.items?.reduce((s, it) => s + (it.qty || 1), 0)) || 1),
    0
  );

  const handleToggleOrder = (orderId) => {
    setSelectedOrderIds((prev) => {
      const isSelected = prev.includes(orderId);
      const updated = isSelected ? prev.filter((id) => id !== orderId) : [...prev, orderId];
      const newSelectedOrders = pendingOrders.filter((o) => updated.includes(o.orderNo || o.id));
      const newTotal = newSelectedOrders.reduce((acc, o) => acc + (o.balanceAmount || 0), 0);
      setAmountReceived(newTotal);
      return updated;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === pendingOrders.length) {
      setSelectedOrderIds([]);
      setAmountReceived(0);
    } else {
      const allIds = pendingOrders.map((o) => o.orderNo || o.id);
      setSelectedOrderIds(allIds);
      const totalDue = pendingOrders.reduce((sum, o) => sum + (o.balanceAmount || 0), 0);
      setAmountReceived(totalDue);
    }
  };

  const handleSettle = (shouldPrint = false) => {
    if (selectedOrderIds.length === 0) return;
    const collected = Number(amountReceived) || totalSelectedBalance;
    onConfirmDelivery(customer, selectedOrders, collected, selectedOrderIds);
    if (shouldPrint && onPrintDeliverySlip) {
      onPrintDeliverySlip({
        customer,
        orders: selectedOrders,
        totalBalance: collected,
        collectionMethod
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[85vh] my-auto">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-500 text-white px-5 py-3.5 flex items-center justify-between shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center text-lg font-black shadow-xs">
              📦
            </span>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                Garment Pickup &amp; Settlement
              </h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                {customer.name} • {customer.mobile}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-5 space-y-3.5 text-xs bg-white overflow-y-auto flex-1">
          
          {/* Header Title for Order Selection */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Orders to Deliver ({selectedOrderIds.length} of {pendingOrders.length})
            </span>
            {pendingOrders.length > 0 && (
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                {selectedOrderIds.length === pendingOrders.length ? 'Deselect All' : 'Select All'}
              </button>
            )}
          </div>

          {pendingOrders.length === 0 ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <span className="text-2xl block">🎉</span>
              <p className="font-bold text-emerald-900 text-sm">All Garments Delivered!</p>
              <p className="text-xs text-emerald-700">No pending orders or outstanding balance for this client.</p>
            </div>
          ) : (
            /* Compact Orders Table/List */
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {pendingOrders.map((ord) => {
                const id = ord.orderNo || ord.id;
                const isChecked = selectedOrderIds.includes(id);
                const pcs = ord.totalPcs || ord.totalPieces || (ord.items?.reduce((s, it) => s + (it.qty || 1), 0)) || 1;
                const bal = ord.balanceAmount !== undefined ? ord.balanceAmount : (ord.amount || 0);

                return (
                  <div
                    key={id}
                    onClick={() => handleToggleOrder(id)}
                    className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                      isChecked
                        ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 pointer-events-none"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-black text-slate-900 font-mono text-xs">#{id}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {pcs} Pcs
                          </span>
                          {ord.ready > 0 ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                              Ready: {ord.ready}
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              In Wash
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Due: {ord.dueDate || 'Target'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block leading-none">Balance</span>
                      <span className="font-black font-mono text-slate-900 text-xs">
                        Rs. {bal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Settlement Breakdown Card */}
          {pendingOrders.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
              <div className="flex justify-between items-center text-slate-600 text-[11px]">
                <span>Selected to Deliver:</span>
                <span className="font-bold text-slate-800">
                  {selectedOrders.length} Orders • {totalSelectedPieces} Pieces
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Total Balance Due:</span>
                <span className="font-black font-mono text-rose-600 text-sm">
                  Rs. {totalSelectedBalance}
                </span>
              </div>

              {/* Amount Collecting Row */}
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <label htmlFor="pickup-amount-received" className="font-bold text-slate-700 text-xs whitespace-nowrap">
                  Amount Collecting:
                </label>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-slate-500 text-xs">Rs.</span>
                  <input
                    id="pickup-amount-received"
                    type="number"
                    min="0"
                    max={totalSelectedBalance}
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-24 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white text-slate-900 text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setAmountReceived(totalSelectedBalance)}
                    className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Full Paid
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Mode Pills */}
          {pendingOrders.length > 0 && (
            <div className="space-y-1">
              <label className="block font-bold text-slate-700 text-[11px]">
                Payment Collection Mode:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Card / POS', 'Online UPI'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCollectionMethod(m)}
                    className={`py-1.5 px-2 rounded-lg font-bold text-xs border transition-all cursor-pointer text-center ${
                      collectionMethod === m
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-300'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-emerald-900 text-[10.5px] leading-tight">
            ✓ Marks selected orders as <strong>Delivered</strong> and settles the customer's balance.
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={selectedOrderIds.length === 0}
            onClick={() => handleSettle(false)}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer ${
              selectedOrderIds.length > 0
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/25 active:scale-[0.99]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>✓</span>
            <span>Confirm Delivery &amp; Settle</span>
          </button>
        </div>

      </div>
    </div>
  );
}
