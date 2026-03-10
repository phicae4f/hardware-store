import { generateTempPassword } from "../utils/generateTempPassword.js";
import bcrypt from "bcryptjs";
import { db } from "../db.js";

export const workerAdminController = {
  async createWorker(req, res) {
    try {
      const { name, email, phone, specialty, login } = req.body;

      if(req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Недостаточно прав"
        })
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
            specialty: specialty || "Строитель"
        }
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Не удалось добавить нового рабочего",
      });
    }
  },
};
