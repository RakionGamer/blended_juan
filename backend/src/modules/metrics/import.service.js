import * as XLSX from 'xlsx';
import { query } from '../../config/db.js';
import { calculateDropoutRisk } from '../analytics/scoring.engine.js';

// Función para normalizar nombres de columnas (elimina acentos, minúsculas, espacios a guiones bajos)
function normalizeKey(str) {
  if (!str) return '';
  return str
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
    .replace(/[^a-z0-9_]/g, '_')     // Caracteres no alfanuméricos a _
    .replace(/_+/g, '_')             // Evitar guiones múltiples
    .replace(/^_|_$/g, '');          // Quitar bordes
}

// Mapeador flexible para nombres de columnas frecuentes en sistemas universitarios
const COLUMN_ALIASES = {
  codigo_estudiantil: ['codigo_estudiantil', 'codigo', 'cod_estudiante', 'estudiante_id', 'id_estudiante', 'identificacion', 'documento', 'matricula', 'student_id'],
  nombre_completo: ['nombre_completo', 'nombre', 'nombres_y_apellidos', 'nombres_apellidos', 'nombre_y_apellido', 'nombre_apellido', 'apellidos_y_nombres', 'estudiante', 'alumno', 'nombres', 'student_name'],
  email: ['email', 'correo', 'correo_electronico', 'correo_institucional', 'email_institucional'],
  facultad: ['facultad', 'facultad_nombre', 'division', 'faculty'],
  carrera: ['carrera', 'programa', 'programa_academico', 'carrera_profesional', 'degree', 'program'],
  semestre_actual: ['semestre_actual', 'semestre', 'nivel', 'semestre_academico', 'semester'],
  modalidad: ['modalidad', 'modalidad_estudio', 'tipo_matricula', 'mode'],
  
  // Métricas Académicas
  promedio_acumulado: ['promedio_acumulado', 'promedio', 'nota_promedio', 'gpa', 'promedio_general', 'calificacion_media'],
  promedio_periodo_anterior: ['promedio_periodo_anterior', 'promedio_anterior', 'gpa_anterior', 'nota_anterior'],
  materias_inscritas: ['materias_inscritas', 'materias', 'asignaturas_inscritas', 'creditos_inscritos', 'courses_enrolled'],
  materias_reprobadas: ['materias_reprobadas', 'reprobadas', 'materias_perdidas', 'asignaturas_reprobadas', 'courses_failed'],
  porcentaje_asistencia_presencial: ['porcentaje_asistencia_presencial', 'asistencia', 'asistencia_presencial', 'porcentaje_asistencia', 'asistencia_pct', 'attendance_pct'],
  
  // Métricas LMS / Moodle / Canvas
  horas_conexion_semanal: ['horas_conexion_semanal', 'horas_conexion', 'horas_lms', 'horas_plataforma', 'tiempo_conexion', 'weekly_hours'],
  accesos_plataforma_mes: ['accesos_plataforma_mes', 'accesos', 'ingresos_lms', 'accesos_mes', 'logins_month', 'monthly_accesses'],
  porcentaje_entregas_a_tiempo: ['porcentaje_entregas_a_tiempo', 'entregas_a_tiempo', 'tareas_entregadas', 'entregas_pct', 'pct_tareas_entregadas', 'assignments_on_time_pct'],
  interacciones_foros: ['interacciones_foros', 'foros', 'participacion_foros', 'mensajes_foro', 'forum_posts'],
  dias_ultimo_acceso: ['dias_ultimo_acceso', 'dias_inactivo', 'ultimo_acceso_dias', 'dias_sin_conexion', 'inactivity_days', 'days_last_access'],
  
  // Periodo Académico
  periodo_academico: ['periodo_academico', 'periodo', 'ciclo', 'term', 'academic_term']
};

function extractValueByAliases(rowNormalized, aliases, defaultValue = null) {
  for (const alias of aliases) {
    if (rowNormalized[alias] !== undefined && rowNormalized[alias] !== '') {
      return rowNormalized[alias];
    }
  }
  return defaultValue;
}

