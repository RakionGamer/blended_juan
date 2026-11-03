import React from 'react';
import { 
  FileText, Download, BarChart2, TrendingUp, Users, 
  ShieldAlert, CheckCircle2, ArrowRight, Database
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table.jsx';
import { downloadImportTemplate } from '../services/api.js';

export default function ReportsView({ dashboardData, students = [], onNavigateToStudents }) {
  const kpis = dashboardData?.kpis || {
    totalEstudiantes: students.length,
    enRiesgoTotal: students.filter(s => s.prediccion?.nivel_riesgo === 'Alto' || s.prediccion?.nivel_riesgo === 'Medio').length,
    riesgoAlto: students.filter(s => s.prediccion?.nivel_riesgo === 'Alto').length,
    intervencionesActivas: students.filter(s => s.estado_matricula === 'En_Riesgo').length
  };

  const programas = dashboardData?.distribucionPrograma || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Reportes Ejecutivos Institucionales
            </h1>
            <Badge variant="outline" className="bg-zinc-100 text-zinc-900 border-zinc-300 text-xs font-semibold">
              Periodo 2026-1
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Consolidado analítico de rendimiento académico y retención estudiantil en Blended Learning.
          </p>
        </div>

        <Button
          onClick={() => downloadImportTemplate('consolidado', 'xlsx', 'example')}
          className="cursor-pointer font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-xs"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar Consolidado (.xlsx)
        </Button>
      </div>

      {/* Tarjetas Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-2xs border-zinc-200 bg-white">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase">Matrícula Total Evaluada</p>
            <p className="text-2xl font-bold font-mono text-zinc-950 mt-1">{kpis.totalEstudiantes}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Estudiantes en MySQL</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs border-zinc-200 bg-white">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase">Tasa en Riesgo</p>
            <p className="text-2xl font-bold font-mono text-amber-600 mt-1">{kpis.enRiesgoTotal}</p>
            <p className="text-[10px] text-amber-700 font-medium mt-0.5">Riesgo Alto y Medio</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs border-zinc-200 bg-white">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase">Casos Críticos (Alto)</p>
            <p className="text-2xl font-bold font-mono text-red-600 mt-1">{kpis.riesgoAlto}</p>
            <p className="text-[10px] text-red-700 font-medium mt-0.5">Intervención prioritaria</p>
          </CardContent>
        </Card>

        <Card className="shadow-2xs border-zinc-200 bg-white">
          <CardContent className="p-4">
            <p className="text-[11px] font-semibold text-zinc-500 uppercase">Casos en Seguimiento</p>
            <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">{kpis.intervencionesActivas}</p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">Acompañamiento activo</p>
          </CardContent>
        </Card>
      </div>

      {/* Desglose por Programas Académicos */}
      <Card className="shadow-2xs border-zinc-200 bg-white">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <CardTitle className="text-base font-semibold text-zinc-950">
            Distribución por Programa Académico en Blended Learning
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Agrupación consolidada de estudiantes matriculados en la base de datos real.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 border-b border-zinc-200">
                <TableHead className="text-xs font-semibold text-zinc-900">Programa Académico</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-900 text-center">Estudiantes Matriculados</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-900 text-center">% de Participación</TableHead>
                <TableHead className="text-xs font-semibold text-zinc-900 text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programas.map((prog, idx) => (
                <TableRow key={idx} className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <TableCell className="font-semibold text-zinc-900 text-xs">
                    {prog.name}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-zinc-950 text-xs">
                    {prog.count}
                  </TableCell>
                  <TableCell className="text-center text-xs">
                    <Badge variant="secondary" className="font-mono text-xs">
                      {prog.value}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onNavigateToStudents}
                      className="text-xs text-zinc-600 hover:text-zinc-950 cursor-pointer"
                    >
                      Ver Estudiantes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
