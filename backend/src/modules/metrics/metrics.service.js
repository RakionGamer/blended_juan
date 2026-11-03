import { query, isDbConnected } from '../../config/db.js';
import { mockStudents } from '../../data/mockStore.js';
import { calculateDropoutRisk } from '../analytics/scoring.engine.js';

export class MetricsService {
  static async ingestMetrics(payload) {
    const records = Array.isArray(payload) ? payload : [payload];
    const results = [];

    for (const record of records) {
      const {
        estudiante_id,
        codigo_estudiantil,
        periodo_academico = '2026-1',
        academica = {},
        lms = {}
      } = record;

      let studentId = estudiante_id;

      // Calcular predicción con el motor analítico
      const prediction = calculateDropoutRisk(academica, lms);

      if (isDbConnected) {
        try {
          if (!studentId && codigo_estudiantil) {
            const students = await query('SELECT id FROM estudiantes WHERE codigo_estudiantil = ?', [codigo_estudiantil]);
            if (students.length > 0) studentId = students[0].id;
          }

          if (studentId) {
            // Insertar o actualizar métricas académicas
            await query(
              `INSERT INTO metricas_academicas 
               (estudiante_id, periodo_academico, promedio_acumulado, promedio_periodo_anterior, materias_inscritas, materias_reprobadas, porcentaje_asistencia_presencial)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                studentId,
                periodo_academico,
                academica.promedio_acumulado ?? 0,
                academica.promedio_periodo_anterior ?? null,
                academica.materias_inscritas ?? 0,
                academica.materias_reprobadas ?? 0,
                academica.porcentaje_asistencia_presencial ?? 100
              ]
            );

            // Insertar o actualizar métricas LMS
            await query(
              `INSERT INTO metricas_lms 
               (estudiante_id, periodo_academico, horas_conexion_semanal, accesos_plataforma_mes, porcentaje_entregas_a_tiempo, interacciones_foros, dias_ultimo_acceso)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                studentId,
                periodo_academico,
                lms.horas_conexion_semanal ?? 0,
                lms.accesos_plataforma_mes ?? 0,
                lms.porcentaje_entregas_a_tiempo ?? 100,
                lms.interacciones_foros ?? 0,
                lms.dias_ultimo_acceso ?? 0
              ]
            );

            // Persistir predicción calculada
            await query(
              `INSERT INTO predicciones_riesgo 
               (estudiante_id, periodo_academico, score_probabilidad, nivel_riesgo, factores_criticos, recomendaciones, version_algoritmo)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                studentId,
                periodo_academico,
                prediction.score_probabilidad,
                prediction.nivel_riesgo,
                JSON.stringify(prediction.factores_criticos),
                JSON.stringify(prediction.recomendaciones),
                prediction.version_algoritmo
              ]
            );

            // Actualizar estado de matrícula si es Alto riesgo
            if (prediction.nivel_riesgo === 'Alto') {
              await query("UPDATE estudiantes SET estado_matricula = 'En_Riesgo' WHERE id = ?", [studentId]);
            }
          }
        } catch (err) {
          console.warn('[INGEST] Error persistiendo en DB:', err.message);
        }
      }

      // Actualizar mockStore
      const existingStudent = mockStudents.find(s => 
        (studentId && s.id === Number(studentId)) || 
        (codigo_estudiantil && s.codigo_estudiantil === codigo_estudiantil)
      );

      if (existingStudent) {
        existingStudent.academica = { ...existingStudent.academica, ...academica, periodo_academico };
        existingStudent.lms = { ...existingStudent.lms, ...lms, periodo_academico };
        existingStudent.prediccion = prediction;
        if (prediction.nivel_riesgo === 'Alto') existingStudent.estado_matricula = 'En_Riesgo';
      }

      results.push({
        estudiante_id: studentId || existingStudent?.id,
        periodo_academico,
        prediction
      });
    }

    return results;
  }
}
