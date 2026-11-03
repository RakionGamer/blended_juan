/**
 * MOTOR DE APRENDIZAJE Y SCORING DE RIESGO DE DESERCIÓN (LEARNING ANALYTICS)
 * Especializado en modalidad Blended Learning (Híbrida)
 *
 * Evalúa tres pilares interconectados:
 * 1. Dimensión Académica (35%): Calificación acumulada y tasa de asignaturas reprobadas.
 * 2. Dimensión LMS / Virtual (40%): Ausentismo en plataforma, cumplimiento de entregas y actividad colaborativa.
 * 3. Dimensión Presencial (25%): Cumplimiento de asistencia física a talleres/sesiones.
 */

export function calculateDropoutRisk(academicMetrics = {}, lmsMetrics = {}) {
  const factors = [];
  const recommendations = [];

  // Valores predeterminados seguros
  const promedio = Number(academicMetrics.promedio_acumulado ?? 3.5);
  const inscritas = Number(academicMetrics.materias_inscritas ?? 5);
  const reprobadas = Number(academicMetrics.materias_reprobadas ?? 0);
  const asistenciaPresencial = Number(academicMetrics.porcentaje_asistencia_presencial ?? 100);

  const diasInactivo = Number(lmsMetrics.dias_ultimo_acceso ?? 0);
  const entregasATiempo = Number(lmsMetrics.porcentaje_entregas_a_tiempo ?? 100);
  const horasLms = Number(lmsMetrics.horas_conexion_semanal ?? 5);
  const foros = Number(lmsMetrics.interacciones_foros ?? 3);

  // -------------------------------------------------------------
  // 1. DIMENSIÓN ACADÉMICA (Peso: 0.35)
  // Escala académica: 0.0 a 5.0 (Umbral mínimo de aprobación habitual: 3.0)
  // -------------------------------------------------------------
  const maxGrade = 5.0;
  const gradeDeficit = Math.max(0, Math.min(1, (maxGrade - promedio) / maxGrade));
  const failRate = inscritas > 0 ? Math.min(1, reprobadas / inscritas) : 0;
  const academicRisk = (gradeDeficit * 0.55) + (failRate * 0.45);

  if (promedio < 3.0) {
    factors.push({
      dimension: 'Académica',
      factor: 'Promedio acumulado por debajo del mínimo aprobatorio',
      impacto: 'Crítico',
      valor: `${promedio.toFixed(2)} / ${maxGrade.toFixed(1)}`
    });
    recommendations.push('Asignar tutoría académica intensiva en asignaturas críticas');
  } else if (promedio < 3.4) {
    factors.push({
      dimension: 'Académica',
      factor: 'Promedio académico en zona de advertencia',
      impacto: 'Medio',
      valor: `${promedio.toFixed(2)} / ${maxGrade.toFixed(1)}`
    });
  }

  if (reprobadas >= 2) {
    factors.push({
      dimension: 'Académica',
      factor: 'Múltiples materias reprobadas en el ciclo activo',
      impacto: 'Crítico',
      valor: `${reprobadas} materias reprobadas`
    });
    recommendations.push('Revisión de carga académica con el director de carrera');
  } else if (reprobadas === 1) {
    factors.push({
      dimension: 'Académica',
      factor: 'Asignatura reprobada que compromete prerrequisitos',
      impacto: 'Medio',
      valor: '1 materia reprobada'
    });
  }

  // -------------------------------------------------------------
  // 2. DIMENSIÓN LMS / ENGAGEMENT VIRTUAL (Peso: 0.40)
  // -------------------------------------------------------------
  let lmsInactivityScore = 0;
  if (diasInactivo > 14) {
    lmsInactivityScore = 1.0;
    factors.push({
      dimension: 'LMS',
      factor: 'Desconexión severa del entorno virtual (> 14 días)',
      impacto: 'Crítico',
      valor: `${diasInactivo} días sin ingresar`
    });
    recommendations.push('Contacto prioritario de bienestar universitario / consejería psicológica');
  } else if (diasInactivo > 7) {
    lmsInactivityScore = 0.65;
    factors.push({
      dimension: 'LMS',
      factor: 'Inactividad prolongada en plataforma LMS',
      impacto: 'Medio',
      valor: `${diasInactivo} días sin ingresar`
    });
    recommendations.push('Envío de recordatorio automatizado y alerta al docente');
  } else {
    lmsInactivityScore = Math.min(0.3, diasInactivo / 20);
  }

  const unsubmittedScore = Math.max(0, Math.min(1, (100 - entregasATiempo) / 100));
  if (entregasATiempo < 70) {
    factors.push({
      dimension: 'LMS',
      factor: 'Incumplimiento frecuente en la entrega de tareas virtuales',
      impacto: 'Alto',
      valor: `${entregasATiempo.toFixed(0)}% entregadas a tiempo`
    });
    recommendations.push('Revisar posibles barreras de conectividad o sobrecarga de tareas');
  }

  const lowHoursScore = horasLms < 2 ? 0.8 : (horasLms < 4 ? 0.4 : 0.0);
  const forumRisk = foros === 0 ? 0.7 : (foros < 2 ? 0.35 : 0.0);

  const lmsRisk = (lmsInactivityScore * 0.45) + (unsubmittedScore * 0.35) + (lowHoursScore * 0.10) + (forumRisk * 0.10);

  // -------------------------------------------------------------
  // 3. DIMENSIÓN ASISTENCIA PRESENCIAL (Peso: 0.25)
  // -------------------------------------------------------------
  const attendanceDeficit = Math.max(0, Math.min(1, (100 - asistenciaPresencial) / 100));
  if (asistenciaPresencial < 75) {
    factors.push({
      dimension: 'Presencial',
      factor: 'Inasistencia presencial inferior al mínimo reglamentario (75%)',
      impacto: 'Alto',
      valor: `${asistenciaPresencial.toFixed(1)}% asistencia`
    });
    recommendations.push('Verificación de causales de inasistencia presencial (laborales o de salud)');
  }

  // -------------------------------------------------------------
  // 4. SCORE PONDERADO Y PENALIZACIÓN POR SINERGIA DE RIESGOS
  // -------------------------------------------------------------
  let rawScore = (academicRisk * 0.35) + (lmsRisk * 0.40) + (attendanceDeficit * 0.25);

  // Penalización compuesta: Si tanto el LMS como la asistencia presencial fallan, la deserción es inminente
  if (diasInactivo > 10 && asistenciaPresencial < 75) {
    rawScore = Math.min(1.0, rawScore + 0.15);
  }

  const scoreFinal = Math.min(1.0, Math.max(0.0, Number(rawScore.toFixed(4))));

  // Clasificación Categórica
  let nivelRiesgo = 'Bajo';
  if (scoreFinal >= 0.65) {
    nivelRiesgo = 'Alto';
  } else if (scoreFinal >= 0.35) {
    nivelRiesgo = 'Medio';
  }

  if (recommendations.length === 0) {
    recommendations.push('Mantener el seguimiento y estímulo académico regular');
  }

  return {
    score_probabilidad: scoreFinal,
    nivel_riesgo: nivelRiesgo,
    factores_criticos: factors,
    recomendaciones: recommendations,
    metricas_resumen: {
      riesgo_academico: Number((academicRisk * 100).toFixed(1)),
      riesgo_lms: Number((lmsRisk * 100).toFixed(1)),
      riesgo_asistencia: Number((attendanceDeficit * 100).toFixed(1))
    },
    version_algoritmo: 'v1.0-weighted'
  };
}
