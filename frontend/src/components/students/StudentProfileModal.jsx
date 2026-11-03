import React, { useState } from 'react';
import RiskBadge from '../common/RiskBadge.jsx';
import { 
  X, AlertCircle, CheckCircle, BookOpen, Clock, 
  Activity, Award, UserCheck, RefreshCw, MessageSquare
} from 'lucide-react';
import { reevaluateStudent } from '../../services/api.js';

export default function StudentProfileModal({ student, onClose, onUpdated }) {
  const [recalculating, setRecalculating] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(student);

  if (!currentStudent) return null;

  const acad = currentStudent.academica || {};
  const lms = currentStudent.lms || {};
  const pred = currentStudent.prediccion || {};

  const handleReevaluate = async () => {
    setRecalculating(true);
    try {
      const updatedPrediction = await reevaluateStudent(currentStudent.id);
      setCurrentStudent(prev => ({
        ...prev,
        prediccion: updatedPrediction
      }));
      if (onUpdated) onUpdated();
    } catch (err) {
      console.error('Error recalculando riesgo:', err);
    } finally {
      setRecalculating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Cabecera del Perfil */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30 rounded-t-3xl">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{currentStudent.nombre_completo}</h2>
              <RiskBadge level={pred.nivel_riesgo} score={pred.score_probabilidad} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentStudent.codigo_estudiantil} • {currentStudent.carrera} ({currentStudent.facultad}) • Semestre {currentStudent.semestre_actual}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium">
                Modalidad: {currentStudent.modalidad || 'Blended Learning'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                Estado: {currentStudent.estado_matricula}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Modular */}
        <div className="p-6 space-y-6">
          {/* Métricas Clave Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dimensión Académica */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-slate-800 font-semibold text-sm">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" /> Dimensión Académica
                </span>
                <span className="text-xs font-mono text-slate-500">Periodo 2026-1</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Promedio Acumulado</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {acad.promedio_acumulado !== undefined ? Number(acad.promedio_acumulado).toFixed(2) : '-'} / 5.0
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Asistencia Presencial</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">
                    {acad.porcentaje_asistencia_presencial ?? 0}%
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Materias Inscritas</p>
                  <p className="text-base font-semibold text-slate-700 mt-1">{acad.materias_inscritas ?? 0}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Materias Reprobadas</p>
                  <p className={`text-base font-semibold mt-1 ${(acad.materias_reprobadas ?? 0) > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                    {acad.materias_reprobadas ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Dimensión LMS */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-slate-800 font-semibold text-sm">
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-violet-600" /> Dimensión LMS Virtual
                </span>
                <span className="text-xs font-mono text-slate-500">Telemetría Moodle/Canvas</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Última Conexión</p>
                  <p className={`text-lg font-bold mt-1 ${(lms.dias_ultimo_acceso ?? 0) > 7 ? 'text-red-600' : 'text-slate-800'}`}>
                    {lms.dias_ultimo_acceso ?? 0} días
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Entregas a Tiempo</p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{lms.porcentaje_entregas_a_tiempo ?? 0}%</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Horas Semanales</p>
                  <p className="text-base font-semibold text-slate-700 mt-1">{lms.horas_conexion_semanal ?? 0} hrs/sem</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-100">
                  <p className="text-slate-400 font-medium">Foros / Interacción</p>
                  <p className="text-base font-semibold text-slate-700 mt-1">{lms.interacciones_foros ?? 0} aportes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Factores Críticos Identificados */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Factores Críticos de Riesgo (Explicabilidad del Modelo)
            </h4>
            {pred.factores_criticos && pred.factores_criticos.length > 0 ? (
              <div className="space-y-2">
                {pred.factores_criticos.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-red-50/60 border border-red-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-semibold text-red-900">{f.factor || f}</span>
                    </div>
                    {f.valor && (
                      <span className="font-mono bg-white px-2 py-0.5 rounded text-red-700 border border-red-200">
                        {f.valor}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2 border border-emerald-200">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No se registran alertas críticas activas en este periodo. Métricas dentro de rangos normales.</span>
              </div>
            )}
          </div>

          {/* Recomendaciones de Intervención */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Rutas de Intervención y Acompañamiento Sugeridas
            </h4>
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              {pred.recomendaciones && pred.recomendaciones.length > 0 ? (
                pred.recomendaciones.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-indigo-950 font-medium">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{rec}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-indigo-900">Mantener plan de seguimiento general.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Algoritmo: {pred.version_algoritmo || 'v1.0-weighted'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReevaluate}
              disabled={recalculating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${recalculating ? 'animate-spin' : ''}`} />
              <span>{recalculating ? 'Calculando...' : 'Re-calcular Riesgo'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
