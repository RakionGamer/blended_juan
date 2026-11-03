import React from 'react';
import RiskBadge from '../common/RiskBadge.jsx';
import { Clock, ArrowUpRight } from 'lucide-react';
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from '../ui/table.jsx';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Card } from '../ui/card.jsx';

export default function StudentTable({ students = [], onSelectStudent }) {
  if (students.length === 0) {
    return (
      <Card className="p-12 text-center shadow-2xs">
        <p className="text-zinc-500 text-sm">
          No se encontraron estudiantes con los criterios aplicados.
        </p>
      </Card>
    );
  }

  return (
    <Card className="shadow-2xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-50/75 hover:bg-zinc-50/75">
            <TableHead className="font-semibold text-zinc-900">Estudiante</TableHead>
            <TableHead className="font-semibold text-zinc-900">Programa & Semestre</TableHead>
            <TableHead className="font-semibold text-zinc-900 text-center">Promedio</TableHead>
            <TableHead className="font-semibold text-zinc-900 text-center">Asistencia Pres.</TableHead>
            <TableHead className="font-semibold text-zinc-900">Interacción LMS</TableHead>
            <TableHead className="font-semibold text-zinc-900 text-center">Nivel de Riesgo</TableHead>
            <TableHead className="font-semibold text-zinc-900 text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const acad = student.academica || {};
            const lms = student.lms || {};
            const pred = student.prediccion || { nivel_riesgo: student.nivel_riesgo, score_probabilidad: student.score_probabilidad };

            return (
              <TableRow key={student.id} className="transition-colors">
                {/* Estudiante */}
                <TableCell>
                  <div className="font-semibold text-zinc-950">{student.nombre_completo}</div>
                  <div className="text-xs text-zinc-500 font-mono">{student.codigo_estudiantil}</div>
                </TableCell>

                {/* Programa */}
                <TableCell>
                  <div className="font-medium text-zinc-800">{student.carrera}</div>
                  <div className="text-xs text-zinc-500">
                    {student.facultad} • Semestre {student.semestre_actual}
                  </div>
                </TableCell>

                {/* Promedio */}
                <TableCell className="text-center">
                  <Badge
                    variant={
                      (acad.promedio_acumulado ?? 0) < 3.0
                        ? 'destructive'
                        : (acad.promedio_acumulado ?? 0) < 3.5
                        ? 'warning'
                        : 'secondary'
                    }
                    className="font-mono text-xs font-semibold"
                  >
                    {acad.promedio_acumulado !== undefined ? Number(acad.promedio_acumulado).toFixed(2) : '-'}
                  </Badge>
                  {acad.materias_reprobadas > 0 && (
                    <div className="text-[11px] text-red-600 font-medium mt-1">
                      {acad.materias_reprobadas} reprobadas
                    </div>
                  )}
                </TableCell>

                {/* Asistencia Presencial */}
                <TableCell className="text-center">
                  <div className="font-medium text-zinc-900 font-mono text-xs">
                    {acad.porcentaje_asistencia_presencial !== undefined
                      ? `${Number(acad.porcentaje_asistencia_presencial).toFixed(0)}%`
                      : '-'}
                  </div>
                  <div className="w-16 bg-zinc-100 h-1.5 rounded-full mx-auto mt-1.5 overflow-hidden">
                    <div
                      className={`h-full ${
                        (acad.porcentaje_asistencia_presencial ?? 0) < 75 ? 'bg-red-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${acad.porcentaje_asistencia_presencial || 0}%` }}
                    />
                  </div>
                </TableCell>

                {/* LMS */}
                <TableCell>
                  <div className="text-xs text-zinc-700 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>
                      Último acceso:{' '}
                      <strong className={(lms.dias_ultimo_acceso ?? 0) > 7 ? 'text-red-600 font-semibold' : 'text-zinc-900'}>
                        hace {lms.dias_ultimo_acceso ?? 0}d
                      </strong>
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    Entregas a tiempo: <strong className="text-zinc-800">{lms.porcentaje_entregas_a_tiempo ?? 0}%</strong>
                  </div>
                </TableCell>

                {/* Nivel de Riesgo */}
                <TableCell className="text-center">
                  <RiskBadge level={pred.nivel_riesgo} score={pred.score_probabilidad} />
                </TableCell>

                {/* Acción */}
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectStudent(student)}
                    className="h-8 gap-1.5 text-xs group cursor-pointer border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    <span>Ver Perfil</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
