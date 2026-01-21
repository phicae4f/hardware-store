import "dotenv/config";
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export async function createTables() {
  try {
    await db.execute(
      `CREATE TABLE IF NOT EXISTS workers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                phone VARCHAR(20),
                specialty VARCHAR(100) DEFAULT 'Строитель',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
    );

    await db.execute(
      `CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            login VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user', 'worker') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
    );

    await db.execute(
      `CREATE TABLE IF NOT EXISTS applications  (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NULL,
            client_name VARCHAR(100) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(100),
            note_message TEXT,
            service_type ENUM(
                'Ремонт квартиры', 
                'Ремонт дома', 
                'Ремонт офиса',
                'Строительство дома',
                'Строительство бани', 
                'Строительство гаража',
                'Дизайн интерьера',
                'Консультация',
                'Другое'
            ) NOT NULL,
            status ENUM('Новая', 'В работе', 'Выполнена') DEFAULT 'Новая',
            admin_notes TEXT,
            worker_id INT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
            FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL
            )`
    );

    await db.execute(
      `CREATE TABLE IF NOT EXISTS reviews (
            id INT PRIMARY KEY AUTO_INCREMENT,
            application_id INT NOT NULL,
            user_id INT NOT NULL,
            client_name VARCHAR(100) NOT NULL,
            rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT NOT NULL,
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_application_review (application_id)
            )`
    );

    await db.execute(
      `CREATE TABLE IF NOT EXISTS project_stages (
            id INT PRIMARY KEY AUTO_INCREMENT,
            application_id INT NOT NULL,
            title VARCHAR(100) NOT NULL,
            description TEXT,
            status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
            percentage INT DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
            start_date DATE,
            end_date DATE,
            order_index INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
            )`
    );

    await db.execute(
      `CREATE TABLE IF NOT EXISTS stage_comments (
            id INT PRIMARY KEY AUTO_INCREMENT,
            stage_id INT NOT NULL,
            worker_id INT NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (stage_id) REFERENCES project_stages(id) ON DELETE CASCADE,
            FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE

            )`
    );

    console.log("All tables were created/checked");
  } catch (error) {
    console.log("Error during creating tables: ", error);
  }
}
