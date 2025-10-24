import "dotenv/config"
import mysql from "mysql2/promise"

export const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
})

export async function createTables() {
    try {
        await db.execute(
            `CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            login VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        )
        await db.execute(
            `CREATE TABLE IF NOT EXISTS projects (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`
        )
        await db.execute(
            `CREATE TABLE IF NOT EXISTS project_images (
            id INT PRIMARY KEY AUTO_INCREMENT,
            project_id INT,
            image_url VARCHAR(500) NOT NULL,
            image_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )`
        )
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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
            )`
        )

        await db.execute(
            `CREATE TABLE IF NOT EXISTS reviews (
            id INT PRIMARY KEY AUTO_INCREMENT,
            service_type_id INT,
            status_id,
            created_at_id
            )`
        )

        console.log("All tables were created/checked")
    } catch(error) {
        console.log("Error during creating tables: ", error)
    }
}