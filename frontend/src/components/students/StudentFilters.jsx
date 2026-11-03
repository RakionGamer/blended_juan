import React from 'react';
import { Search, RefreshCw, X } from 'lucide-react';
import { Input } from '../ui/input.jsx';
import { Button } from '../ui/button.jsx';
import { Card } from '../ui/card.jsx';

export default function StudentFilters({
  search,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  facultyFilter,
  onFacultyFilterChange,
  onReset
}) {
  const faculties = [
    'Todas las facultades',
    'Ingeniería',
    'Ciencias Económicas',
    'Ciencias de la Salud',
    'Ciencias Humanas'
  ];

  const riskOptions = [
    { label: 'Todos', value: '' },
    { label: 'Alto', value: 'Alto' },
    { label: 'Medio', value: 'Medio' },
    { label: 'Bajo', value: 'Bajo' }
  ];

  return (
    <Card className="p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
      {/* Input de Búsqueda shadcn */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <Input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar estudiante o código ID..."
          className="pl-9 pr-8 h-9 text-xs"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filtros de Riesgo y Facultad */}
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between sm:justify-start">
        {/* Toggle Buttons estilo shadcn Tabs / Segmented Controls */}
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500 overflow-x-auto max-w-full">
          {riskOptions.map((opt) => {
            const isSelected = (!riskFilter && opt.value === '') || riskFilter === opt.value;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => onRiskFilterChange(opt.value)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Filtro por Facultad */}
        <select
          value={facultyFilter}
          onChange={(e) => onFacultyFilterChange(e.target.value)}
          className="h-9 px-3 w-full sm:w-auto bg-white border border-zinc-200 rounded-md text-xs font-medium text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-950 cursor-pointer shadow-2xs"
        >
          {faculties.map((f) => (
            <option key={f} value={f === 'Todas las facultades' ? '' : f}>
              {f}
            </option>
          ))}
        </select>

        {/* Botón Reset */}
        {(search || riskFilter || facultyFilter) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            title="Restablecer filtros"
            className="h-9 w-9 text-zinc-500 hover:text-zinc-900 group cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
          </Button>
        )}
      </div>
    </Card>
  );
}
