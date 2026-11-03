import { AuthService } from './auth.service.js';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Debe ingresar email y contraseña'
        });
      }

      const result = await AuthService.login(email, password);
      return res.json({
        success: true,
        message: 'Autenticación exitosa',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res) {
    return res.json({
      success: true,
      data: req.user
    });
  }
}
