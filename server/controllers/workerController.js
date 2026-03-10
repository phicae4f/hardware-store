import { db } from "../db.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const workerAuthController = {
  async login(req, res) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        res.status(400).json({
          success: false,
          message: "Логин и пароль обязательны!",
        });
      }

      const [workers] = await db.execute(
        `SELECT * FROM workers WHERE (login = ? OR email = ?) AND is_active = TRUE`,
        [login, login],
      );

      if (workers.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Неверный логин или пароль!",
        });
      }

      const worker = workers[0];
      const isValid = await bcrypt.compare(password, worker.password_hash);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: "Неверный логин или пароль!",
        });
      }

      const token = jwt.sign(
        {
          workerId: worker.id,
          login: worker.login,
          name: worker.name,
          email: worker.email,
          role: "worker",
          requiresPasswordChange: worker.requires_password_change,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      const { password_hash, ...workerData } = worker;

      res.status(200).json({
        success: true,
        message: worker.requires_password_change
          ? "Требуется смена пароля"
          : "Вход выполнен успешно",
        token,
        worker: {
          ...workerData,
          role: "worker",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Ошибка авторизации рабочего",
      });
    }
  },
};
