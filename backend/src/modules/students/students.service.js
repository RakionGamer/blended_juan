import { query, isDbConnected } from '../../config/db.js';
import { calculateDropoutRisk } from '../analytics/scoring.engine.js';

export class StudentsService {
  static async list({ riesgo, facultad, search, page = 1, limit = 50 }) {
    if (!isDbConnected) {
      throw new Error('La base de datos MySQL no está conectada.');
    }

    // Consulta para obtener estudiantes con sus métricas más recientes y predicciones de riesgo
    let sql = `
      SELECT 
        e.id, e.codigo_estudiantil, e.nombre_completo, e.email, e.facultad, e.carrera, 
        e.semestre_actual, e.modalidad, e.estado_matricula,
        p.score_probabilidad, p.nivel_riesgo, p.factores_criticos, p.recomendaciones, p.fecha_calculo,
        ma.promedio_acumulado, ma.porcentaje_asistencia_presencial, ma.materias_inscritas, ma.materias_reprobadas,
        ml.horas_conexion_semanal, ml.dias_ultimo_acceso, ml.porcentaje_entregas_a_tiempo, ml.accesos_plataforma_mes
      FROM estudiantes e
      LEFT JOIN (
        SELECT p1.*
        FROM predicciones_riesgo p1
        INNER JOIN (
          SELECT estudiante_id, MAX(fecha_calculo) as max_fecha
          FROM predicciones_riesgo
          GROUP BY estudiante_id
        ) p2 ON p1.estudiante_id = p2.estudiante_id AND p1.fecha_calculo = p2.max_fecha
      ) p ON e.id = p.estudiante_id
      LEFT JOIN (
        SELECT ma1.*
        FROM metricas_academicas ma1
        INNER JOIN (
          SELECT estudiante_id, MAX(id) as max_id
          FROM metricas_academicas
          GROUP BY estudiante_id
        ) ma2 ON ma1.id = ma2.max_id
      ) ma ON e.id = ma.estudiante_id
      LEFT JOIN (
        SELECT ml1.*
        FROM metricas_lms ml1
        INNER JOIN (
          SELECT estudiante_id, MAX(id) as max_id
          FROM metricas_lms
          GROUP BY estudiante_id
        ) ml2 ON ml1.id = ml2.max_id
      ) ml ON e.id = ml.estudiante_id
      WHERE 1=1
    `;
    const params = [];

    if (riesgo) {
      sql += ' AND LOWER(p.nivel_riesgo) = LOWER(?)';
      params.push(riesgo);
    }
    if (facultad) {
      sql += ' AND LOWER(e.facultad) = LOWER(?)';
      params.push(facultad);
    }
    if (search) {
      sql += ' AND (e.nombre_completo LIKE ? OR e.codigo_estudiantil LIKE ? OR e.carrera LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Sanitizar paginación numérica segura sin usar placeholders para evitar error 'Incorrect arguments to LIMIT'
    const safeLimit = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeOffset = (safePage - 1) * safeLimit;

    // Ordenar de mayor a menor riesgo por defecto
    sql += ` ORDER BY COALESCE(p.score_probabilidad, 0) DESC, e.id ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

    const rows = await query(sql, params);

    // Contar total general para paginación
    let countSql = `
      SELECT COUNT(DISTINCT e.id) as total
      FROM estudiantes e
      LEFT JOIN (
        SELECT p1.estudiante_id, p1.nivel_riesgo
        FROM predicciones_riesgo p1
        INNER JOIN (
          SELECT estudiante_id, MAX(fecha_calculo) as max_fecha
          FROM predicciones_riesgo
          GROUP BY estudiante_id
        ) p2 ON p1.estudiante_id = p2.estudiante_id AND p1.fecha_calculo = p2.max_fecha
      ) p ON e.id = p.estudiante_id
      WHERE 1=1
    `;
    const countParams = [];
    if (riesgo) {
      countSql += ' AND LOWER(p.nivel_riesgo) = LOWER(?)';
      countParams.push(riesgo);
    }
    if (facultad) {
      countSql += ' AND LOWER(e.facultad) = LOWER(?)';
      countParams.push(facultad);
    }
    if (search) {
      countSql += ' AND (e.nombre_completo LIKE ? OR e.codigo_estudiantil LIKE ? OR e.carrera LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countRes = await query(countSql, countParams);
    const totalCount = countRes[0]?.total || rows.length;

    return {
      total: totalCount,
      page: Number(page),
      data: rows.map(r => ({
        ...r,
        prediccion: r.nivel_riesgo ? {
          score_probabilidad: Number(r.score_probabilidad || 0),
          nivel_riesgo: r.nivel_riesgo,
          factores_criticos: typeof r.factores_criticos === 'string' ? JSON.parse(r.factores_criticos) : (r.factores_criticos || []),
          recomendaciones: typeof r.recomendaciones === 'string' ? JSON.parse(r.recomendaciones) : (r.recomendaciones || []),
          fecha_calculo: r.fecha_calculo
        } : null,
        academica: {
          promedio_acumulado: Number(r.promedio_acumulado || 0),
          porcentaje_asistencia_presencial: Number(r.porcentaje_asistencia_presencial || 0),
          materias_inscritas: Number(r.materias_inscritas || 0),
          materias_reprobadas: Number(r.materias_reprobadas || 0)
        },
        lms: {
          horas_conexion_semanal: Number(r.horas_conexion_semanal || 0),
          dias_ultimo_acceso: Number(r.dias_ultimo_acceso || 0),
          porcentaje_entregas_a_tiempo: Number(r.porcentaje_entregas_a_tiempo || 0),
          accesos_plataforma_mes: Number(r.accesos_plataforma_mes || 0)
        }
      }))
    };
  }

  static async getById(id) {
    const studentId = Number(id);
    if (!isDbConnected) {
      throw new Error('La base de datos MySQL no está conectada.');
    }

    const students = await query('SELECT * FROM estudiantes WHERE id = ?', [studentId]);
    if (!students || students.length === 0) {
      const error = new Error(`Estudiante con ID ${studentId} no encontrado en la base de datos.`);
      error.statusCode = 404;
      throw error;
    }

    const student = students[0];
    const academic = await query('SELECT * FROM metricas_academicas WHERE estudiante_id = ? ORDER BY id DESC LIMIT 1', [studentId]);
    const lms = await query('SELECT * FROM metricas_lms WHERE estudiante_id = ? ORDER BY id DESC LIMIT 1', [studentId]);
    const risk = await query('SELECT * FROM predicciones_riesgo WHERE estudiante_id = ? ORDER BY fecha_calculo DESC LIMIT 1', [studentId]);

    const academicData = academic[0] || null;
    const lmsData = lms[0] || null;

    let prediction = null;
    if (risk[0]) {
      prediction = {
        ...risk[0],
        factores_criticos: typeof risk[0].factores_criticos === 'string' ? JSON.parse(risk[0].factores_criticos) : (risk[0].factores_criticos || []),
        recomendaciones: typeof risk[0].recomendaciones === 'string' ? JSON.parse(risk[0].recomendaciones) : (risk[0].recomendaciones || [])
      };
    } else if (academicData || lmsData) {
      prediction = calculateDropoutRisk(academicData, lmsData);
    }

    return {
      ...student,
      academica: academicData,
      lms: lmsData,
      prediccion: prediction
    };
  }
}
