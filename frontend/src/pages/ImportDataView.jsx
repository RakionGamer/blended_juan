import React, { useState, useRef } from 'react';
import { 
  UploadCloud, FileSpreadsheet, Download, CheckCircle2, 
  AlertTriangle, ArrowRight, RefreshCw, FileText, 
  Layers, Check, HelpCircle, Database, CheckCheck, Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card.jsx';
import { Button } from '../components/ui/button.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table.jsx';
import { uploadMetricsFile, downloadImportTemplate } from '../services/api.js';
import { toast } from 'sonner';

export default function ImportDataView({ onImportSuccess, onNavigateToStudents, onNavigateToDashboard }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [periodo, setPeriodo] = useState('2026-1');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      toast.error('Formato no soportado', {
        description: 'Por favor suba un archivo en formato Excel (.xlsx, .xls) o CSV.'
      });
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    toast.success('Archivo preparado', {
      description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    });
  };

  const handleProcessImport = async () => {
    if (!selectedFile) {
      toast.error('Archivo requerido', {
        description: 'Arrastre o seleccione un archivo antes de continuar.'
      });
      return;
    }

    try {
      setIsProcessing(true);
      const result = await uploadMetricsFile(selectedFile, periodo);
      setImportResult(result);
      
      toast.success('Importación completada en MySQL', {
        description: `Se procesaron ${result.processed} filas: datos académicos, telemetría LMS y scoring predictivo calculados.`
      });

      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      toast.error('Error en la importación', {
        description: err.message || 'No se pudo procesar el archivo en el servidor.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = async (format = 'xlsx', mode = 'empty') => {
    try {
      setIsDownloading(true);
      await downloadImportTemplate('consolidado', format, mode);
      toast.success(
        mode === 'empty' ? 'Plantilla oficial descargada' : 'Ejemplo de referencia descargado',
        {
          description: mode === 'empty' 
            ? 'Archivo consolidado listo para rellenar en Excel (.xlsx).'
            : 'Archivo con datos de muestra descargado (.xlsx).'
        }
      );
    } catch (err) {
      toast.error('Error al descargar plantilla', {
        description: err.message
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* 1. Encabezado del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Ingestión por Lotes de Datos
            </h1>
            <Badge variant="outline" className="bg-zinc-100 text-zinc-900 border-zinc-300 text-xs font-semibold">
              <Database className="w-3 h-3 mr-1 text-primary" /> MySQL 8.0 Real
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            Importación integral y desacoplada de expedientes, notas académicas y telemetría de Moodle/Canvas.
          </p>
        </div>

        {/* Botones de Descarga de Plantillas */}
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => handleDownloadTemplate('xlsx', 'empty')}
            disabled={isDownloading}
            className="cursor-pointer font-medium bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-xs group"
          >
            <Download className="w-4 h-4 mr-1.5 group-hover:translate-y-0.5 transition-transform duration-200" />
            Descargar Plantilla Oficial (.xlsx)
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDownloadTemplate('xlsx', 'example')}
            disabled={isDownloading}
            className="cursor-pointer font-medium border-zinc-300 text-zinc-800 hover:bg-zinc-50 shadow-xs group"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 text-emerald-600 group-hover:scale-115 transition-transform duration-200" />
            Descargar Ejemplo con Datos (.xlsx)
          </Button>
        </div>
      </div>

      {/* 2. Guía Visual Paso a Paso (Alto Contraste y Tipografía Limpia) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Paso 1 */}
        <Card className="border-zinc-200 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-zinc-50 text-xs font-mono font-bold shrink-0">
                1
              </span>
              <p className="text-sm font-semibold text-zinc-950">Descarga la Plantilla</p>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Obtén el archivo Excel (<span className="font-mono font-semibold text-zinc-900">.xlsx</span>). Incluye las 18 columnas oficiales ya configuradas para importar todo de una vez.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadTemplate('xlsx', 'empty')}
              disabled={isDownloading}
              className="w-full text-xs cursor-pointer font-medium border-zinc-200 hover:bg-zinc-100/80 text-zinc-900"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Obtener Plantilla (.xlsx)
            </Button>
          </CardContent>
        </Card>

        {/* Paso 2 */}
        <Card className="border-zinc-200 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-zinc-50 text-xs font-mono font-bold shrink-0">
                2
              </span>
              <p className="text-sm font-semibold text-zinc-950">Rellena los Datos</p>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Abre el archivo en Excel. Escribe los códigos, nombres, calificaciones (0.00 a 5.00), asistencia presencial y horas de plataforma LMS.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadTemplate('xlsx', 'example')}
              disabled={isDownloading}
              className="w-full text-xs cursor-pointer font-medium border-zinc-200 hover:bg-zinc-100/80 text-zinc-900"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Ver Ejemplo Relleno (.xlsx)
            </Button>
          </CardContent>
        </Card>

        {/* Paso 3 */}
        <Card className="border-zinc-200 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-900 text-zinc-50 text-xs font-mono font-bold shrink-0">
                3
              </span>
              <p className="text-sm font-semibold text-zinc-950">Sube y Evalúa</p>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Arrastra el archivo guardado. El motor inserta los expedientes en MySQL y calcula las probabilidades de deserción de inmediato.
            </p>
            {/* Badge de Alto Contraste 100% Legible */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cálculo automático de riesgo en MySQL</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Panel de Ingesta Integral (Unificado - Importa Todo de Una Sola Vez) */}
      <Card className="border-zinc-200 bg-white shadow-2xs">
        <CardHeader className="pb-4 border-b border-zinc-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold text-zinc-950">
                  Ingesta Integral Consolidada (Expediente + Notas + Telemetría LMS)
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider bg-zinc-100 text-zinc-800 border-zinc-200">
                  Todo en Uno
                </Badge>
              </div>
              <CardDescription className="text-xs text-zinc-500 mt-1">
                El archivo consolidado procesa simultáneamente los expedientes, calificaciones académicas y registros de Moodle/Canvas en una sola operación transaccional.
              </CardDescription>
            </div>

            {/* Selector de Periodo */}
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1.5 rounded-md border border-zinc-200 shrink-0">
              <span className="text-xs text-zinc-600 font-medium">Periodo:</span>
              <select 
                value={periodo} 
                onChange={(e) => setPeriodo(e.target.value)}
                className="bg-transparent text-xs font-semibold text-zinc-900 focus:outline-none cursor-pointer"
              >
                <option value="2026-1">2026-1 (Actual)</option>
                <option value="2025-2">2025-2</option>
                <option value="2025-1">2025-1</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-5">
          {/* Zona Drag & Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragging 
                ? 'border-zinc-900 bg-zinc-50' 
                : selectedFile 
                  ? 'border-emerald-600 bg-emerald-50/30' 
                  : 'border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`p-3.5 rounded-full ${
                selectedFile 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-zinc-100 text-zinc-700'
              }`}>
                {selectedFile ? (
                  <CheckCheck className="w-8 h-8" />
                ) : (
                  <UploadCloud className="w-8 h-8" />
                )}
              </div>

              <div>
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-950 font-mono">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Archivo consolidado listo para sincronizar en MySQL
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      Arrastra tu archivo Excel (<span className="font-mono">.xlsx</span>) aquí
                    </p>
                    <p className="text-xs text-zinc-500">
                      o haz clic para explorar en tu equipo (Tamaño máx: 20 MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de Procesamiento y Acciones */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReset}
                disabled={!selectedFile || isProcessing}
                className="text-xs text-zinc-600 hover:text-zinc-950 cursor-pointer"
              >
                Limpiar selección
              </Button>

              {selectedFile && (
                <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Listo para procesar
                </span>
              )}
            </div>

            <Button 
              size="default" 
              onClick={handleProcessImport}
              disabled={!selectedFile || isProcessing}
              className="w-full sm:w-auto cursor-pointer font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Procesando e insertando en MySQL...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2 text-emerald-400" />
                  Procesar e Ingerir a Base de Datos
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 4. Resumen del Resultado de la Ingestión (Si se ejecutó una carga) */}
      {importResult && (
        <Card className="border-emerald-300 bg-emerald-50/20 shadow-sm">
          <CardHeader className="pb-3 border-b border-emerald-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-zinc-950">
                    Resultado de la Ingesta Masiva Exitosa
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-600">
                    Archivo procesado: <span className="font-mono font-semibold text-zinc-900">{importResult.filename}</span>
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onNavigateToStudents}
                  className="text-xs cursor-pointer font-medium bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50"
                >
                  Ver Estudiantes <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button 
                  size="sm" 
                  onClick={onNavigateToDashboard}
                  className="text-xs cursor-pointer font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800"
                >
                  Ir al Dashboard
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Tarjetas KPI del Lote Procesado */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                <p className="text-[11px] text-zinc-500 uppercase font-semibold">Filas Procesadas</p>
                <p className="text-2xl font-bold mt-1 text-zinc-950 font-mono">{importResult.processed}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">de {importResult.totalRows} en archivo</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                <p className="text-[11px] text-zinc-500 uppercase font-semibold">Estudiantes Registrados</p>
                <p className="text-2xl font-bold mt-1 text-zinc-950 font-mono">{importResult.insertedStudents}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">+{importResult.updatedStudents} actualizados</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                <p className="text-[11px] text-zinc-500 uppercase font-semibold">Métricas Ingeridas</p>
                <p className="text-2xl font-bold mt-1 text-zinc-950 font-mono">{importResult.predictionsCount}</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Scoring en tiempo real</p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 shadow-2xs">
                <p className="text-[11px] text-zinc-500 uppercase font-semibold">Desglose de Riesgo</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                    Alto: {importResult.riskCounts?.Alto || 0}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                    Medio: {importResult.riskCounts?.Medio || 0}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Bajo: {importResult.riskCounts?.Bajo || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Advertencias de Fila si Existen */}
            {importResult.errors && importResult.errors.length > 0 && (
              <div className="border border-amber-300 rounded-lg p-3 bg-amber-50">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <p className="text-xs font-semibold text-amber-900">
                    Advertencias durante la lectura ({importResult.errors.length})
                  </p>
                </div>
                <div className="max-h-36 overflow-y-auto space-y-1 text-[11px] text-amber-800 font-mono">
                  {importResult.errors.map((err, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-amber-900 font-semibold">Fila {err.row}:</span>
                      <span>{err.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 5. Guía de Mapeo de Columnas del Archivo Consolidado */}
      <Card className="border-zinc-200 bg-white shadow-2xs">
        <CardHeader className="pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-zinc-700" />
            <CardTitle className="text-sm font-semibold text-zinc-950">
              Guía de Columnas Oficiales (Reporte Consolidado)
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-zinc-500">
            El procesador normaliza automáticamente mayúsculas, tildes y nombres de columnas alternativos comunes de Moodle, Canvas y Control de Notas.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 border-b border-zinc-200">
                  <TableHead className="text-xs font-semibold text-zinc-900">Columna Oficial</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-900">Encabezados Reconocidos (Alias)</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-900">Tipo de Dato</TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-900">Ejemplo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs font-mono">
                <TableRow className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <TableCell className="font-semibold text-zinc-950">codigo_estudiantil</TableCell>
                  <TableCell className="text-zinc-600">codigo, cod_estudiante, estudiante_id, documento, matricula</TableCell>
                  <TableCell className="text-zinc-900 font-sans">Texto (Obligatorio)</TableCell>
                  <TableCell className="font-semibold text-zinc-950">EST-2026-101</TableCell>
                </TableRow>
                <TableRow className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <TableCell className="font-semibold text-zinc-950">promedio_acumulado</TableCell>
                  <TableCell className="text-zinc-600">promedio, nota_promedio, gpa, calificacion_media</TableCell>
                  <TableCell className="text-zinc-900 font-sans">Decimal (0.00 a 5.00)</TableCell>
                  <TableCell className="font-semibold text-zinc-950">3.85</TableCell>
                </TableRow>
                <TableRow className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <TableCell className="font-semibold text-zinc-950">porcentaje_asistencia_presencial</TableCell>
                  <TableCell className="text-zinc-600">asistencia, asistencia_presencial, asistencia_pct</TableCell>
                  <TableCell className="text-zinc-900 font-sans">Decimal (0 a 100)</TableCell>
                  <TableCell className="font-semibold text-zinc-950">88.5%</TableCell>
                </TableRow>
                <TableRow className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <TableCell className="font-semibold text-zinc-950">horas_conexion_semanal</TableCell>
                  <TableCell className="text-zinc-600">horas_conexion, horas_lms, tiempo_conexion</TableCell>
                  <TableCell className="text-zinc-900 font-sans">Decimal (horas/sem)</TableCell>
                  <TableCell className="font-semibold text-zinc-950">8.5 h</TableCell>
                </TableRow>
                <TableRow className="border-b border-zinc-100 hover:bg-zinc-50/50">
                  <TableCell className="font-semibold text-zinc-950">porcentaje_entregas_a_tiempo</TableCell>
                  <TableCell className="text-zinc-600">entregas_a_tiempo, tareas_entregadas, entregas_pct</TableCell>
                  <TableCell className="text-zinc-900 font-sans">Decimal (0 a 100)</TableCell>
                  <TableCell className="font-semibold text-zinc-950">92.0%</TableCell>
                </TableRow>
                <TableRow className="hover:bg-zinc-50/50">
                  <TableCell className="font-semibold text-zinc-950">dias_ultimo_acceso</TableCell>
                  <TableCell className="text-zinc-600">dias_inactivo, ultimo_acceso_dias, dias_sin_conexion</TableCell>
                  <TableCell className="text-zinc-900 font-sans">Entero (días de inactividad)</TableCell>
                  <TableCell className="font-semibold text-zinc-950">2 días</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
