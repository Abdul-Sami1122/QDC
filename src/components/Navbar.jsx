import React from 'react';

export default function Navbar({ activeTab, setActiveTab, ordersCount = 0 }) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <span className="text-xl">🧺</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
                  QDC <span className="text-emerald-500 font-black">Dry Cleaners</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Store #01 POS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Professional Care &amp; Laundry Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
            <button
              id="tab-pos"
              type="button"
              onClick={() => setActiveTab('pos')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === 'pos'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Booking (POS)</span>
            </button>

            <button
              id="tab-orders"
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-200 relative ${
                activeTab === 'orders'
                  ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Orders Tracking</span>
              {ordersCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-emerald-600 rounded-full shadow-sm">
                  {ordersCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
