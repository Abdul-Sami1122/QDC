import React, { useState } from 'react';

export default function NewCustomerModal({
  isOpen = false,
  onClose,
  onSaveCustomer,
  initialQuery = ''
}) {
  const [name, setName] = useState(initialQuery || '');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState(['Medium Starch']);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const prefOptions = [
    'No Starch',
    'Light Starch',
    'Medium Starch',
    'Hard Starch',
    'Flat Pressing',
    'Hanger Pack',
    'Fold Silk Items',
    'Collar Stiffener'
  ];

  const togglePreference = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !mobile.trim()) {
      alert('Please provide at least Customer Name and Mobile Number.');
      return;
    }

    const newCust = {
      id: `CUST-${Math.floor(100 + Math.random() * 900)}`,
      membershipId: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      address: address.trim() || 'Walk-in Address',
      preferences: selectedPreferences,
      rating: 5,
      creditRating: 'A',
      lastVisit: 'Today (New)',
      customerSince: new Date().toISOString().split('T')[0],
      notes: notes.trim() || 'New registered client',
      amountDue: 0,
      totalSpent: 0
    };

    onSaveCustomer(newCust);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header: Bright Vibrant Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <span className="w-10 h-10 rounded-2xl bg-white text-emerald-600 flex items-center justify-center text-lg font-black shadow-xs">
              👤
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-white">Add New Customer</h3>
              <p className="text-xs text-emerald-100 font-medium">Quick enrollment into QDC Single-Store Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm bg-white">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tariq Mehmood"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="0300-1234567"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@domain.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Address / Flat / Sector
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. House #14, Sector F-8"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Preferences Pills */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Customer Default Preferences (Starch &amp; Packing)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {prefOptions.map((pref) => {
                const isSelected = selectedPreferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? `✓ ${pref}` : pref}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Garment Handling Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Always double check stains on silk kurtas..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-600 font-medium text-slate-900"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.99]"
            >
              Save Customer &amp; Open Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
