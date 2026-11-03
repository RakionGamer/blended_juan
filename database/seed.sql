USE blended_learning_analytics;

-- 1. Insertar Roles
INSERT INTO roles (id, nombre, descripcion) VALUES
  (1, 'Administrador', 'Control global del sistema y configuración analítica'),
  (2, 'Coordinador', 'Monitoreo preventivo por facultades e intervenciones'),
  (3, 'Docente', 'Seguimiento de estudiantes en sus cursos')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 2. Insertar Usuarios Administrativos (Contraseña por defecto: Admin123! - Bcrypt hash)
INSERT INTO usuarios (id, rol_id, nombre, email, password_hash, estado) VALUES
  (1, 1, 'Carlos Mendoza', 'admin@universidad.edu', '$2b$10$3YwZeqk2oFw7N8gNqN.65Oz1yS2v4a3bH9l7o9g6d0P1q2w3e4r5t', 'ACTIVO'),
  (2, 2, 'Dra. Elena Ramos', 'coordinacion@universidad.edu', '$2b$10$3YwZeqk2oFw7N8gNqN.65Oz1yS2v4a3bH9l7o9g6d0P1q2w3e4r5t', 'ACTIVO'),
  (3, 3, 'Prof. Roberto Silva', 'docente@universidad.edu', '$2b$10$3YwZeqk2oFw7N8gNqN.65Oz1yS2v4a3bH9l7o9g6d0P1q2w3e4r5t', 'ACTIVO')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- 3. Insertar Estudiantes (Muestra Blended Learning)
INSERT INTO estudiantes (id, codigo_estudiantil, nombre_completo, email, facultad, carrera, semestre_actual, modalidad, estado_matricula) VALUES
  (1, 'EST-2024-001', 'Ana María Gómez', 'ana.gomez@estudiante.edu', 'Ingeniería', 'Ingeniería de Sistemas', 3, 'Blended', 'En_Riesgo'),
  (2, 'EST-2024-002', 'Juan David Morales', 'juan.morales@estudiante.edu', 'Ingeniería', 'Ingeniería Industrial', 4, 'Blended', 'En_Riesgo'),
  (3, 'EST-2024-003', 'Valentina Castro', 'valentina.castro@estudiante.edu', 'Ciencias Económicas', 'Administración de Empresas', 2, 'Blended', 'Activo'),
  (4, 'EST-2024-004', 'Mateo Ramírez', 'mateo.ramirez@estudiante.edu', 'Ciencias de la Salud', 'Enfermería', 5, 'Blended', 'Activo'),
  (5, 'EST-2024-005', 'Camila Vargas', 'camila.vargas@estudiante.edu', 'Ingeniería', 'Ingeniería de Sistemas', 1, 'Blended', 'En_Riesgo'),
  (6, 'EST-2024-006', 'Santiago Herrera', 'santiago.herrera@estudiante.edu', 'Ciencias Económicas', 'Contaduría Pública', 3, 'Blended', 'Activo'),
  (7, 'EST-2024-007', 'Lucía Fernández', 'lucia.fernandez@estudiante.edu', 'Ciencias Humanas', 'Psicología', 4, 'Blended', 'Activo'),
  (8, 'EST-2024-008', 'Andrés Felipe Peña', 'andres.pena@estudiante.edu', 'Ingeniería', 'Ingeniería de Sistemas', 2, 'Blended', 'En_Riesgo')
ON DUPLICATE KEY UPDATE codigo_estudiantil=VALUES(codigo_estudiantil);

-- 4. Métricas Académicas (Periodo 2026-1)
INSERT INTO metricas_academicas (estudiante_id, periodo_academico, promedio_acumulado, promedio_periodo_anterior, materias_inscritas, materias_reprobadas, porcentaje_asistencia_presencial) VALUES
  (1, '2026-1', 2.80, 3.10, 5, 2, 65.00), -- Crítico: bajo promedio, 2 reprobadas, 65% asistencia
  (2, '2026-1', 3.35, 3.50, 6, 1, 72.00), -- Alerta media: 1 reprobada, asistencia 72%
  (3, '2026-1', 4.45, 4.30, 5, 0, 95.00), -- Bajo riesgo: excelente promedio y 95% asistencia
  (4, '2026-1', 4.10, 3.90, 6, 0, 88.00), -- Bajo riesgo
  (5, '2026-1', 2.50, NULL, 5, 3, 58.00), -- Crítico: semestre 1 con 3 materias en riesgo y 58% asistencia
  (6, '2026-1', 3.70, 3.65, 5, 0, 85.00), -- Bajo riesgo
  (7, '2026-1', 3.40, 3.55, 6, 1, 80.00), -- Medio riesgo
  (8, '2026-1', 2.95, 3.20, 5, 2, 70.00); -- Crítico: 2 reprobadas, 70% asistencia

