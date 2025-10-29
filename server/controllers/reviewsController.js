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
  async fetchUserReviews(req, res) {
    try {
      const userId = req.user ? (req.user.userId || req.user.id) : null
      const [reviews] = await db.query(
        `SELECT 
          r.id,
          r.application_id,
          r.client_name,
          r.rating,
          r.status,
          r.comment,
          r.created_at
        FROM reviews r
        JOIN applications a ON r.application_id = a.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
          `,
          [userId]
      )

      res.json({
        success: true,
        data: reviews
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Ошибка при получении отзывов"
      })
    }
  },
  async fetchAllReviews(req, res) {
    try{
      const [reviews] = await db.query(
        `SELECT
          r.id,
          r.application_id,
          r.user_id,
          r.client_name,
          r.rating,
          r.comment,
          r.status,
          r.created_at,
          r.updated_at,
          u.login as user_login
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN applications a ON r.application_id = a.id
        ORDER BY r.created_at DESC
        `
      )
      return res.json({
        success: true,
        data: reviews
      })
    }
    catch(error) {
      res.status(500).json({
        success: false,
        message: "Не удалось загрузить список отзывов"
      })
    }
  },
  async approveReview(req, res) {
    try {
      const {id} = req.params
      const [result] = await db.query(`
        UPDATE reviews SET status = "approved",
        updated_at = CURRENT_TIMESTAMP WHERE
        id = ?
        `, [id])
      if(result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Отзыв не найден"
        })
      }
      res.json({
        success: true,
        message: "Отзыв одобрен"
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Ошибка при одобрении отзыва"
      })
    }
  },
  async rejectReview(req, res) {
    try {
      const {id} = req.params
      const [result] = await db.query(`
        UPDATE reviews SET status = "rejected",
        updated_at = CURRENT_TIMESTAMP WHERE
        id = ?
        `, [id])

      if(result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Отзыв не найден"
        })
      }
      res.json({
        success: true,
        message: "Отзыв отклонен"
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Ошибка при отклонении отзыва"
      })
    }
  },
  async getApprovedReviews(req, res) {
    try {
      const [reviews] = await db.execute(
        `SELECT 
          r.id,
          r.client_name,
          r.rating,
          r.comment,
          r.created_at
        FROM reviews r
        WHERE r.status = "approved"
        ORDER BY r.created_at DESC
        `
      )
      res.json({
        success: true,
        data: reviews
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Ошибка при получении отзывов"
      })
    }
  }
};
