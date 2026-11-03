import React, { useState } from 'react';
import { 
  Users, AlertTriangle, ShieldAlert, CheckCircle2, 
  Download, Calendar, Clock, ChevronRight, TrendingUp,
  Activity, ArrowUpRight
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { downloadImportTemplate } from '../services/api.js';

export default function DashboardView({ dashboardData, onNavigateToStudents }) {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-1');

  // Datos reales provenientes de la base de datos MySQL
  const kpis = dashboardData?.kpis || {
    totalEstudiantes: 0,
    enRiesgoTotal: 0,
    porcentajeEnRiesgo: 0,
    riesgoAlto: 0,
    porcentajeRiesgoAlto: 0,
    intervencionesActivas: 0
  };

  const distribucionRiesgo = dashboardData?.distribucionRiesgo || [
    { name: 'Bajo', value: 0, count: 0, color: '#16a34a' },
    { name: 'Medio', value: 0, count: 0, color: '#f59e0b' },
    { name: 'Alto', value: 0, count: 0, color: '#dc2626' }
  ];

  const tendenciaRiesgo = dashboardData?.tendenciaRiesgoMeses || [
    { mes: 'Nov', porcentaje: 0 },
    { mes: 'Dic', porcentaje: 0 },
    { mes: 'Ene', porcentaje: 0 },
    { mes: 'Feb', porcentaje: 0 },
    { mes: 'Mar', porcentaje: 0 },
    { mes: 'Abr', porcentaje: 0 }
  ];

  const factoresImpacto = dashboardData?.factoresMayorImpacto || [
    { factor: 'Bajo rendimiento académico', porcentaje: 35 },
    { factor: 'Baja participación en plataforma', porcentaje: 29 },
    { factor: 'Inasistencias', porcentaje: 20 },
    { factor: 'Actividades en plataforma', porcentaje: 17 }
  ];

  const alertas = (dashboardData?.alertasRecientes || []).map(a => ({
    id: a.id,
    variant: a.tipo === 'critica' ? 'destructive' : a.tipo === 'advertencia' ? 'warning' : 'secondary',
    label: a.tipo === 'critica' ? 'Crítico' : a.tipo === 'advertencia' ? 'Alerta' : 'Informativo',
    titulo: a.titulo,
    tiempo: a.tiempo
  }));

  const distribucionPrograma = dashboardData?.distribucionPrograma && dashboardData.distribucionPrograma.length > 0
    ? dashboardData.distribucionPrograma
    : [
        { name: 'Sin datos registrados', value: 100, color: '#94a3b8' }
      ];

  return (
    <div className="space-y-6">
      {/* Encabezado Principal estilo shadcn */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950">Dashboard</h1>
          <p className="text-sm text-zinc-500">
            Resumen general del estado académico y nivel de riesgo de los estudiantes
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Selector de Periodo */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-zinc-200 text-xs text-zinc-700 shadow-2xs">
            <span className="text-zinc-500 font-medium">Periodo:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent font-semibold text-zinc-900 focus:outline-none cursor-pointer"
            >
              <option value="2026-1">2026-1 (Actual)</option>
              <option value="2025-2">2025-2</option>
              <option value="2025-1">2025-1</option>
            </select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadImportTemplate('consolidado', 'csv')}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <Download className="w-3.5 h-3.5 text-zinc-500 group-hover:translate-y-0.5 group-hover:text-zinc-950 transition-all duration-200" />
            <span>Exportar CSV</span>
          </Button>
        </div>
      </div>

      {/* Grid de 4 KPIs estilo shadcn Card */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Estudiantes Totales */}
        <Card className="shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Estudiantes totales
            </CardTitle>
            <Users className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">
              {kpis.totalEstudiantes.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              100% del universo evaluado
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: En Riesgo */}
        <Card className="shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">
              En riesgo
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">
              {kpis.enRiesgoTotal}
            </div>
            <p className="text-xs text-amber-600 font-medium mt-1">
              {kpis.porcentajeEnRiesgo}% del total activo
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Riesgo Alto */}
        <Card className="shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Riesgo alto
            </CardTitle>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 font-mono tracking-tight">
              {kpis.riesgoAlto}
            </div>
            <p className="text-xs text-red-500 font-medium mt-1">
              {kpis.porcentajeRiesgoAlto}% con intervención requerida
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Intervenciones Activas */}
        <Card className="shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Intervenciones activas
            </CardTitle>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-950 font-mono tracking-tight">
              {kpis.intervencionesActivas}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              En seguimiento por bienestar
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fila 2: Distribución de Riesgo & Tendencia a 6 Meses */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Card: Distribución de Riesgo */}
        <Card className="shadow-2xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Distribución de riesgo</CardTitle>
            <CardDescription>Basado en el modelo predictivo multicriterio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionRiesgo}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={92}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distribucionRiesgo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name, item) => [`${val}% (${item.payload.count} estudiantes)`, `Riesgo ${item.payload.name}`]}
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#27272a',
                      color: '#fafafa',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    formatter={(value, entry) => (
                      <span className="text-xs font-medium text-zinc-600">
                        {value} ({entry.payload.value}%)
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Card: Tendencia de Riesgo */}
        <Card className="shadow-2xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Tendencia de riesgo (últimos 6 meses)</CardTitle>
            <CardDescription>
              El porcentaje de riesgo se calcula sobre el total de estudiantes activos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tendenciaRiesgo} margin={{ top: 15, right: 25, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                  <XAxis dataKey="mes" tick={{ fill: '#71717a', fontSize: 11 }} />
                  <YAxis
                    unit="%"
                    domain={[0, 'auto']}
                    tick={{ fill: '#71717a', fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Tasa de riesgo']}
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#27272a',
                      color: '#fafafa',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="porcentaje"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fila 3: Factores de Impacto, Alertas y Distribución por Programa (Diseño Simétrico y Equilibrado) */}
      <div className="grid gap-6 md:grid-cols-3 items-stretch">
        {/* Card 1: Factores de Mayor Impacto */}
        <Card className="shadow-2xs flex flex-col h-full bg-white border border-zinc-200/80">
          <CardHeader className="pb-3 pt-5 px-5 space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-zinc-950">Factores de mayor impacto</CardTitle>
              <Badge variant="outline" className="text-[10px] text-zinc-500 font-normal border-zinc-200">
                Ponderado
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500">
              Importancia relativa según el modelo predictivo
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-1 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5 my-auto">
              {factoresImpacto.map((item, idx) => {
                // Colorización semántica según el nivel de impacto
                const indicatorColor =
                  item.porcentaje >= 50
                    ? 'bg-rose-500'
                    : item.porcentaje >= 40
                    ? 'bg-amber-500'
                    : 'bg-blue-600';

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-zinc-800 text-[12px]">{item.factor}</span>
                      <div className="flex items-center gap-1.5">
                        {item.count !== undefined && (
                          <span className="text-[11px] text-zinc-400 font-mono">({item.count} est.)</span>
                        )}
                        <span className="font-mono font-semibold text-zinc-950 text-[12px]">
                          {item.porcentaje}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={item.porcentaje}
                      className="h-2 bg-zinc-100"
                      indicatorClassName={indicatorColor}
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 mt-4">
              <span>Variables críticas analizadas</span>
              <span className="font-semibold text-zinc-700">{factoresImpacto.length} dimensiones</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Alertas Recientes */}
        <Card className="shadow-2xs flex flex-col h-full bg-white border border-zinc-200/80">
          <CardHeader className="pb-3 pt-5 px-5 space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-zinc-950">Alertas recientes</CardTitle>
              <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-200 bg-rose-50 font-medium">
                {alertas.length} en seguimiento
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500">
              Eventos prioritarios detectados en plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-1 flex-1 flex flex-col justify-between">
            <div className="space-y-2.5 my-auto">
              {alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  onClick={onNavigateToStudents}
                  className="flex items-start justify-between p-2.5 rounded-lg border border-zinc-200/70 bg-zinc-50/60 hover:bg-zinc-100/80 transition-all cursor-pointer group"
                >
                  <div className="space-y-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={alerta.variant} className="text-[10px] py-0 px-1.5 font-medium">
                        {alerta.label}
                      </Badge>
                      <span className="text-[11px] text-zinc-400 font-mono">{alerta.tiempo}</span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 leading-snug">
                      {alerta.titulo}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onNavigateToStudents}
              className="w-full text-xs font-medium text-zinc-700 hover:text-zinc-900 border-zinc-200 h-8 flex items-center justify-center gap-1.5 mt-4 group cursor-pointer"
            >
              <span>Ver expedientes en riesgo</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200 text-zinc-400 group-hover:text-zinc-900" />
            </Button>
          </CardContent>
        </Card>

        {/* Card 3: Distribución por Programa Académico */}
        <Card className="shadow-2xs flex flex-col h-full bg-white border border-zinc-200/80">
          <CardHeader className="pb-3 pt-5 px-5 space-y-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-zinc-950">Distribución por programa</CardTitle>
              <Badge variant="outline" className="text-[10px] text-zinc-600 font-mono border-zinc-200">
                {kpis.totalEstudiantes} estudiantes
              </Badge>
            </div>
            <CardDescription className="text-xs text-zinc-500">
              Estudiantes activos evaluados en el ciclo actual
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-1 flex-1 flex flex-col justify-between">
            {/* Gráfico Donut con contador central */}
            <div className="relative h-36 flex items-center justify-center my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionPrograma}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distribucionPrograma.map((entry, index) => (
                      <Cell key={`prog-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Matrícula']}
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#27272a',
                      color: '#fafafa',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Contador centralizado en el donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold font-mono text-zinc-950 leading-none">
                  {kpis.totalEstudiantes}
                </span>
                <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mt-0.5">
                  Total
                </span>
              </div>
            </div>

            {/* Cuadrícula simétrica de 2 columnas de programas */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-zinc-100 text-xs">
              {distribucionPrograma.map((prog, idx) => (
                <div key={idx} className="flex items-center justify-between min-w-0 py-0.5">
                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: prog.color }}
                    />
                    <span
                      className="truncate text-[11px] font-medium text-zinc-700 hover:text-zinc-950"
                      title={prog.name}
                    >
                      {prog.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-zinc-900 shrink-0">
                    {prog.value}%
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 mt-2">
              <span>Programas registrados</span>
              <span className="font-semibold text-zinc-700">{distribucionPrograma.length} carreras</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
