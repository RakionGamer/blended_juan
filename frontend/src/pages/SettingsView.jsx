import React, { useState } from 'react';
import { 
  Settings, Sliders, Database, ShieldCheck, CheckCircle2, 
  Save, RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { toast } from 'sonner';

export default function SettingsView() {
  const [periodo, setPeriodo] = useState('2026-1');
  const [minGrade, setMinGrade] = useState('3.00');
  const [minAttendance, setMinAttendance] = useState('75');
  const [maxInactivity, setMaxInactivity] = useState('14');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Parámetros actualizados', {
        description: 'La configuración institucional del motor analítico ha sido guardada.'
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Configuración Institucional
            </h1>
            <Badge variant="outline" className="bg-zinc-100 text-zinc-900 border-zinc-300 text-xs font-semibold">
              Sistema Activo
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Parámetros del motor predictivo multicriterio y conexión con el ecosistema de datos.
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-xs"
        >
          {saving ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      {/* Tarjeta de Parámetros de Riesgo */}
      <Card className="shadow-2xs border-zinc-200 bg-white">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-700" />
            <CardTitle className="text-base font-semibold text-zinc-950">
              Umbrales de Detección de Deserción
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-zinc-500">
            Valores límite utilizados por el algoritmo para activar alertas tempranas de deserción.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Calificación Mínima Aprobatoria (Escala 0.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-zinc-300 bg-zinc-50/50 font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <p className="text-[11px] text-zinc-500">Estudiantes por debajo de este promedio recibirán factor de riesgo académico.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Asistencia Presencial Mínima (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={minAttendance}
                onChange={(e) => setMinAttendance(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-zinc-300 bg-zinc-50/50 font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <p className="text-[11px] text-zinc-500">Umbral reglamentario institucional para sesiones presenciales.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Inactividad Crítica en LMS (Días sin conexión)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={maxInactivity}
                onChange={(e) => setMaxInactivity(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-zinc-300 bg-zinc-50/50 font-mono text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
              <p className="text-[11px] text-zinc-500">Días sin interacción en Moodle para clasificar desconexión severa.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-800">
                Periodo Académico Activo
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md border border-zinc-300 bg-zinc-50/50 font-semibold text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 cursor-pointer"
              >
                <option value="2026-1">2026-1 (Ciclo Vigente)</option>
                <option value="2025-2">2025-2</option>
                <option value="2025-1">2025-1</option>
              </select>
              <p className="text-[11px] text-zinc-500">Periodo utilizado por defecto en las evaluaciones y reportes.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Base de Datos y Motor */}
      <Card className="shadow-2xs border-zinc-200 bg-white">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-700" />
            <CardTitle className="text-base font-semibold text-zinc-950">
              Conexión de Base de Datos y Algoritmo
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-zinc-50">
            <div>
              <p className="font-semibold text-zinc-950">Motor de Base de Datos</p>
              <p className="text-zinc-500 font-mono text-[11px]">TiDB Cloud (AWS Tokyo) • blended_learning_analytics</p>
            </div>
            <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-[10px]">
              CONECTADO
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 bg-zinc-50">
            <div>
              <p className="font-semibold text-zinc-950">Ponderación de Dimensiones</p>
              <p className="text-zinc-500 text-[11px]">40% Telemetría LMS | 35% Notas Académicas | 25% Asistencia Presencial</p>
            </div>
            <Badge variant="secondary" className="font-mono text-[10px]">
              v1.0-weighted
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
