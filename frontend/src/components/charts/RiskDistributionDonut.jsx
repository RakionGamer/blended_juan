import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function RiskDistributionDonut({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { name: 'Bajo', value: 4, color: '#10B981' },
    { name: 'Medio', value: 2, color: '#F59E0B' },
    { name: 'Alto', value: 2, color: '#EF4444' }
  ];

  const total = chartData.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-base">Distribución por Nivel de Riesgo</h3>
          <p className="text-xs text-slate-500">Población total analizada en modalidad Blended</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
          {total} evaluados
        </span>
      </div>

      <div className="flex-1 min-h-[260px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#6366F1'} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg">
                      <p className="font-bold">Riesgo {item.name}</p>
                      <p className="text-slate-300">{item.value} estudiantes ({percentage}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span className="text-xs font-medium text-slate-600">
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
