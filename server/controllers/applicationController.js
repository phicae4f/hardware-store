
import { db } from "../db.js"

export const applicationController= {
    async createApplication(req, res) {
        try{
            const {
                client_name,
                phone,
                email,
                note_message,
                service_type
            } = req.body

            if(!client_name || !phone || !service_type) {
                return res.status(400).json({
                    success: false,
                    message: "Имя, телефон и тип услуги обязательны"
                })
            }

            const validServiceTypes = [
                'Ремонт квартиры', 'Ремонт дома', 'Ремонт офиса',
                'Строительство дома', 'Строительство бани', 'Строительство гаража',
                'Дизайн интерьера', 'Консультация', 'Другое'
            ]

            if(!validServiceTypes.includes(service_type)) {
                return res.status(400).json({
                    success: false,
                    message: "Неверный тип услуги"
                })
            }
            const userId = req.user ? (req.user.userId || req.user.id) : null

            const [result] = await db.execute(
                `
                INSERT INTO applications (user_id, client_name, phone, email, note_message, service_type)
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [   userId,
                    client_name,
                    phone,
                    email,
                    note_message, 
                    service_type
                ]
            )

            res.status(201).json({
                success: true,
                message: "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
                data: {
                    applicationId: result.insertId
                }
            })
        } catch(error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Ошибка при отправке заявки"
            })
        }
    },

    async getUserApplications(req, res) {
        try {
            const userId = req.user ? (req.user.userId || req.user.id) : null
            const [applications] = await db.execute(`
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
                `, [userId])

                res.json({
                    success: true,
                    data: applications
                })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Ошибка просмотра заявок"
            })
        }
    }
}