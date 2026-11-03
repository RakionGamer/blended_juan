# Sistema de Detección Preventiva de Deserción Estudiantil (Learning Analytics)
## Modalidad: Blended Learning (Híbrido) — MVP Fase 1 (50% Alcance)

Este repositorio contiene la arquitectura completa y funcional del sistema web para el análisis de aprendizaje y la detección temprana del riesgo de deserción en educación superior, combinando variables presenciales (calificaciones, asistencia) y telemetría de interacción en plataformas LMS (Moodle / Canvas).

---

## 🏗️ Estructura del Proyecto

```
Juan B/
├── database/
│   ├── schema.sql           # DDL relacional optimizado (MySQL 8.0+)
│   └── seed.sql             # Datos semilla representativos para Blended Learning
├── backend/
│   ├── src/
│   │   ├── config/          # Pool MySQL (mysql2/promise) y variables de entorno
│   │   ├── middlewares/     # JWT y control de acceso por roles (RBAC)
│   │   ├── modules/
│   │   │   ├── auth/        # Login con JWT
│   │   │   ├── students/    # Directorio y perfil 360° de estudiantes
│   │   │   ├── metrics/     # Ingesta y normalización de métricas académicas/LMS
│   │   │   └── analytics/   # Motor de predicción y scoring explicable
│   │   ├── routes/          # Enrutador general /api/v1
│   │   ├── app.js           # Express App con CORS y Middlewares
│   │   └── server.js        # Punto de entrada HTTP
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/      # Navbar, StatCard, RiskBadge
    │   │   ├── charts/      # Recharts nativos (Donut, Barras, Tendencia)
    │   │   └── students/    # Filtros, Tabla interactiva y Modal Perfil 360°
    │   ├── pages/
    │   │   ├── DashboardView.jsx
    │   │   └── StudentsView.jsx
    │   ├── services/api.js  # Cliente de conexión con Backend y Auth
    │   ├── App.jsx
    │   └── main.jsx
    ├── vite.config.js       # Vite + Proxy a Backend + Tailwind
    └── package.json
```

---

## 🚀 Puesta en Marcha Rápida

### 1. Base de Datos (MySQL)
Ejecutar los scripts en tu cliente MySQL (Workbench, phpMyAdmin o CLI):
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend (Node.js & Express)
```bash
cd backend
npm install
npm run dev
```
- Servidor disponible en: `http://localhost:5050`
- Verificación de estado: `http://localhost:5050/api/v1/health`

### 3. Frontend (React 19 + Vite + Recharts)
```bash
cd frontend
npm install
npm run dev
```
- Dashboard disponible en: `http://localhost:3000`

---

## 🧠 Motor Analítico de Scoring (Learning Analytics)

El motor procesa tres dimensiones con penalizaciones por sinergia crítica:
- **Dimensión LMS (40%):** Días sin conexión a plataforma (crítico > 14 días), porcentaje de entregas a tiempo y participación en foros.
- **Dimensión Académica (35%):** Promedio acumulado (escala 0.0 a 5.0) y tasa de reprobación de asignaturas.
- **Dimensión Presencial (25%):** Porcentaje de asistencia física obligatoria (< 75% alerta institucional).

### Categorías de Riesgo:
- **Bajo:** Score $< 0.35$ (Verde)
- **Medio:** Score $0.35 \le \text{Score} < 0.65$ (Ámbar)
- **Alto:** Score $\ge 0.65$ (Rojo) — Se desglosan factores críticos explicables y rutas de acompañamiento sugeridas.

---

## 🔒 Credenciales de Prueba (Demo)
- **Email:** `admin@universidad.edu` | **Contraseña:** `admin123` (Rol: *Administrador*)
- **Email:** `coordinacion@universidad.edu` | **Contraseña:** `admin123` (Rol: *Coordinador*)
- **Email:** `docente@universidad.edu` | **Contraseña:** `admin123` (Rol: *Docente*)
