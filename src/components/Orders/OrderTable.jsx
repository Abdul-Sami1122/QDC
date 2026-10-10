import React, { useState, useMemo } from 'react';

export default function OrderTable({ orders = [], onUpdateStatus, onPrintOrder }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Status Filter Counts
  const counts = useMemo(() => {
    return {
      All: orders.length,
      'In Wash': orders.filter((o) => o.status === 'In Wash').length,
      'Ready for Pickup': orders.filter((o) => o.status === 'Ready for Pickup').length,
      Delivered: orders.filter((o) => o.status === 'Delivered').length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'All' || order.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        order.id.toString().includes(q) ||
        (order.customerName && order.customerName.toLowerCase().includes(q)) ||
        (order.phone && order.phone.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Wash':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
            In Wash
          </span>
        );
      case 'Ready for Pickup':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
            Ready for Pickup
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <svg className="w-3 h-3 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-4 sm:p-6 space-y-5">
      
      {/* Top Controls: Title, Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Orders Tracking &amp; Delivery Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time status updates and order completion workflow
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            id="order-search-input"
            type="text"
            placeholder="Search by Order #, Name, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-slate-50/50 text-slate-800"
          />
          <svg
            className="w-4 h-4 text-emerald-700 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {['All', 'In Wash', 'Ready for Pickup', 'Delivered'].map((tab) => {
          const isActive = statusFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              id={`filter-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {counts[tab] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Order Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px] tracking-wider font-bold">
              <th className="py-3 px-4">Order #</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Garments</th>
              <th className="py-3 px-4">Delivery Date</th>
              <th className="py-3 px-4">Bill &amp; Balance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-slate-400">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">📋</span>
                    <p className="font-semibold text-slate-600 text-sm">No orders found</p>
                    <p className="text-xs text-slate-400">Try adjusting your filter or search query</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const isPaid = order.balance === 0;

                return (
                  <tr
                    key={order.id}
                    className="hover:bg-emerald-50/30 transition-colors"
                  >
                    {/* Order # */}
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">
                      #{order.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {order.customerName || 'Walk-in Customer'}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {order.phone}
                      </div>
                    </td>

                    {/* Garments / Items */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-800">
                          {order.totalPieces || order.items.reduce((s, i) => s + i.qty, 0)} pcs
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrderDetails(order)}
                          className="text-[11px] text-emerald-700 hover:text-emerald-800 underline ml-1 font-bold"
                        >
                          View list
                        </button>
                      </div>
                    </td>

                    {/* Delivery Date */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-medium">
                        {order.deliveryDate}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Booked: {order.bookingDate}
                      </div>
                    </td>

                    {/* Bill & Balance */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        Total: Rs. {order.totalAmount}
                      </div>
                      <div className="text-xs">
                        {isPaid ? (
                          <span className="text-emerald-700 font-bold">Fully Paid</span>
                        ) : (
                          <span className="text-rose-600 font-bold font-mono">
                            Balance: Rs. {order.balance}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Status Transition Buttons */}
                        {order.status === 'In Wash' && (
                          <button
                            type="button"
                            id={`btn-ready-${order.id}`}
                            onClick={() => onUpdateStatus(order.id, 'Ready for Pickup')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-colors"
                          >
                            Mark Ready
                          </button>
                        )}

                        {order.status === 'Ready for Pickup' && (
                          <button
                            type="button"
                            id={`btn-deliver-${order.id}`}
                            onClick={() => onUpdateStatus(order.id, 'Delivered')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-all"
                          >
                            Collect &amp; Deliver
                          </button>
                        )}

                        {order.status === 'Delivered' && (
                          <span className="text-xs text-slate-400 italic pr-1">
                            Completed
                          </span>
                        )}

                        {/* Print Receipt Button */}
                        <button
                          type="button"
                          id={`btn-print-${order.id}`}
                          title="Print 80mm Slip"
                          onClick={() => onPrintOrder(order)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-800 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Items Detail Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900">
                  Order #{selectedOrderDetails.id} Garments List
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedOrderDetails.customerName} ({selectedOrderDetails.phone})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 max-h-72 overflow-y-auto space-y-2">
              {selectedOrderDetails.items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800">{it.name}</span>
                    <span className="text-slate-400 ml-1.5">({it.serviceName})</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-700">
                    {it.qty} x Rs. {it.price} = Rs. {it.qty * it.price}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-500">Total: </span>
                <span className="font-extrabold text-slate-900">
                  Rs. {selectedOrderDetails.totalAmount}
                </span>
              </div>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    const ord = selectedOrderDetails;
                    setSelectedOrderDetails(null);
                    onPrintOrder(ord);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/25 transition-all"
                >
                  Print Slip
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
