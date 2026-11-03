import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function CriticalFactorsBar({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { factor: 'Desconexión LMS > 14 días', cantidad: 3 },
    { factor: 'Inasistencia presencial < 75%', cantidad: 3 },
    { factor: 'Promedio acumulado deficiente', cantidad: 2 },
    { factor: 'Entregas tardías (< 70%)', cantidad: 2 },
    { factor: 'Cero interacción en foros', cantidad: 1 }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Factores Críticos Detonantes</h3>
          <p className="text-xs text-slate-500">Variables con mayor impacto negativo en la permanencia</p>
        </div>
      </div>

      <div className="flex-1 min-h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis type="number" allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} />
            <YAxis
              dataKey="factor"
              type="category"
              width={160}
              tick={{ fill: '#334155', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg max-w-xs">
                      <p className="font-semibold">{item.factor}</p>
                      <p className="text-indigo-300 mt-0.5">{item.cantidad} estudiantes afectados</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="cantidad" radius={[0, 6, 6, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`bar-${index}`}
                  fill={index === 0 ? '#EF4444' : index === 1 ? '#F97316' : '#6366F1'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
