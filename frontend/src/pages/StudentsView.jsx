import React from 'react';
import StudentFilters from '../components/students/StudentFilters.jsx';
import StudentTable from '../components/students/StudentTable.jsx';
import { Badge } from '../components/ui/badge.jsx';

export default function StudentsView({
  students,
  search,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
  facultyFilter,
  onFacultyFilterChange,
  onResetFilters,
  onSelectStudent
}) {
  return (
    <div className="space-y-6">
      {/* Encabezado del Directorio */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Directorio Estudiantil</h1>
          <p className="text-sm text-zinc-500">
            Monitoreo granular con métricas de presencialidad, plataforma LMS y scoring de deserción
          </p>
        </div>
        <div>
          <Badge variant="secondary" className="font-mono text-xs">
            {students.length} estudiantes listados
          </Badge>
        </div>
      </div>

      {/* Barra de Filtros */}
      <StudentFilters
        search={search}
        onSearchChange={onSearchChange}
        riskFilter={riskFilter}
        onRiskFilterChange={onRiskFilterChange}
        facultyFilter={facultyFilter}
        onFacultyFilterChange={onFacultyFilterChange}
        onReset={onResetFilters}
      />

      {/* Tabla de Estudiantes */}
      <StudentTable
        students={students}
        onSelectStudent={onSelectStudent}
      />
    </div>
  );
}
