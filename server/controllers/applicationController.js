
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
    },

    async getAllApplications (req, res)  {
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
                a.created_at,
                a.updated_at,
                u.login as user_login,
                u.id as user_id
            FROM applications a
            LEFT JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC
                `)

            res.json({
                success: true,
                data: applications
            })
        } catch(error) {
            res.status(500).json({
                success: false,
                message: "Не удалось загрузить заявки"
            })
        }
    },
    async updateApplication (req, res)  {
        try {
            const {id} = req.params
            const {status, admin_notes} = req.body

            const validStatuses = ['Новая', 'В работе', 'Выполнена']

            if(status && !validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Неверный статус"
                })
            }

            const updateFields = []
            const updateValues = []

            if (status) {
                updateFields.push('status = ?')
                updateValues.push(status)
            }

            if(admin_notes !== undefined) {
                updateFields.push('admin_notes = ?')
                updateValues.push(admin_notes)
            }

            updateFields.push('updated_at = CURRENT_TIMESTAMP')
            updateValues.push(id)

            if(updateFields.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Нет данных для обновления"
                })
            }

            const [result] = await db.execute(`
                UPDATE applications SET ${updateFields.join(', ')} WHERE id = ?
                `, updateValues
            )

            if(result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Заявка не найдена"
                })
            }

            res.json({
                success: true,
                message: "Заявка обновлена"
            })


        } catch (error) {
            console.log(error)
            res.status(500).json({
                success:false,
                message: "Ошибка обновления заявки"
            })
        }
    }
}