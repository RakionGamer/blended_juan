import { StudentsService } from './students.service.js';

export class StudentsController {
  static async list(req, res, next) {
    try {
      const { riesgo, facultad, search, page, limit } = req.query;
      const result = await StudentsService.list({ riesgo, facultad, search, page, limit });
      return res.json({
        success: true,
        data: result.data,
        meta: {
          total: result.total,
          page: result.page
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await StudentsService.getById(id);
      return res.json({
        success: true,
        data: student
      });
    } catch (error) {
      next(error);
    }
  }
}