-- 5. Métricas de LMS (Periodo 2026-1)
INSERT INTO metricas_lms (estudiante_id, periodo_academico, horas_conexion_semanal, accesos_plataforma_mes, porcentaje_entregas_a_tiempo, interacciones_foros, dias_ultimo_acceso) VALUES
  (1, '2026-1', 1.80, 12, 55.00, 1, 16), -- Crítico: 16 días inactivo, 55% entregas
  (2, '2026-1', 4.50, 34, 75.00, 3, 6),  -- Medio: 6 días inactivo, 75% entregas
  (3, '2026-1', 9.20, 78, 100.00, 12, 1), -- Excelente engagement
  (4, '2026-1', 7.50, 62, 92.00, 8, 2),  -- Buen engagement
  (5, '2026-1', 0.80, 6, 40.00, 0, 19),  -- Crítico: 19 días inactivo, casi nula interacción
  (6, '2026-1', 6.00, 48, 88.00, 5, 3),  -- Regular/Buen engagement
  (7, '2026-1', 5.10, 40, 70.00, 4, 8),  -- Medio: 8 días inactivo
  (8, '2026-1', 2.10, 16, 50.00, 1, 14); -- Crítico: 14 días inactivo, 50% entregas

-- 6. Predicciones y Scoring de Riesgo Precalculadas
INSERT INTO predicciones_riesgo (estudiante_id, periodo_academico, score_probabilidad, nivel_riesgo, factores_criticos, recomendaciones, version_algoritmo) VALUES
  (1, '2026-1', 0.7850, 'Alto', 
   JSON_ARRAY(
     JSON_OBJECT('dimension', 'LMS', 'factor', 'Desconexión severa de plataforma virtual (>14 días)', 'impacto', 'Crítico'),
     JSON_OBJECT('dimension', 'Académica', 'factor', 'Promedio acumulado deficiente (2.80/5.0)', 'impacto', 'Alto'),
     JSON_OBJECT('dimension', 'Presencial', 'factor', 'Asistencia presencial deficiente (65%)', 'impacto', 'Alto')
   ),
   JSON_ARRAY(
     'Programar sesión urgente con consejería de bienestar universitario',
     'Tutoría de refuerzo en asignaturas reprobadas'
   ),
   'v1.0-weighted'),
  
  (2, '2026-1', 0.4420, 'Medio',
   JSON_ARRAY(
     JSON_OBJECT('dimension', 'LMS', 'factor', 'Cumplimiento parcial de actividades virtuales (75%)', 'impacto', 'Medio'),
     JSON_OBJECT('dimension', 'Presencial', 'factor', 'Asistencia al límite de tolerancia reglamentaria (72%)', 'impacto', 'Medio')
   ),
   JSON_ARRAY('Notificación de alerta preventiva por inasistencia'),
   'v1.0-weighted'),

  (3, '2026-1', 0.0850, 'Bajo',
   JSON_ARRAY(),
   JSON_ARRAY('Continuar con el seguimiento regular'),
   'v1.0-weighted'),

  (4, '2026-1', 0.1450, 'Bajo',
   JSON_ARRAY(),
   JSON_ARRAY('Continuar con el seguimiento regular'),
   'v1.0-weighted'),

  (5, '2026-1', 0.8920, 'Alto',
   JSON_ARRAY(
     JSON_OBJECT('dimension', 'LMS', 'factor', 'Ausentismo digital crítico (19 días sin acceso)', 'impacto', 'Crítico'),
     JSON_OBJECT('dimension', 'Académica', 'factor', 'Promedio acumulado crítico (2.50/5.0) y 3 materias reprobadas', 'impacto', 'Crítico'),
     JSON_OBJECT('dimension', 'Presencial', 'factor', 'Inasistencia presencial severa (58%)', 'impacto', 'Crítico')
   ),
   JSON_ARRAY(
     'Activación inmediata de protocolo de intervención de primer semestre',
     'Contacto telefónico directo con acudiente/estudiante'
   ),
   'v1.0-weighted'),

  (6, '2026-1', 0.1820, 'Bajo',
   JSON_ARRAY(),
   JSON_ARRAY('Continuar con el seguimiento regular'),
   'v1.0-weighted'),

  (7, '2026-1', 0.3950, 'Medio',
   JSON_ARRAY(
     JSON_OBJECT('dimension', 'LMS', 'factor', 'Inactividad de 8 días en LMS', 'impacto', 'Medio'),
     JSON_OBJECT('dimension', 'LMS', 'factor', 'Entregas a tiempo al 70%', 'impacto', 'Medio')
   ),
   JSON_ARRAY('Enviar recordatorio automatizado de próximas entregas'),
   'v1.0-weighted'),

  (8, '2026-1', 0.7410, 'Alto',
   JSON_ARRAY(
     JSON_OBJECT('dimension', 'LMS', 'factor', 'Inactividad LMS de 14 días y 50% de entregas', 'impacto', 'Crítico'),
     JSON_OBJECT('dimension', 'Académica', 'factor', '2 asignaturas reprobadas y promedio < 3.0', 'impacto', 'Alto')
   ),
   JSON_ARRAY('Canalización con tutor par estudiantil'),
   'v1.0-weighted');
