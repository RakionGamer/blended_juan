import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function TrendLineChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { periodo: 'Semana 2', bajo: 7, medio: 1, alto: 0 },
    { periodo: 'Semana 4', bajo: 6, medio: 1, alto: 1 },
    { periodo: 'Semana 6', bajo: 5, medio: 2, alto: 1 },
    { periodo: 'Corte Actual', bajo: 4, medio: 2, alto: 2 }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Evolución Temporal del Riesgo</h3>
          <p className="text-xs text-slate-500">Comportamiento longitudinal a lo largo del periodo académico</p>
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAlto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMedio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorBajo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="periodo" tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl">
                      <p className="font-bold mb-1">{label}</p>
                      {payload.map((entry, idx) => (
                        <div key={`tip-${idx}`} className="flex items-center justify-between gap-4 py-0.5">
                          <span style={{ color: entry.color }} className="capitalize font-medium">
                            {entry.name}:
                          </span>
                          <span className="font-mono">{entry.value} estudiantes</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={30} />
            <Area type="monotone" dataKey="alto" name="Riesgo Alto" stroke="#EF4444" fillOpacity={1} fill="url(#colorAlto)" />
            <Area type="monotone" dataKey="medio" name="Riesgo Medio" stroke="#F59E0B" fillOpacity={1} fill="url(#colorMedio)" />
            <Area type="monotone" dataKey="bajo" name="Riesgo Bajo" stroke="#10B981" fillOpacity={1} fill="url(#colorBajo)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
