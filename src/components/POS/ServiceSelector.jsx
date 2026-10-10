import React from 'react';
import { SERVICES } from '../../data/mockData';

export default function ServiceSelector({ selectedService, onSelectService }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
            Select Service Type
          </h2>
          <p className="text-xs text-slate-400">
            Current service multiplier applies to all items in grid
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
          Multiplier: {selectedService.multiplier}x
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SERVICES.map((srv) => {
          const isSelected = selectedService.id === srv.id;
          return (
            <button
              key={srv.id}
              type="button"
              id={`service-btn-${srv.id}`}
              onClick={() => onSelectService(srv)}
              className={`relative text-left p-3.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 shadow-sm ring-2 ring-emerald-200'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-800'}`}>
                  {srv.name}
                </span>
                <span
                  className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {srv.code}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={isSelected ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  {srv.description || `${Math.round(srv.multiplier * 100)}% Rate`}
                </span>
                <span className="font-semibold text-slate-600">
                  {srv.multiplier === 1.0 ? '100%' : `${Math.round(srv.multiplier * 100)}%`}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
