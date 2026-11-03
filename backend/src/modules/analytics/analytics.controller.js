import { AnalyticsService } from './analytics.service.js';

export class AnalyticsController {
  static async getDashboard(req, res, next) {
    try {
      const data = await AnalyticsService.getDashboardMetrics();
      return res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async getModelPerformance(req, res, next) {
    try {
      const data = await AnalyticsService.getModelPerformanceMetrics();
      return res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  static async evaluate(req, res, next) {
    try {
      const { studentId } = req.params;
      const result = await AnalyticsService.evaluateStudent(studentId);
      return res.json({
        success: true,
        message: 'Re-evaluación analítica completada exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}
