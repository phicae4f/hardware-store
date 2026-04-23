import { db } from "../db.js";

export const applicationController = {
  async createApplication(req, res) {
    try {
      const { client_name, phone, email, note_message, service_type } =
        req.body;

      if (!client_name || !phone || !service_type) {
        return res.status(400).json({
          success: false,
          message: "Имя, телефон и тип услуги обязательны",
        });
      }

      const validServiceTypes = [
        "Ремонт квартиры",
        "Ремонт дома",
        "Ремонт офиса",
        "Строительство дома",
        "Строительство бани",
        "Строительство гаража",
        "Дизайн интерьера",
        "Консультация",
        "Другое",
      ];

      if (!validServiceTypes.includes(service_type)) {
        return res.status(400).json({
          success: false,
          message: "Неверный тип услуги",
        });
      }
      const userId = req.user ? req.user.userId || req.user.id : null;

      const [result] = await db.execute(
        `
                INSERT INTO applications (user_id, client_name, phone, email, note_message, service_type)
                VALUES (?, ?, ?, ?, ?, ?)
                `,
        [userId, client_name, phone, email, note_message, service_type],
      );

      res.status(201).json({
        success: true,
        message:
          "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
        data: {
          applicationId: result.insertId,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Ошибка при отправке заявки",
      });
    }
  },

  async getUserApplications(req, res) {
    try {
      const userId = req.user ? req.user.userId || req.user.id : null;
      const [applications] = await db.execute(
        `
                SELECT
                    a.id,
                    a.client_name,
                    a.phone,
                    a.email,
                    a.note_message,
                    a.service_type,
                    a.status,
                    a.created_at,
                    a.updated_at,
                    u.login as user_login
                FROM applications a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE a.user_id = ?
                ORDER BY a.created_at DESC
                `,
        [userId],
      );

      res.json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Ошибка просмотра заявок",
      });
    }
  },

  async getAllApplications(req, res) {
    try {
      const [applications] = await db.execute(`
      SELECT
        a.id,
        a.client_name,
        a.phone,
        a.email,
        a.note_message,
        a.service_type,
        a.status,
        a.admin_notes,
        a.worker_id, 
        a.created_at,
        a.updated_at,
        u.login as user_login,
        u.id as user_id
      FROM applications a
      LEFT JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
    `);

      res.json({
        success: true,
        data: applications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Не удалось загрузить заявки",
      });
    }
  },
  async updateApplication(req, res) {
    try {
      const { id } = req.params;
      const { status, admin_notes } = req.body;

      const validStatuses = ["Новая", "В работе", "Выполнена"];

      if (status && !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Неверный статус",
        });
      }

      const updateFields = [];
      const updateValues = [];

      if (status) {
        updateFields.push("status = ?");
        updateValues.push(status);
      }

      if (admin_notes !== undefined) {
        updateFields.push("admin_notes = ?");
        updateValues.push(admin_notes);
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP");
      updateValues.push(id);

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Нет данных для обновления",
        });
      }

      const [result] = await db.execute(
        `
                UPDATE applications SET ${updateFields.join(", ")} WHERE id = ?
                `,
        updateValues,
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Заявка не найдена",
        });
      }

      res.json({
        success: true,
        message: "Заявка обновлена",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Ошибка обновления заявки",
      });
    }
  },
  async getWorkerApplications(req, res) {
    try {
      const workerId = req.user.workerId;
      console.log("Fetching applications for worker:", workerId); // Лог

      const [applications] = await db.execute(
        `
      SELECT 
        a.id,
        a.client_name,
        a.phone,
        a.email,
        a.note_message,
        a.service_type,
        a.status,
        a.admin_notes,
        a.created_at,
        a.updated_at
      FROM applications a
      WHERE a.worker_id = ?
      ORDER BY 
        CASE a.status 
          WHEN 'В работе' THEN 1
          WHEN 'Новая' THEN 2
          WHEN 'Выполнена' THEN 3
        END,
        a.updated_at DESC
      `,
        [workerId],
      );

      console.log("Found applications:", applications.length); // Лог

      res.json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Не удалось загрузить заявки",
      });
    }
  },
  async assignWorker(req, res) {
    try {
      const { id } = req.params;
      const { worker_id } = req.body;

      console.log("Assign worker:", { id, worker_id });

      if (!worker_id) {
        return res.status(400).json({
          success: false,
          message: "Выберите рабочего",
        });
      }

      const [result] = await db.execute(
        `UPDATE applications SET worker_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [worker_id, id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Заявка не найдена",
        });
      }

      // Проверяем, есть ли уже этапы для этой заявки
      const [existingStages] = await db.execute(
        `SELECT id FROM project_stages WHERE application_id = ? LIMIT 1`,
        [id],
      );

      // Если этапов нет - создаём
      if (existingStages.length === 0) {
        const defaultStages = [
          {
            title: "Проектирование",
            description: "Разработка плана и сметы",
            order_index: 1,
          },
          {
            title: "Подготовка материалов",
            description: "Закупка и доставка материалов",
            order_index: 2,
          },
          {
            title: "Выполнение работ",
            description: "Основные строительные работы",
            order_index: 3,
          },
          {
            title: "Проверка и сдача",
            description: "Контроль качества и сдача объекта",
            order_index: 4,
          },
        ];

        for (const stage of defaultStages) {
          await db.execute(
            `INSERT INTO project_stages (application_id, title, description, status, percentage, order_index) 
           VALUES (?, ?, ?, 'pending', 0, ?)`,
            [id, stage.title, stage.description, stage.order_index],
          );
        }
        console.log(`Created 4 stages for application ${id}`);
      }

      res.json({
        success: true,
        message: "Рабочий успешно назначен на заявку",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Ошибка назначения рабочего",
      });
    }
  },
  async getProjectStages(req, res) {
    try {
      const { id } = req.params; // application_id
      const workerId = req.user.workerId;

      const [stages] = await db.execute(
        `
      SELECT 
        ps.*,
        GROUP_CONCAT(
          JSON_OBJECT('id', sc.id, 'comment', sc.comment, 'worker_id', sc.worker_id, 'created_at', sc.created_at)
        ) as comments
      FROM project_stages ps
      LEFT JOIN stage_comments sc ON ps.id = sc.stage_id
      WHERE ps.application_id = ?
      GROUP BY ps.id
      ORDER BY ps.order_index ASC
      `,
        [id],
      );

      // Парсим комментарии из JSON строки
      const stagesWithComments = stages.map((stage) => ({
        ...stage,
        comments: stage.comments ? JSON.parse(`[${stage.comments}]`) : [],
      }));

      res.json({
        success: true,
        data: stagesWithComments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Не удалось загрузить этапы проекта",
      });
    }
  },

  async updateStage(req, res) {
    try {
      const { stageId } = req.params;
      const { status, percentage, comment } = req.body;
      const workerId = req.user.workerId;

      await db.execute(
        `UPDATE project_stages SET status = ?, percentage = ? WHERE id = ?`,
        [status, percentage, stageId],
      );

      if (comment) {
        await db.execute(
          `INSERT INTO stage_comments (stage_id, worker_id, comment) VALUES (?, ?, ?)`,
          [stageId, workerId, comment],
        );
      }

      const [stageData] = await db.execute(
        `SELECT application_id FROM project_stages WHERE id = ?`,
        [stageId],
      );
      const applicationId = stageData[0].application_id;

      const [allStages] = await db.execute(
        `SELECT status, percentage FROM project_stages WHERE application_id = ?`,
        [applicationId],
      );

      const allCompleted = allStages.every(
        (stage) => stage.status === "completed" && stage.percentage === 100,
      );

      if (allCompleted) {
        await db.execute(
          `UPDATE applications SET status = 'Выполнена', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [applicationId],
        );

        console.log(`✅ Заявка ${applicationId} автоматически завершена`);
      }

      res.json({
        success: true,
        message: "Этап обновлен",
        allCompleted,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Ошибка обновления этапа",
      });
    }
  },
  async getDashboardStats(req, res) {
    try {
      // Статистика по заявкам
      const [applicationsStats] = await db.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'Новая' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN status = 'В работе' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'Выполнена' THEN 1 ELSE 0 END) as completed
      FROM applications
    `);

      // Количество рабочих
      const [workersCount] = await db.execute(`
      SELECT COUNT(*) as total FROM workers WHERE is_active = true
    `);

      // Отзывы на модерации
      const [reviewsPending] = await db.execute(`
      SELECT COUNT(*) as pending FROM reviews WHERE status = 'pending'
    `);

      res.json({
        success: true,
        data: {
          applications: applicationsStats[0],
          workers: workersCount[0].total,
          pendingReviews: reviewsPending[0].pending,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Не удалось загрузить статистику",
      });
    }
  },
};
