import React from 'react';

export default function TopHeader({
  currentUser,
  onLogout,
  pendingPickups = 0,
  onOpenPendingModal,
  onNavigateHome
}) {
  return (
    <header className="bg-slate-900 text-white flex-shrink-0 z-40 border-b border-slate-800 sticky top-0 h-[58px]">
      {/* Main Bar */}
      <div className="px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Brand & Edition */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNavigateHome}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-lg font-black shadow-md text-white">
            🧺
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-base sm:text-lg tracking-tight text-white leading-none">
                Quick Dry Cleaning Software
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Single-Store Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">
              POS Terminal &amp; Comprehensive Customer Hub
            </p>
          </div>
        </div>

        {/* Right Info: Operator Pill & Logout */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/90 px-3 py-1.5 rounded-full border border-slate-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Operator:</span>
            <span className="font-bold text-white">{currentUser?.name || 'Farhan Ali (Store Manager)'}</span>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors border border-slate-700 flex items-center space-x-1"
          >
            <span>Logout</span>
            <span className="text-xs">↪</span>
          </button>
        </div>

      </div>

    </header>
  );
}
