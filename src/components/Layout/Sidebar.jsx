import React from 'react';

export default function Sidebar({
  activeMenu,
  onSelectMenu,
  collapsed = false,
  onToggleCollapse
}) {
  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      shortcut: 'Ctrl+H',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      badge: 'Live',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'customer',
      label: 'Customer Hub',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'pos',
      label: 'Counter POS',
      badge: 'Fast',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      id: 'reports',
      label: 'Reports & Audits',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'setup',
      label: 'Store Set Up',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`bg-white text-slate-700 border-r border-emerald-100 shadow-sm flex flex-col justify-between transition-all duration-200 z-30 select-none sticky top-[58px] h-[calc(100vh-58px)] flex-shrink-0 overflow-y-auto ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Branding & Menu Links */}
      <div className="py-4">
        {/* Brand header in Sidebar */}
        <div className="px-3 mb-4 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/30">
                🧺
              </div>
              <div>
                <span className="text-xs font-black tracking-tight text-slate-900 block leading-tight">
                  QDC DRY CLEAN
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider">
                  Store Terminal
                </span>
              </div>
            </div>
          ) : (
            <div className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🧺
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-500 hover:text-emerald-700 transition-colors ml-auto"
          >
            {collapsed ? '➔' : '◀'}
          </button>
        </div>

        {/* Section divider */}
        <div className="px-3 mb-2">
          {!collapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block px-1">
              Menu Navigation
            </span>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5 px-2">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`sidebar-menu-${item.id}`}
                onClick={() => onSelectMenu(item.id)}
                className={`w-full flex items-center px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                <span
                  className={`${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-emerald-600'
                  } transition-colors`}
                >
                  {item.icon}
                </span>

                {!collapsed && (
                  <span className="ml-3 truncate flex-1 text-left font-bold">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`ml-1.5 px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      isActive
                        ? 'bg-white text-emerald-700'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {!collapsed && item.shortcut && (
                  <span
                    className={`text-[10px] font-mono ${
                      isActive
                        ? 'text-emerald-100'
                        : 'text-slate-400 group-hover:text-emerald-600'
                    }`}
                  >
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info in Bright Theme */}
      <div className="p-3 border-t border-slate-100 text-[11px]">
        {!collapsed ? (
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white border border-emerald-200/80 rounded-2xl p-3 text-emerald-950 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="font-extrabold text-xs text-emerald-900">Store Active</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded-full">
                v4.2
              </span>
            </div>
            <p className="text-[10px] text-emerald-700 font-medium mt-1">
              Single-Store POS Terminal
            </p>
          </div>
        ) : (
          <div className="text-center font-black text-emerald-600 text-xs">QDC</div>
        )}
      </div>
    </aside>
  );
}
