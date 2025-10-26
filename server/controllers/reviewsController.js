import { db } from "../db.js";

export const reviewsController = {
  async createReview(req, res) {
    try {
      const { application_id, client_name, rating, comment } = req.body;
      const user_id = req.user.userId;

      if (!application_id || !client_name || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: "Все поля обязательны для заполнения",
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Рейтинг должен быть от 1 до 5 звезд",
        });
      }

      const [applications] = await db.execute(
        `
        SELECT id, status, user_id FROM applications WHERE id = ? AND user_id = ?`,
        [application_id, user_id]
      );

      if(applications.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Заявка не найдена"
        });
      }

      const application = applications[0]

      if(application.status !== "Выполнена") {
        return res.status(400).json({
            success: false,
            message: "Отзыв можно оставить только для выполненной заявки"
        });
      }

      const [existingReviews] = await db.execute(
        `SELECT id FROM reviews WHERE application_id = ?`,
        [application_id]
      )

      if(existingReviews.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Отзыв для этой заявки уже оставлен"
        });
      }

      const [result] = await db.execute(
        `INSERT INTO reviews (application_id, user_id, client_name, rating, comment) VALUES (?, ?, ?, ?, ?)`,
        [application_id, user_id, client_name, rating, comment]
      )

      res.status(201).json({
        success: true,
        message: "Отзыв успешно добавлен",
        data: {
            reviewId: result.insertId
        }
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Ошибка при создании отзыва",
      });
    }
  },
};
