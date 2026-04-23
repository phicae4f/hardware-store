import "dotenv/config";
import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userController = {
  async register(req, res) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res.status(400).json({
          success: false,
          message: "Логин и пароль обязательны",
        });
      }

      if (login.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Логин должен содержать минимум 3 символа",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Пароль должен содержать минимум 6 символов",
        });
      }

      const [existingUsers] = await db.execute(
        "SELECT id FROM users WHERE login = ?",
        [login],
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Пользователь с таким логином уже существует",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.execute(
        "INSERT INTO users (login, password_hash) VALUES (?, ?)",
        [login, hashedPassword],
      );

      const userId = result.insertId;

      const token = jwt.sign(
        {
          userId: userId,
          login: login,
          role: "user",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.status(201).json({
        success: true,
        message: "Пользователь успешно зарегистрирован",
        data: {
          user: {
            id: userId,
            login: login,
            role: "user",
          },
          token: token,
        },
      });
    } catch (error) {
      console.log("Register Error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка сервера при регистрации",
      });
    }
  },

  async login(req, res) {
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        return res.status(400).json({
          success: false,
          message: "Логин или пароль обязательны",
        });
      }
      const [users] = await db.execute("SELECT * FROM users WHERE login = ?", [
        login,
      ]);

      if (users.length > 0) {
        const user = users[0];
        const isValidPassword = await bcrypt.compare(
          password,
          user.password_hash,
        );

        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: "Неверный логин или пароль",
          });
        }
        const token = jwt.sign(
          {
            userId: user.id,
            login: user.login,
            role: user.role,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
        );
        return res.json({
          success: true,
          message: "Успешная авторизация",
          data: {
            user: {
              id: user.id,
              login: user.login,
              role: user.role,
            },
            token: token,
          },
        });
      }

      const [workers] = await db.execute(
        `SELECT * FROM workers WHERE (login = ? OR email = ?) AND is_active = TRUE`,
        [login, login],
      );

      if (workers.length > 0) {
        const worker = workers[0];
        const isValidPassword = await bcrypt.compare(
          password,
          worker.password_hash,
        );

        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            message: "Неверный логин или пароль",
          });
        }

        const token = jwt.sign(
          {
            workerId: worker.id,
            login: worker.login,
            email: worker.email,
            name: worker.name,
            role: "worker",
            requiresPasswordChange: worker.requires_password_change,
          },
          process.env.JWT_SECRET,
          { expiresIn: "24h" },
        );

        const { password_hash, ...workerData } = worker;

        return res.json({
          success: true,
          message: worker.requires_password_change
            ? "Требуется смена пароля"
            : "Успешная авторизация",
          data: {
            user: {
              ...workerData,
              role: "worker",
            },
            token,
          },
        });
      }

      return res.status(401).json({
        success: false,
        message: "Неверный логин или пароль!",
      });
    } catch (error) {
      console.log("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка авторизации",
      });
    }
  },

  async changeWorkerPassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!req.user || req.user.role !== "worker") {
        return res.status(403).json({
          success: false,
          message: "Доступ только для рабочих",
        });
      }

      const workerId = req.user.workerId;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Старый и новые пароли обязательны",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Новый пароль должен содержать минимум 6 символов",
        });
      }

      const [workers] = await db.execute(
        `SELECT password_hash FROM workers WHERE id = ? AND is_active = true`,
        [workerId],
      );

      if (workers.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Рабочий не найден",
        });
      }

      const isValid = await bcrypt.compare(
        oldPassword,
        workers[0].password_hash,
      );
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: "Неверный старый пароль",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await db.execute(
        `UPDATE workers SET password_hash = ?, requires_password_change = false WHERE id = ?`,
        [hashedPassword, workerId],
      );

      const [updatedWorker] = await db.execute(
        `SELECT id, login, name, email, specialty, requires_password_change FROM workers WHERE id = ?`,
        [workerId],
      );
      const worker = updatedWorker[0];

      const newToken = jwt.sign(
        {
          workerId: worker.id,
          login: worker.login,
          name: worker.name,
          email: worker.email,
          role: "worker",
          requiresPasswordChange: false,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );
      res.json({
        success: true,
        message: "Пароль успешно изменен",
        token: newToken,
        user: {
          id: worker.id,
          login: worker.login,
          name: worker.name,
          email: worker.email,
          role: "worker",
          requires_password_change: false,
        },
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка при смене пароля",
      });
    }
  },
};
