import {Router} from "express"
import { projectsController, upload } from "../controllers/projectsController.js";

export const projectsRouter = Router()

projectsRouter.post('/', upload.array('images', 10), projectsController.createProject);
projectsRouter.get('/', projectsController.getActiveProjects); // Для главной страницы
projectsRouter.get('/all', projectsController.getAllProjects); // Для админки