function parseNumber(val, min = 0, max = Infinity, defaultVal = 0) {
  if (val === undefined || val === null || val === '') return defaultVal;
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(',', '.'));
  if (isNaN(num)) return defaultVal;
  return Math.min(Math.max(num, min), max);
}

export class BatchImportService {
  /**
   * Procesa un archivo subido (CSV, XLSX, XLS) desde memoria
   */
  static async processUploadedFile(fileBuffer, originalname, options = {}) {
    const defaultPeriodo = options.periodo || '2026-1';
    
    // 1. Leer workbook con xlsx
    let workbook;
    try {
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    } catch (err) {
      throw new Error(`El archivo no tiene un formato válido CSV o Excel (.xlsx, .xls): ${err.message}`);
    }

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      throw new Error('El archivo no contiene ninguna hoja de cálculo.');
    }

    const sheet = workbook.Sheets[firstSheetName];
    const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (rawRows.length === 0) {
      throw new Error('El archivo no contiene filas de datos.');
    }

    // 2. Normalizar filas e iterar
    const summary = {
      filename: originalname,
      totalRows: rawRows.length,
      processed: 0,
      insertedStudents: 0,
      updatedStudents: 0,
      metricsProcessed: 0,
      predictionsCount: 0,
      riskCounts: { Alto: 0, Medio: 0, Bajo: 0 },
      errors: []
    };

    let rowIndex = 1; // 1-based (considerando header fila 1 en Excel)

