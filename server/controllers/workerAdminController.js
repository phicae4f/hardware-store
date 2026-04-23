import { generateTempPassword } from "../utils/generateTempPassword.js";
import bcrypt from "bcryptjs";
import { db } from "../db.js";

export const workerAdminController = {
  async createWorker(req, res) {
    try {
      const { name, email, phone, specialty, login } = req.body;

      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Недостаточно прав",
        });
      }

      if (!name || !email || !phone || !specialty || !login) {
        return res.status(400).json({
          success: false,
          message: "Заполните обязательные поля!",
        });
      }
      if (login.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Логин должен быть не менее 3 символов!",
        });
      }

      const tempPassword = generateTempPassword();
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(tempPassword, salt);

      const [result] = await db.execute(
        `
        INSERT INTO workers (name, email, login, phone, password_hash, specialty, requires_password_change) VALUES (?, ?, ?, ?, ?, ?, TRUE)
        `,
        [name, email, login, phone, passwordHashed, specialty || "Строитель"],
      );

      res.status(201).json({
        success: true,
        message: "Рабочий успешно создан",
        data: {
          id: result.insertId,
          name,
          email,
          login,
          tempPassword,
          phone,
          specialty: specialty || "Строитель",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Не удалось добавить нового рабочего",
      });
    }
  },
  async getAllWorkers(req, res) {
    try {
      const [workers] = await db.execute(
        `SELECT 
        w.id, 
        w.name, 
        w.login, 
        w.email, 
        w.phone, 
        w.specialty, 
        w.is_active,
        COUNT(a.id) as active_projects
      FROM workers w
      LEFT JOIN applications a ON w.id = a.worker_id AND a.status != 'Выполнена'
      WHERE w.is_active = true
      GROUP BY w.id
      ORDER BY w.name`,
      );

      res.json({
        success: true,
        data: workers,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Не удалось загрузить список рабочих",
      });
    }
  },
  async deactivateWorker(req, res) {
    try {
      const { id } = req.params;

      const [result] = await db.execute(
        `UPDATE workers SET is_active = false WHERE id = ?`,
        [id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Рабочий не найден",
        });
      }

      res.json({
        success: true,
        message: "Рабочий уволен",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Ошибка при увольнении рабочего",
      });
    }
  },
};
