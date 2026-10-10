import React, { useState, useMemo } from 'react';
import { CATEGORIES, ITEMS } from '../../data/mockData';

export default function ItemGrid({ selectedService, onAddItem, cart = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Service multiplier
  const multiplier = selectedService?.multiplier || 1.0;

  // Filter items by category and search
  const filteredItems = useMemo(() => {
    return ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Helper to count how many of this item is currently in cart for this service
  const getItemQtyInCart = (itemId) => {
    const cartItem = cart.find(
      (c) => c.itemId === itemId && c.serviceId === selectedService.id
    );
    return cartItem ? cartItem.qty : 0;
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80 flex flex-col h-full">
      
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                id={`cat-${cat.toLowerCase()}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isCatActive
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Item Search */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            id="item-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 bg-slate-50/50 text-slate-800"
          />
          <svg
            className="w-4 h-4 text-emerald-500 absolute left-3 top-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Responsive Grid (4 columns desktop, 2 columns tablet/mobile) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 overflow-y-auto max-h-[calc(100vh-290px)] pr-1">
        {filteredItems.map((item) => {
          const computedPrice = Math.round(item.basePrice * multiplier);
          const currentQty = getItemQtyInCart(item.id);

          return (
            <div
              key={item.id}
              id={`item-card-${item.id}`}
              onClick={() => onAddItem(item, computedPrice)}
              className={`group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none bg-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] ${
                currentQty > 0
                  ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/30'
                  : 'border-slate-200 hover:border-emerald-400'
              }`}
            >
              {/* Card Header (Icon & Category / Qty Badge) */}
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl p-1 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>

                {currentQty > 0 ? (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold bg-emerald-500 text-white rounded-full shadow-2xs">
                    {currentQty} in cart
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Item Title */}
              <div className="mb-3">
                <h3 className="font-bold text-sm sm:text-base text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-0.5">
                  <span>Base: Rs. {item.basePrice}</span>
                  {item.pcsPerUnit > 1 && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                      {item.pcsPerUnit} Pcs
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer: Computed Price & Add Button */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Rate: </span>
                  <span className="text-sm sm:text-base font-extrabold text-emerald-600">
                    Rs. {computedPrice}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Add ${item.name}`}
                  className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center font-bold text-sm transition-colors shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <span className="text-4xl mb-2">🔍</span>
          <p className="font-semibold text-sm text-slate-600">No items found</p>
          <p className="text-xs text-slate-400 mt-1">
            Try a different search term or category filter.
          </p>
        </div>
      )}
    </div>
  );
}
