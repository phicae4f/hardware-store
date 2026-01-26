import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const workerController = {
  async register(req, res) {
    try {
      const { email, password, name, phone, specialty } = req.body;

      if (!email || !password || !name || !phone || !specialty) {
        return res.status(400).json({
          success: false,
          message: "Заполните обязательные поля!",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Пароль должен содержать минимум 6 символов",
        });
      }

      const [existingWorkers] = await db.execute(
        `SELECT id FROM workers WHERE email = ?`,
        [email],
      );

      if (existingWorkers.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Аккаунт уже существует",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.execute(
        `INSERT INTO workers (email, password_hash, name, phone, specialty) VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, name, phone, specialty || "Строитель"],
      );

      const workerId = result.insertId;

      const token = jwt.sign(
        {
          workerId: workerId,
          email: email,
          name: name,
          specialty: specialty || "Строитель",
          role: "worker",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      res.status(201).json({
        success: true,
        message: "Вы успешно зарегистрированы!",
        data: {
          worker: {
            id: workerId,
            email: email,
            name: name,
            phone: phone,
            specialty: specialty || "Строитель",
            role: "worker",
          },
          token: token,
        },
      });
    } catch (error) {
      console.log("Register error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка регистрации",
      });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Заполните обязательные поля!",
        });
      }
      const [workers] = await db.execute(
        `SELECT * FROM workers WHERE email = ? AND is_active = TRUE`,
        [email],
      );
      if (workers.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Неверный логин или пароль",
        });
      }

      const worker = workers[0];
      const isValidPassword = await bcrypt.compare(
        password,
        worker.password_hash,
      );

      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "Неверный логин или пароль",
        });
      }

      const token = jwt.sign(
        {
          workerId: worker.id,
          name: worker.name,
          phone: worker.phone,
          email: worker.email,
          specialty: worker.specialty || "Строитель",
          role: "worker",
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      const { password_hash, ...workerData } = worker;

      res.status(200).json({
        success: true,
        message: "Вы вошли в аккаунт!",
        data: {
          worker: {
            id: workerData.id,
            name: workerData.name,
            phone: workerData.phone,
            email: workerData.email,
            specialty: workerData.specialty || "Строитель",
            role: "worker",
          },
          token: token,
        },
      });
    } catch (error) {
      console.log("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Не удалось войти в аккаунт",
      });
    }
  },
};
