import React from 'react';

export default function CartDrawer({
  cart = [],
  onUpdateQty,
  onUpdatePcs,
  onRemoveItem,
  onClearCart,
  customerPhone,
  setCustomerPhone,
  customerName,
  setCustomerName,
  deliveryDate,
  setDeliveryDate,
  advancePaid,
  setAdvancePaid,
  onCompleteOrder
}) {
  // Calculations
  const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPieces = cart.reduce((acc, item) => acc + (item.pcs !== undefined ? item.pcs : item.qty), 0);
  const totalBill = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const advanceAmount = Number(advancePaid) || 0;
  const balanceDue = Math.max(0, totalBill - advanceAmount);

  // Quick preset phone helper for fast demoing
  const fillSampleCustomer = () => {
    setCustomerPhone('0300-1234567');
    setCustomerName('Ahmed Raza');
  };

  const handleAdvanceChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setAdvancePaid('');
    } else {
      const num = Math.max(0, Number(val));
      setAdvancePaid(num);
    }
  };

  const setFullAdvance = () => {
    setAdvancePaid(totalBill);
  };

  const setZeroAdvance = () => {
    setAdvancePaid(0);
  };

  const isOrderValid = cart.length > 0 && customerPhone.trim().length > 0;

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/25">
            🛒
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">Booking Cart</h2>
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{totalQty}</span> {totalQty === 1 ? 'Garment' : 'Garments'} • <span className="font-bold text-emerald-700">{totalPieces}</span> {totalPieces === 1 ? 'Piece' : 'Pieces'}
            </p>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-rose-500 hover:text-rose-700 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        
        {/* Customer Information Card */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5"></span>
              Customer Details
            </span>
            <button
              type="button"
              onClick={fillSampleCustomer}
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold underline"
            >
              Fill Sample
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <label htmlFor="customer-phone" className="block text-xs font-medium text-slate-600 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="customer-phone"
                type="tel"
                placeholder="0300-1234567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 font-mono bg-white text-slate-900"
              />
            </div>

            <div>
              <label htmlFor="customer-name" className="block text-xs font-medium text-slate-600 mb-1">
                Customer Name (Optional)
              </label>
              <input
                id="customer-name"
                type="text"
                placeholder="Walk-in Client"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 bg-white text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Delivery Due Date Picker */}
        <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200/70 space-y-1.5">
          <label htmlFor="delivery-date" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
            Delivery Date (Expected)
          </label>
          <input
            id="delivery-date"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium bg-white text-slate-900"
          />
        </div>

        {/* Cart Items List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Garment Items ({cart.length})</span>
            <span>Subtotal</span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-200 text-slate-400">
              <span className="text-3xl block mb-1">🧺</span>
              <p className="text-xs font-medium text-slate-600">Cart is empty</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click any garment from the grid to add</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => {
                const itemCartId = item.cartId || `${item.itemId}_${item.serviceId}`;
                const itemQty = item.qty || 1;
                const itemPcs = item.pcs !== undefined ? item.pcs : itemQty;

                return (
                  <div
                    key={itemCartId}
                    className="p-3 rounded-xl border border-slate-200 bg-white text-xs hover:border-slate-300 transition-colors space-y-2.5 shadow-2xs"
                  >
                    {/* Item Name, Service & Subtotal */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center space-x-1.5">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded">
                            {itemPcs} Pcs
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {item.serviceName} • Rs. {item.price}/garment
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 font-mono text-sm">
                          Rs. {item.price * itemQty}
                        </span>
                        <button
                          type="button"
                          aria-label="Remove item"
                          onClick={() => onRemoveItem(itemCartId)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Dual Stepper: Quantity & Pieces */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 bg-slate-50/70 -mx-3 -mb-3 px-3 py-2 rounded-b-xl">
                      {/* Quantity Stepper */}
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-semibold text-slate-500">Qty:</span>
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-2xs">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => onUpdateQty(itemCartId, -1)}
                            className="w-6 h-6 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs rounded-l-lg transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-slate-800 text-xs">
                            {itemQty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => onUpdateQty(itemCartId, 1)}
                            className="w-6 h-6 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs rounded-r-lg transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Pieces Stepper */}
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-semibold text-emerald-800">Pieces:</span>
                        <div className="flex items-center bg-white border border-emerald-300/80 rounded-lg shadow-2xs">
                          <button
                            type="button"
                            aria-label="Decrease pieces"
                            onClick={() => onUpdatePcs && onUpdatePcs(itemCartId, -1)}
                            className="w-6 h-6 hover:bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs rounded-l-lg transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-7 text-center font-extrabold text-emerald-700 text-xs">
                            {itemPcs}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase pieces"
                            onClick={() => onUpdatePcs && onUpdatePcs(itemCartId, 1)}
                            className="w-6 h-6 hover:bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs rounded-r-lg transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bill Calculations */}
        <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Total Garments (Qty):</span>
            <span className="font-bold text-slate-800">{totalQty} garments</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total Pieces (Pcs):</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-mono">
              {totalPieces} pcs
            </span>
          </div>
          <div className="flex justify-between text-slate-800 text-sm font-bold pt-1 border-t border-slate-100">
            <span>Gross Total Bill:</span>
            <span className="font-mono text-base font-extrabold text-slate-900">
              Rs. {totalBill}
            </span>
          </div>
        </div>

        {/* Advance Payment Input */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="advance-paid" className="text-xs font-bold text-slate-700">
              Advance Paid (Rs.)
            </label>
            <div className="flex space-x-1.5">
              <button
                type="button"
                onClick={setZeroAdvance}
                className="text-[10px] bg-white border border-slate-200 hover:border-slate-300 px-2 py-0.5 rounded text-slate-600 font-semibold"
              >
                Rs. 0
              </button>
              <button
                type="button"
                onClick={setFullAdvance}
                className="text-[10px] bg-white border border-slate-200 hover:border-emerald-400 px-2 py-0.5 rounded text-emerald-700 font-semibold"
              >
                Full Paid
              </button>
            </div>
          </div>
          <input
            id="advance-paid"
            type="number"
            min="0"
            max={totalBill}
            placeholder="0"
            value={advancePaid}
            onChange={handleAdvanceChange}
            className="w-full px-3 py-1.5 text-xs sm:text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-semibold bg-white text-slate-900"
          />
        </div>

        {/* Balance Due Display */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block">
              Balance Due
            </span>
            <span
              className={`text-base font-extrabold ${
                balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              Rs. {balanceDue}
            </span>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              balanceDue === 0 && totalBill > 0
                ? 'bg-emerald-100 text-emerald-800'
                : balanceDue > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {balanceDue === 0 && totalBill > 0 ? 'Fully Paid' : 'Pending'}
          </span>
        </div>

        {/* Submit Action (Bright Gradient Button) */}
        <button
          id="btn-complete-order"
          type="button"
          disabled={!isOrderValid}
          onClick={onCompleteOrder}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all duration-200 ${
            isOrderValid
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25 active:scale-[0.99] cursor-pointer'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Complete &amp; Print Slip</span>
        </button>

        {!isOrderValid && (
          <p className="text-[11px] text-center text-slate-400">
            {cart.length === 0
              ? 'Add at least 1 garment to continue'
              : 'Enter customer phone number to complete'}
          </p>
        )}

      </div>
    </aside>
  );
}
