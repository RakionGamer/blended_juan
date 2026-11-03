import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, colorClass, trendText }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-800 mt-2 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {trendText && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
          <span>{trendText}</span>
        </div>
      )}
    </div>
  );
}
