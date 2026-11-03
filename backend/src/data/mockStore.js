import { calculateDropoutRisk } from '../modules/analytics/scoring.engine.js';

export const mockUsers = [
  {
    id: 1,
    rol: 'Administrador',
    nombre: 'Carlos Mendoza',
    email: 'admin@universidad.edu',
    password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ec5PQSvGTC8vL.mte' // 'admin123'
  },
  {
    id: 2,
    rol: 'Coordinador',
    nombre: 'Dra. Elena Ramos',
    email: 'coord@universidad.edu',
    password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ec5PQSvGTC8vL.mte'
  },
  {
    id: 4,
    rol: 'Coordinador',
    nombre: 'Dra. Elena Ramos',
    email: 'coordinacion@universidad.edu',
    password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ec5PQSvGTC8vL.mte'
  },
  {
    id: 3,
    rol: 'Docente',
    nombre: 'Prof. Roberto Silva',
    email: 'docente@universidad.edu',
    password_hash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6x8ec5PQSvGTC8vL.mte'
  }
];

export let mockStudents = [
  {
    id: 1,
    codigo_estudiantil: 'EST-2024-001',
    nombre_completo: 'Ana María Gómez',
    email: 'ana.gomez@estudiante.edu',
    facultad: 'Ingeniería',
    carrera: 'Ingeniería de Sistemas',
    semestre_actual: 3,
    modalidad: 'Blended',
    estado_matricula: 'En_Riesgo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 2.80,
      promedio_periodo_anterior: 3.10,
      materias_inscritas: 5,
      materias_reprobadas: 2,
      porcentaje_asistencia_presencial: 65.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 1.80,
      accesos_plataforma_mes: 12,
      porcentaje_entregas_a_tiempo: 55.00,
      interacciones_foros: 1,
      dias_ultimo_acceso: 16
    }
  },
  {
    id: 2,
    codigo_estudiantil: 'EST-2024-002',
    nombre_completo: 'Juan David Morales',
    email: 'juan.morales@estudiante.edu',
    facultad: 'Ingeniería',
    carrera: 'Ingeniería Industrial',
    semestre_actual: 4,
    modalidad: 'Blended',
    estado_matricula: 'En_Riesgo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 3.35,
      promedio_periodo_anterior: 3.50,
      materias_inscritas: 6,
      materias_reprobadas: 1,
      porcentaje_asistencia_presencial: 72.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 4.50,
      accesos_plataforma_mes: 34,
      porcentaje_entregas_a_tiempo: 75.00,
      interacciones_foros: 3,
      dias_ultimo_acceso: 6
    }
  },
  {
    id: 3,
    codigo_estudiantil: 'EST-2024-003',
    nombre_completo: 'Valentina Castro',
    email: 'valentina.castro@estudiante.edu',
    facultad: 'Ciencias Económicas',
    carrera: 'Administración de Empresas',
    semestre_actual: 2,
    modalidad: 'Blended',
    estado_matricula: 'Activo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 4.45,
      promedio_periodo_anterior: 4.30,
      materias_inscritas: 5,
      materias_reprobadas: 0,
      porcentaje_asistencia_presencial: 95.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 9.20,
      accesos_plataforma_mes: 78,
      porcentaje_entregas_a_tiempo: 100.00,
      interacciones_foros: 12,
      dias_ultimo_acceso: 1
    }
  },
  {
    id: 4,
    codigo_estudiantil: 'EST-2024-004',
    nombre_completo: 'Mateo Ramírez',
    email: 'mateo.ramirez@estudiante.edu',
    facultad: 'Ciencias de la Salud',
    carrera: 'Enfermería',
    semestre_actual: 5,
    modalidad: 'Blended',
    estado_matricula: 'Activo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 4.10,
      promedio_periodo_anterior: 3.90,
      materias_inscritas: 6,
      materias_reprobadas: 0,
      porcentaje_asistencia_presencial: 88.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 7.50,
      accesos_plataforma_mes: 62,
      porcentaje_entregas_a_tiempo: 92.00,
      interacciones_foros: 8,
      dias_ultimo_acceso: 2
    }
  },
  {
    id: 5,
    codigo_estudiantil: 'EST-2024-005',
    nombre_completo: 'Camila Vargas',
    email: 'camila.vargas@estudiante.edu',
    facultad: 'Ingeniería',
    carrera: 'Ingeniería de Sistemas',
    semestre_actual: 1,
    modalidad: 'Blended',
    estado_matricula: 'En_Riesgo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 2.50,
      promedio_periodo_anterior: null,
      materias_inscritas: 5,
      materias_reprobadas: 3,
      porcentaje_asistencia_presencial: 58.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 0.80,
      accesos_plataforma_mes: 6,
      porcentaje_entregas_a_tiempo: 40.00,
      interacciones_foros: 0,
      dias_ultimo_acceso: 19
    }
  },
  {
    id: 6,
    codigo_estudiantil: 'EST-2024-006',
    nombre_completo: 'Santiago Herrera',
    email: 'santiago.herrera@estudiante.edu',
    facultad: 'Ciencias Económicas',
    carrera: 'Contaduría Pública',
    semestre_actual: 3,
    modalidad: 'Blended',
    estado_matricula: 'Activo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 3.70,
      promedio_periodo_anterior: 3.65,
      materias_inscritas: 5,
      materias_reprobadas: 0,
      porcentaje_asistencia_presencial: 85.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 6.00,
      accesos_plataforma_mes: 48,
      porcentaje_entregas_a_tiempo: 88.00,
      interacciones_foros: 5,
      dias_ultimo_acceso: 3
    }
  },
  {
    id: 7,
    codigo_estudiantil: 'EST-2024-007',
    nombre_completo: 'Lucía Fernández',
    email: 'lucia.fernandez@estudiante.edu',
    facultad: 'Ciencias Humanas',
    carrera: 'Psicología',
    semestre_actual: 4,
    modalidad: 'Blended',
    estado_matricula: 'Activo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 3.40,
      promedio_periodo_anterior: 3.55,
      materias_inscritas: 6,
      materias_reprobadas: 1,
      porcentaje_asistencia_presencial: 80.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 5.10,
      accesos_plataforma_mes: 40,
      porcentaje_entregas_a_tiempo: 70.00,
      interacciones_foros: 4,
      dias_ultimo_acceso: 8
    }
  },
  {
    id: 8,
    codigo_estudiantil: 'EST-2024-008',
    nombre_completo: 'Andrés Felipe Peña',
    email: 'andres.pena@estudiante.edu',
    facultad: 'Ingeniería',
    carrera: 'Ingeniería de Sistemas',
    semestre_actual: 2,
    modalidad: 'Blended',
    estado_matricula: 'En_Riesgo',
    academica: {
      periodo_academico: '2026-1',
      promedio_acumulado: 2.95,
      promedio_periodo_anterior: 3.20,
      materias_inscritas: 5,
      materias_reprobadas: 2,
      porcentaje_asistencia_presencial: 70.00
    },
    lms: {
      periodo_academico: '2026-1',
      horas_conexion_semanal: 2.10,
      accesos_plataforma_mes: 16,
      porcentaje_entregas_a_tiempo: 50.00,
      interacciones_foros: 1,
      dias_ultimo_acceso: 14
    }
  }
];

// Pre-calcular predicciones usando el motor
mockStudents.forEach(student => {
  student.prediccion = calculateDropoutRisk(student.academica, student.lms);
});
