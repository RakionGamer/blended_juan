import React from 'react';
import { 
  HeartHandshake, ShieldAlert, ArrowRight, CheckCircle2, 
  MessageCircle, Clock, BookOpen, AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table.jsx';
import { toast } from 'sonner';

export default function InterventionsView({ students = [], onSelectStudent }) {
  // Filtrar estudiantes reales que requieren intervención (Riesgo Alto o estado En_Riesgo)
  const interventionStudents = students.filter(
    s => s.prediccion?.nivel_riesgo === 'Alto' || s.estado_matricula === 'En_Riesgo' || (s.academica?.promedio_acumulado < 3.0)
  );

  const handleNotify = (student) => {
    toast.success('Notificación enviada', {
      description: `Se envió una alerta de acompañamiento al correo institucional de ${student.nombre_completo}.`
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Gestión de Intervenciones y Acompañamiento
            </h1>
            <Badge variant="destructive" className="text-xs font-semibold">
              {interventionStudents.length} Casos Prioritarios
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Seguimiento de estudiantes en riesgo de deserción detectados por el motor predictivo de Blended Learning.
          </p>
        </div>
      </div>

      {/* Lista de Estudiantes Reales en Intervención */}
      <Card className="shadow-2xs border-zinc-200 bg-white">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <CardTitle className="text-base font-semibold text-zinc-950">
            Expedientes con Alerta Temprana en MySQL
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Estudiantes con promedios por debajo del umbral, ausentismo presencial o inactividad prolongada en Moodle.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {interventionStudents.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs">
              No hay estudiantes con alerta crítica en este momento.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 border-b border-zinc-200">
                    <TableHead className="text-xs font-semibold text-zinc-900">Estudiante</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-900">Programa</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-900 text-center">Promedio</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-900 text-center">Asistencia</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-900 text-center">Nivel de Riesgo</TableHead>
                    <TableHead className="text-xs font-semibold text-zinc-900 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {interventionStudents.map((s) => {
                    const acad = s.academica || {};
                    const pred = s.prediccion || {};
                    const isHigh = pred.nivel_riesgo === 'Alto';

                    return (
                      <TableRow key={s.id} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                        <TableCell>
                          <p className="font-semibold text-zinc-950 text-xs">{s.nombre_completo}</p>
                          <p className="text-[11px] font-mono text-zinc-500">{s.codigo_estudiantil} • {s.email}</p>
                        </TableCell>
                        <TableCell className="text-xs text-zinc-700 font-medium">
                          {s.carrera}
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs">
                          <Badge variant={acad.promedio_acumulado < 3.0 ? 'destructive' : 'warning'}>
                            {Number(acad.promedio_acumulado || 0).toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-mono text-xs font-semibold text-zinc-900">
                          {Number(acad.porcentaje_asistencia_presencial || 0).toFixed(0)}%
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={isHigh ? 'destructive' : 'warning'} className="text-[10px] uppercase font-bold">
                            {pred.nivel_riesgo || 'Alto'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleNotify(s)}
                              className="text-xs text-zinc-700 hover:text-zinc-950 cursor-pointer h-7 px-2"
                            >
                              <MessageCircle className="w-3.5 h-3.5 mr-1" />
                              Notificar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onSelectStudent(s)}
                              className="text-xs font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 cursor-pointer h-7 px-2.5"
                            >
                              Ver Expediente
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