    for (const rawRow of rawRows) {
      rowIndex++;
      try {
        // Normalizar keys del row actual
        const normalizedRow = {};
        for (const [k, v] of Object.entries(rawRow)) {
          normalizedRow[normalizeKey(k)] = v;
        }

        // Extraer código estudiantil (obligatorio)
        const codigoEstudiantil = extractValueByAliases(normalizedRow, COLUMN_ALIASES.codigo_estudiantil);
        if (!codigoEstudiantil) {
          summary.errors.push({
            row: rowIndex,
            error: 'Fila omitida: falta la columna de identificación/código de estudiante.'
          });
          continue;
        }

        const codigo = String(codigoEstudiantil).trim();
        const rawPeriodo = extractValueByAliases(normalizedRow, COLUMN_ALIASES.periodo_academico, defaultPeriodo);
        const periodo = (!rawPeriodo || String(rawPeriodo).includes('.') || (!isNaN(Number(rawPeriodo)) && Number(rawPeriodo) > 10000))
          ? defaultPeriodo 
          : String(rawPeriodo).trim();

        // Extraer campos de estudiante
        const nombreCompleto = extractValueByAliases(normalizedRow, COLUMN_ALIASES.nombre_completo, `Estudiante ${codigo}`);
        const email = extractValueByAliases(normalizedRow, COLUMN_ALIASES.email, `${codigo.toLowerCase()}@universidad.edu`);
        const facultad = extractValueByAliases(normalizedRow, COLUMN_ALIASES.facultad, 'Facultad de Ingeniería y Ciencias');
        const carrera = extractValueByAliases(normalizedRow, COLUMN_ALIASES.carrera, 'Ingeniería de Sistemas');
        const semestre = parseInt(extractValueByAliases(normalizedRow, COLUMN_ALIASES.semestre_actual, 1), 10) || 1;
        const modalidad = extractValueByAliases(normalizedRow, COLUMN_ALIASES.modalidad, 'Blended');

        // Extraer métricas académicas
        const promedioAcumulado = parseNumber(extractValueByAliases(normalizedRow, COLUMN_ALIASES.promedio_acumulado), 0, 5, 3.5);
        const promedioAnterior = parseNumber(extractValueByAliases(normalizedRow, COLUMN_ALIASES.promedio_periodo_anterior), 0, 5, promedioAcumulado);
        const materiasInscritas = parseInt(extractValueByAliases(normalizedRow, COLUMN_ALIASES.materias_inscritas, 5), 10) || 5;
        const materiasReprobadas = parseInt(extractValueByAliases(normalizedRow, COLUMN_ALIASES.materias_reprobadas, 0), 10) || 0;
        const asistenciaPresencial = parseNumber(extractValueByAliases(normalizedRow, COLUMN_ALIASES.porcentaje_asistencia_presencial), 0, 100, 85);

        // Extraer métricas LMS
        const horasConexion = parseNumber(extractValueByAliases(normalizedRow, COLUMN_ALIASES.horas_conexion_semanal), 0, 100, 6.0);
        const accesosMes = parseInt(extractValueByAliases(normalizedRow, COLUMN_ALIASES.accesos_plataforma_mes, 20), 10) || 20;
        const entregasATiempo = parseNumber(extractValueByAliases(normalizedRow, COLUMN_ALIASES.porcentaje_entregas_a_tiempo), 0, 100, 80);
        const interaccionesForos = parseInt(extractValueByAliases(normalizedRow, COLUMN_ALIASES.interacciones_foros, 2), 10) || 2;
        const diasUltimoAcceso = parseInt(extractValueByAliases(normalizedRow, COLUMN_ALIASES.dias_ultimo_acceso, 2), 10) || 2;

        // 3. Insertar o actualizar Estudiante en MySQL
        const existingStudent = await query('SELECT id FROM estudiantes WHERE codigo_estudiantil = ? OR email = ? LIMIT 1', [codigo, email]);
        let studentId;

        if (existingStudent && existingStudent.length > 0) {
          studentId = existingStudent[0].id;
          await query(
            `UPDATE estudiantes 
             SET nombre_completo = ?, facultad = ?, carrera = ?, semestre_actual = ?, modalidad = ?
             WHERE id = ?`,
            [nombreCompleto, facultad, carrera, semestre, modalidad, studentId]
          );
          summary.updatedStudents++;
        } else {
          const insertResult = await query(
            `INSERT INTO estudiantes 
             (codigo_estudiantil, nombre_completo, email, facultad, carrera, semestre_actual, modalidad, estado_matricula)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Activo')`,
            [codigo, nombreCompleto, email, facultad, carrera, semestre, modalidad]
          );
          studentId = insertResult.insertId;
          summary.insertedStudents++;
        }

        // 4. Insertar métricas académicas
        await query(
          `INSERT INTO metricas_academicas 
           (estudiante_id, periodo_academico, promedio_acumulado, promedio_periodo_anterior, materias_inscritas, materias_reprobadas, porcentaje_asistencia_presencial)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [studentId, periodo, promedioAcumulado, promedioAnterior, materiasInscritas, materiasReprobadas, asistenciaPresencial]
        );

        // 5. Insertar métricas LMS
        await query(
          `INSERT INTO metricas_lms 
           (estudiante_id, periodo_academico, horas_conexion_semanal, accesos_plataforma_mes, porcentaje_entregas_a_tiempo, interacciones_foros, dias_ultimo_acceso)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [studentId, periodo, horasConexion, accesosMes, entregasATiempo, interaccionesForos, diasUltimoAcceso]
        );

        summary.metricsProcessed++;

        // 6. Evaluar con motor de scoring analítico en tiempo real
        const academicData = {
          promedio_acumulado: promedioAcumulado,
          promedio_periodo_anterior: promedioAnterior,
          materias_inscritas: materiasInscritas,
          materias_reprobadas: materiasReprobadas,
          porcentaje_asistencia_presencial: asistenciaPresencial
        };

        const lmsData = {
          horas_conexion_semanal: horasConexion,
          accesos_plataforma_mes: accesosMes,
          porcentaje_entregas_a_tiempo: entregasATiempo,
          interacciones_foros: interaccionesForos,
          dias_ultimo_acceso: diasUltimoAcceso
        };

        const prediction = calculateDropoutRisk(academicData, lmsData);

        // Persistir predicción en MySQL
        await query(
          `INSERT INTO predicciones_riesgo 
           (estudiante_id, periodo_academico, score_probabilidad, nivel_riesgo, factores_criticos, recomendaciones, version_algoritmo)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            studentId,
            periodo,
            prediction.score_probabilidad,
            prediction.nivel_riesgo,
            JSON.stringify(prediction.factores_criticos),
            JSON.stringify(prediction.recomendaciones),
            prediction.version_algoritmo
          ]
        );

        // Si el riesgo es Alto, actualizar estado de matrícula a En_Riesgo
        if (prediction.nivel_riesgo === 'Alto') {
          await query("UPDATE estudiantes SET estado_matricula = 'En_Riesgo' WHERE id = ?", [studentId]);
        } else {
          await query("UPDATE estudiantes SET estado_matricula = 'Activo' WHERE id = ?", [studentId]);
        }

        summary.predictionsCount++;
        summary.riskCounts[prediction.nivel_riesgo] = (summary.riskCounts[prediction.nivel_riesgo] || 0) + 1;
        summary.processed++;

      } catch (rowErr) {
        summary.errors.push({
          row: rowIndex,
          error: `Error procesando fila: ${rowErr.message}`
        });
      }
    }

    return summary;
  }

  /**
   * Genera plantillas oficiales CSV / Excel para descarga por parte de coordinadores
   * @param {string} type - 'consolidado' | 'academico' | 'lms'
   * @param {string} format - 'xlsx' | 'csv'
   * @param {string} mode - 'empty' (lista para rellenar) | 'example' (con datos de ejemplo)
   */
  static generateTemplate(type = 'consolidado', format = 'xlsx', mode = 'empty') {
    let headers = [];
    let sampleRows = [];

    if (type === 'consolidado') {
      headers = [
        'codigo_estudiantil',
        'nombre_completo',
        'email',
        'facultad',
        'carrera',
        'semestre_actual',
        'modalidad',
        'promedio_acumulado',
        'promedio_periodo_anterior',
        'materias_inscritas',
        'materias_reprobadas',
        'porcentaje_asistencia_presencial',
        'horas_conexion_semanal',
        'accesos_plataforma_mes',
        'porcentaje_entregas_a_tiempo',
        'interacciones_foros',
        'dias_ultimo_acceso',
        'periodo_academico'
      ];

      if (mode === 'example') {
        sampleRows = [
          {
            codigo_estudiantil: 'EST-2026-101',
            nombre_completo: 'Mariana Duque Vélez',
            email: 'mariana.duque@universidad.edu',
            facultad: 'Ingeniería y Ciencias',
            carrera: 'Ingeniería de Sistemas',
            semestre_actual: 4,
            modalidad: 'Blended',
            promedio_acumulado: 4.45,
            promedio_periodo_anterior: 4.30,
            materias_inscritas: 5,
            materias_reprobadas: 0,
            porcentaje_asistencia_presencial: 96.0,
            horas_conexion_semanal: 11.5,
            accesos_plataforma_mes: 42,
            porcentaje_entregas_a_tiempo: 98.0,
            interacciones_foros: 8,
            dias_ultimo_acceso: 1,
            periodo_academico: '2026-1'
          },
          {
            codigo_estudiantil: 'EST-2026-102',
            nombre_completo: 'Carlos Eduardo Restrepo',
            email: 'carlos.restrepo@universidad.edu',
            facultad: 'Ciencias Económicas',
            carrera: 'Administración de Empresas',
            semestre_actual: 3,
            modalidad: 'Blended',
            promedio_acumulado: 2.45,
            promedio_periodo_anterior: 2.90,
            materias_inscritas: 5,
            materias_reprobadas: 2,
            porcentaje_asistencia_presencial: 62.0,
            horas_conexion_semanal: 1.5,
            accesos_plataforma_mes: 6,
            porcentaje_entregas_a_tiempo: 40.0,
            interacciones_foros: 0,
            dias_ultimo_acceso: 15,
            periodo_academico: '2026-1'
          },
          {
            codigo_estudiantil: 'EST-2026-103',
            nombre_completo: 'Laura Patricia Moreno',
            email: 'laura.moreno@universidad.edu',
            facultad: 'Ciencias Sociales y Humanas',
            carrera: 'Psicología',
            semestre_actual: 5,
            modalidad: 'Blended',
            promedio_acumulado: 3.65,
            promedio_periodo_anterior: 3.50,
            materias_inscritas: 6,
            materias_reprobadas: 0,
            porcentaje_asistencia_presencial: 85.0,
            horas_conexion_semanal: 6.2,
            accesos_plataforma_mes: 24,
            porcentaje_entregas_a_tiempo: 88.0,
            interacciones_foros: 5,
            dias_ultimo_acceso: 3,
            periodo_academico: '2026-1'
          },
          {
            codigo_estudiantil: 'EST-2026-104',
            nombre_completo: 'Santiago Herrera Morales',
            email: 'santiago.herrera@universidad.edu',
            facultad: 'Ingeniería y Ciencias',
            carrera: 'Ingeniería Industrial',
            semestre_actual: 2,
            modalidad: 'Blended',
            promedio_acumulado: 3.15,
            promedio_periodo_anterior: 3.40,
            materias_inscritas: 5,
            materias_reprobadas: 1,
            porcentaje_asistencia_presencial: 76.0,
            horas_conexion_semanal: 3.8,
            accesos_plataforma_mes: 16,
            porcentaje_entregas_a_tiempo: 72.0,
            interacciones_foros: 2,
            dias_ultimo_acceso: 6,
            periodo_academico: '2026-1'
          }
        ];
      } else {
        // Modo 'empty': Incluye una fila de plantilla inicial sugerida vacía para facilitar la edición
        sampleRows = [
          {
            codigo_estudiantil: 'EST-2026-001',
            nombre_completo: 'Ejemplo: Juan Pérez Gómez',
            email: 'juan.perez@universidad.edu',
            facultad: 'Facultad de Ingeniería',
            carrera: 'Ingeniería de Sistemas',
            semestre_actual: 1,
            modalidad: 'Blended',
            promedio_acumulado: 3.50,
            promedio_periodo_anterior: 3.50,
            materias_inscritas: 5,
            materias_reprobadas: 0,
            porcentaje_asistencia_presencial: 90.0,
            horas_conexion_semanal: 6.0,
            accesos_plataforma_mes: 20,
            porcentaje_entregas_a_tiempo: 85.0,
            interacciones_foros: 3,
            dias_ultimo_acceso: 2,
            periodo_academico: '2026-1'
          }
        ];
      }
    } else if (type === 'academico') {
      headers = [
        'codigo_estudiantil',
        'promedio_acumulado',
        'promedio_periodo_anterior',
        'materias_inscritas',
        'materias_reprobadas',
        'porcentaje_asistencia_presencial',
        'periodo_academico'
      ];
      sampleRows = [
        {
          codigo_estudiantil: 'EST-2026-001',
          promedio_acumulado: 3.80,
          promedio_periodo_anterior: 3.60,
          materias_inscritas: 5,
          materias_reprobadas: 0,
          porcentaje_asistencia_presencial: 90.0,
          periodo_academico: '2026-1'
        }
      ];
    } else if (type === 'lms') {
      headers = [
        'codigo_estudiantil',
        'horas_conexion_semanal',
        'accesos_plataforma_mes',
        'porcentaje_entregas_a_tiempo',
        'interacciones_foros',
        'dias_ultimo_acceso',
        'periodo_academico'
      ];
      sampleRows = [
        {
          codigo_estudiantil: 'EST-2026-001',
          horas_conexion_semanal: 8.0,
          accesos_plataforma_mes: 25,
          porcentaje_entregas_a_tiempo: 90.0,
          interacciones_foros: 4,
          dias_ultimo_acceso: 2,
          periodo_academico: '2026-1'
        }
      ];
    }

    const worksheet = XLSX.utils.json_to_sheet(sampleRows, { header: headers });

    // Ajustar automáticamente anchos de columna para formato profesional en Excel
    const colWidths = headers.map(key => {
      const maxValLen = Math.max(
        ...sampleRows.map(r => String(r[key] ?? '').length),
        0
      );
      return { wch: Math.max(key.length + 3, maxValLen + 2, 14) };
    });
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos_Estudiantes');

    if (format === 'xlsx') {
      return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    } else {
      return XLSX.utils.sheet_to_csv(worksheet);
    }
  }
}
