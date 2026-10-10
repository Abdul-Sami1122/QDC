import React from 'react';

export default function DailyDashboardModal({
  isOpen = false,
  onClose,
  metrics,
  orders = [],
  onSelectOrder
}) {
  if (!isOpen) return null;

  const inWashOrders = orders.filter((o) => o.status === 'process');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header: Bright Vibrant Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 rounded-2xl bg-white text-emerald-600 flex items-center justify-center text-lg font-black shadow-xs">
              📊
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-white">Store Daily Dashboard &amp; Workshop Pulse</h3>
              <p className="text-xs text-emerald-100 font-medium">Real-time store performance and processing pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-white">
          
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider block">Today Bookings</span>
              <span className="text-2xl font-black text-emerald-950 mt-1 block">Rs. {metrics?.todayBookedAmount || 14200}</span>
              <span className="text-xs text-emerald-700 font-semibold">{metrics?.todayPieces || 42} garments</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase text-amber-700 tracking-wider block">In Wash / Press</span>
              <span className="text-2xl font-black text-amber-950 mt-1 block">{inWashOrders.length} Orders</span>
              <span className="text-xs text-amber-700 font-medium">Under active processing</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase text-emerald-800 tracking-wider block">Ready for Pickup</span>
              <span className="text-2xl font-black text-emerald-950 mt-1 block">{readyOrders.length} Orders</span>
              <span className="text-xs text-emerald-700 font-semibold">{metrics?.readyForPickupPcs || 38} pcs ready</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl">
              <span className="text-[11px] font-bold uppercase text-rose-700 tracking-wider block">Pending Collections</span>
              <span className="text-2xl font-black text-rose-950 mt-1 block">{metrics?.pendingDeliveries || 94}</span>
              <span className="text-xs text-rose-700 font-medium">Customer pickups pending</span>
            </div>
          </div>

          {/* Ready for Pickup Queue */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-800">
                Ready for Pickup Orders Queue ({readyOrders.length})
              </h4>
            </div>

            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              {readyOrders.map((ro) => (
                <div
                  key={ro.orderNo}
                  className="p-3 bg-white hover:bg-emerald-50/70 flex items-center justify-between text-xs cursor-pointer transition-colors"
                  onClick={() => {
                    onClose();
                    onSelectOrder(ro);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-emerald-700">#{ro.orderNo}</span>
                    <span className="font-bold text-slate-800">{ro.customerName}</span>
                    <span className="text-slate-500 font-mono">({ro.phone})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {ro.ready || ro.totalPcs} pcs Ready
                    </span>
                    <span className="font-bold text-slate-700">
                      {ro.balanceAmount > 0 ? `Bal: Rs. ${ro.balanceAmount}` : 'Paid'}
                    </span>
                    <span className="text-emerald-700 font-bold hover:underline">View ➔</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
