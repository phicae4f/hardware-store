import multer from "multer";
import fs from "fs";
import path from "path";
import { db } from "../db.js";

//создание папки для загрузок, если ее нет
const uploadDir = "uploads/projects/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "project-" + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export const projectsController = {
  async createProject(req, res) {
    try {
      const { title, description } = req.body;
      const images = req.files;

      if (!images || images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Загрузите хотя бы одно изображение",
        });
      }
      const [projectResult] = await db.execute(
        `
                INSERT into projects (title, description) VALUES (?, ?)
                `,
        [title, description]
      );

      const projectId = projectResult.insertId;
      const imageValues = images.map((image, index) => [
        projectId,
        image.filename,
        index,
      ]);

      await db.execute(
       `INSERT INTO project_images (project_id, image_url, image_order) VALUES ?`,
        [imageValues]
      );

      res.status(201).json({
        success: true,
        projectId: projectId,
      });
    } catch (error) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(file.path);
        });
      }
      res.status(500).json({
        success: false,
        message: "Ошибка при создании проекта",
      });
    }
  },
  async getActiveProjects(req, res) {
    try {
      const [projects] = await db.execute(
        `SELECT p.id, p.title, p.description, p.created_at,
                        pi.id as image_id, pi.image_url, pi.image_order
                 FROM projects p
                 LEFT JOIN project_images pi ON p.id = pi.project_id
                 WHERE p.status = 'active'
                 ORDER BY p.created_at DESC, pi.image_order ASC`
      );

      // Группируем изображения по проектам
      const projectsWithImages = projects.reduce((acc, row) => {
        const projectId = row.id;

        if (!acc[projectId]) {
          acc[projectId] = {
            id: row.id,
            title: row.title,
            description: row.description,
            created_at: row.created_at,
            images: [],
          };
        }

        if (row.image_url) {
          acc[projectId].images.push({
            id: row.image_id,
            url: row.image_url,
            order: row.image_order,
          });
        }

        return acc;
      }, {});

      res.json(Object.values(projectsWithImages));
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Ошибка при получении проектов",
      });
    }
  },
  async getAllProjects(req, res) {
        try {
            // Получаем ВСЕ проекты (для админки)
            const [projects] = await db.execute(
                `SELECT p.id, p.title, p.description, p.status, p.created_at,
                        pi.id as image_id, pi.image_url, pi.image_order
                 FROM projects p
                 LEFT JOIN project_images pi ON p.id = pi.project_id
                 ORDER BY p.created_at DESC, pi.image_order ASC`
            );

            const projectsWithImages = projects.reduce((acc, row) => {
                const projectId = row.id;
                
                if (!acc[projectId]) {
                    acc[projectId] = {
                        id: row.id,
                        title: row.title,
                        description: row.description,
                        status: row.status,
                        created_at: row.created_at,
                        images: []
                    };
                }

                if (row.image_url) {
                    acc[projectId].images.push({
                        id: row.image_id,
                        url: row.image_url,
                        order: row.image_order
                    });
                }

                return acc;
            }, {});

            res.json(Object.values(projectsWithImages));

        } catch (error) {
            console.error("Error fetching all projects:", error);
            res.status(500).json({ error: "Ошибка при получении проектов" });
        }
    }

};
