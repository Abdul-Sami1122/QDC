import React, { useState } from 'react';

export default function LoginModal({
  isOpen = false,
  onClose,
  onLogin
}) {
  const [operatorName, setOperatorName] = useState('Farhan Ali (Store Manager)');
  const [pin, setPin] = useState('1234');
  const [role, setRole] = useState('Admin');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim() !== '1234') {
      alert('Invalid PIN code. Default is 1234');
      return;
    }
    const user = {
      name: operatorName,
      role: role
    };
    localStorage.setItem('qdc_user', JSON.stringify(user));
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 rounded-2xl bg-white text-emerald-600 flex items-center justify-center text-lg font-black shadow-xs">
              🔒
            </span>
            <div>
              <h3 className="font-extrabold text-base text-white">Operator Sign In</h3>
              <p className="text-xs text-emerald-100 font-medium">Quick Dry Cleaning POS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-white/20 text-white flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Operator Profile</label>
            <select
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Farhan Ali (Store Manager)">Farhan Ali (Store Manager)</option>
              <option value="Usman Tariq (Cashier)">Usman Tariq (Cashier)</option>
              <option value="Bilal Ahmed (Workshop Supervisor)">Bilal Ahmed (Workshop Supervisor)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Access Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Counter Staff">Counter Staff (POS Only)</option>
              <option value="Workshop Lead">Workshop Lead</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">PIN / Password</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Default: 1234)"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">Default PIN is 1234</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 transition-all"
            >
              Confirm Operator Login
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
