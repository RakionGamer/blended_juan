-- =====================================================================
-- SISTEMA DE LEARNING ANALYTICS Y DETECCIÓN PREVENTIVA DE DESERCIÓN
-- MODALIDAD: BLENDED LEARNING (HÍBRIDO)
-- BASE DE DATOS: MySQL 8.0+
-- =====================================================================

CREATE DATABASE IF NOT EXISTS blended_learning_analytics
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE blended_learning_analytics;

-- 1. Tabla de Roles (RBAC)
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tabla de Usuarios del Sistema
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rol_id INT NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles (id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. Tabla de Estudiantes Universitarios
CREATE TABLE IF NOT EXISTS estudiantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NULL UNIQUE,
  codigo_estudiantil VARCHAR(30) NOT NULL UNIQUE,
  nombre_completo VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  facultad VARCHAR(100) NOT NULL,
  carrera VARCHAR(120) NOT NULL,
  semestre_actual INT NOT NULL,
  modalidad ENUM('Blended', 'Presencial', 'Virtual') DEFAULT 'Blended',
  estado_matricula ENUM('Activo', 'En_Riesgo', 'Retirado', 'Graduado') DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_estudiantes_usuarios FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL,
  INDEX idx_estudiantes_facultad (facultad),
  INDEX idx_estudiantes_carrera (carrera),
  INDEX idx_estudiantes_semestre (semestre_actual)
) ENGINE=InnoDB;

-- 4. Métricas Académicas y Presenciales
CREATE TABLE IF NOT EXISTS metricas_academicas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  periodo_academico VARCHAR(10) NOT NULL, -- Ej: '2026-1'
  promedio_acumulado DECIMAL(4,2) NOT NULL, -- Escala 0.00 a 5.00
  promedio_periodo_anterior DECIMAL(4,2) NULL,
  materias_inscritas INT NOT NULL DEFAULT 0,
  materias_reprobadas INT NOT NULL DEFAULT 0,
  porcentaje_asistencia_presencial DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_metricas_acad_estudiante FOREIGN KEY (estudiante_id) 
    REFERENCES estudiantes (id) ON DELETE CASCADE,
  INDEX idx_metricas_acad_lookup (estudiante_id, periodo_academico)
) ENGINE=InnoDB;

-- 5. Métricas de Interacción Digital / LMS
CREATE TABLE IF NOT EXISTS metricas_lms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  periodo_academico VARCHAR(10) NOT NULL,
  horas_conexion_semanal DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  accesos_plataforma_mes INT NOT NULL DEFAULT 0,
  porcentaje_entregas_a_tiempo DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  interacciones_foros INT NOT NULL DEFAULT 0,
  dias_ultimo_acceso INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_metricas_lms_estudiante FOREIGN KEY (estudiante_id) 
    REFERENCES estudiantes (id) ON DELETE CASCADE,
  INDEX idx_metricas_lms_lookup (estudiante_id, periodo_academico)
) ENGINE=InnoDB;

-- 6. Predicciones y Scoring de Riesgo de Deserción
CREATE TABLE IF NOT EXISTS predicciones_riesgo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  estudiante_id INT NOT NULL,
  periodo_academico VARCHAR(10) NOT NULL,
  score_probabilidad DECIMAL(5,4) NOT NULL, -- 0.0000 a 1.0000
  nivel_riesgo ENUM('Bajo', 'Medio', 'Alto') NOT NULL,
  factores_criticos JSON NOT NULL, -- Variables detonantes estructuradas
  recomendaciones JSON NULL,      -- Acciones de intervención sugeridas
  version_algoritmo VARCHAR(20) NOT NULL DEFAULT 'v1.0-weighted',
  fecha_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_predicciones_estudiante FOREIGN KEY (estudiante_id) 
    REFERENCES estudiantes (id) ON DELETE CASCADE,
  INDEX idx_predicciones_nivel_riesgo (nivel_riesgo),
  INDEX idx_predicciones_estudiante_fecha (estudiante_id, fecha_calculo DESC)
) ENGINE=InnoDB;
