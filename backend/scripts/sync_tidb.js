import mysql from 'mysql2/promise';

async function syncLocalToTiDB() {
  const localConn = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'blended_learning_analytics'
  });

  const tiDbConn = await mysql.createConnection({
    host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
    port: 4000,
    user: '3h5gDcHsdzW2Pbr.root',
    password: 'kgE1PUK4nmFRrjcQ',
    database: 'blended_learning_analytics',
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  console.log('Sincronizando estudiantes...');
  const [localEst] = await localConn.query('SELECT * FROM estudiantes');
  for (const s of localEst) {
    await tiDbConn.execute(
      'INSERT INTO estudiantes (id, codigo_estudiantil, nombre_completo, email, carrera, facultad, semestre_actual, modalidad, estado_matricula) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE nombre_completo = VALUES(nombre_completo), carrera = VALUES(carrera), facultad = VALUES(facultad), semestre_actual = VALUES(semestre_actual), estado_matricula = VALUES(estado_matricula)',
      [s.id, s.codigo_estudiantil, s.nombre_completo, s.email, s.carrera, s.facultad, s.semestre_actual, s.modalidad, s.estado_matricula]
    );
  }

  console.log('Sincronizando metricas_academicas...');
  const [localAcad] = await localConn.query('SELECT * FROM metricas_academicas');
  for (const a of localAcad) {
    await tiDbConn.execute(
      'INSERT INTO metricas_academicas (estudiante_id, periodo_academico, promedio_acumulado, promedio_periodo_anterior, materias_inscritas, materias_reprobadas, porcentaje_asistencia_presencial) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE promedio_acumulado = VALUES(promedio_acumulado), materias_reprobadas = VALUES(materias_reprobadas), porcentaje_asistencia_presencial = VALUES(porcentaje_asistencia_presencial)',
      [a.estudiante_id, a.periodo_academico, a.promedio_acumulado, a.promedio_periodo_anterior, a.materias_inscritas, a.materias_reprobadas, a.porcentaje_asistencia_presencial]
    );
  }

  console.log('Sincronizando metricas_lms...');
  const [localLms] = await localConn.query('SELECT * FROM metricas_lms');
  for (const l of localLms) {
    await tiDbConn.execute(
      'INSERT INTO metricas_lms (estudiante_id, periodo_academico, horas_conexion_semanal, accesos_plataforma_mes, porcentaje_entregas_a_tiempo, interacciones_foros, dias_ultimo_acceso) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE horas_conexion_semanal = VALUES(horas_conexion_semanal), porcentaje_entregas_a_tiempo = VALUES(porcentaje_entregas_a_tiempo), dias_ultimo_acceso = VALUES(dias_ultimo_acceso)',
      [l.estudiante_id, l.periodo_academico, l.horas_conexion_semanal, l.accesos_plataforma_mes, l.porcentaje_entregas_a_tiempo, l.interacciones_foros, l.dias_ultimo_acceso]
    );
  }

  console.log('Sincronizando predicciones_riesgo...');
  const [localPred] = await localConn.query('SELECT * FROM predicciones_riesgo');
  for (const p of localPred) {
    await tiDbConn.execute(
      'INSERT INTO predicciones_riesgo (id, estudiante_id, periodo_academico, score_probabilidad, nivel_riesgo, factores_criticos, recomendaciones, version_algoritmo, fecha_calculo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE score_probabilidad = VALUES(score_probabilidad), nivel_riesgo = VALUES(nivel_riesgo), factores_criticos = VALUES(factores_criticos), recomendaciones = VALUES(recomendaciones), fecha_calculo = VALUES(fecha_calculo)',
      [
        p.id,
        p.estudiante_id,
        p.periodo_academico,
        p.score_probabilidad,
        p.nivel_riesgo,
        typeof p.factores_criticos === 'object' ? JSON.stringify(p.factores_criticos) : p.factores_criticos,
        typeof p.recomendaciones === 'object' ? JSON.stringify(p.recomendaciones) : p.recomendaciones,
        p.version_algoritmo || 'v1.0-weighted',
        p.fecha_calculo
      ]
    );
  }

  const [finalEst] = await tiDbConn.query('SELECT COUNT(*) as c FROM estudiantes');
  console.log('TOTAL_ESTUDIANTES_EN_TIDB:', finalEst[0].c);

  await localConn.end();
  await tiDbConn.end();
}

syncLocalToTiDB()
  .then(() => console.log('SINCRONIZACION_EXITOSA'))
  .catch(err => console.error('ERROR_SYNC:', err));
