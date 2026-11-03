import { MetricsService } from './metrics.service.js';
import { BatchImportService } from './import.service.js';

export class MetricsController {
  static async ingest(req, res, next) {
    try {
      const payload = req.body;
      if (!payload || (Array.isArray(payload) && payload.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'Cuerpo de la solicitud vacío o con formato inválido'
        });
      }

      const results = await MetricsService.ingestMetrics(payload);
      return res.status(201).json({
        success: true,
        message: 'Métricas ingeridas y procesadas por el motor analítico correctamente',
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Importación de archivos CSV o Excel (.xlsx, .xls)
   */
  static async importFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No se ha adjuntado ningún archivo. Seleccione un archivo CSV o Excel.'
        });
      }

      const originalname = req.file.originalname || 'importacion.csv';
      const fileBuffer = req.file.buffer;
      const periodo = req.body.periodo || '2026-1';

      const summary = await BatchImportService.processUploadedFile(fileBuffer, originalname, { periodo });

      return res.status(200).json({
        success: true,
        message: `Importación completada con éxito. Se procesaron ${summary.processed} registros en MySQL.`,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Descarga de plantilla CSV/Excel para coordinadores
   */
  static async downloadTemplate(req, res, next) {
    try {
      const type = req.query.type || 'consolidado';
      const format = req.query.format || 'xlsx';
      const mode = req.query.mode || 'empty'; // 'empty' o 'example'

      const fileData = BatchImportService.generateTemplate(type, format, mode);

      const prefix = mode === 'example' ? 'ejemplo_con_datos' : 'plantilla_para_rellenar';

      if (format === 'xlsx') {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${prefix}_${type}.xlsx"`);
        return res.send(fileData);
      } else {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${prefix}_${type}.csv"`);
        return res.send(fileData);
      }
    } catch (error) {
      next(error);
    }
  }
}
