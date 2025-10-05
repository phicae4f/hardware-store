import "dotenv/config"
import { db } from "../db.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const userController = {
    async register (req, res)  {
       try {
        const {login, password} = req.body

        if(!login || !password) {
            return res.status(400).json({
                success: false,
                message: "Логин и пароль обязательны"
            })
        }

        if(login.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Логин должен содержать минимум 3 символа"
            })
        }

        if(password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Пароль должен содержать минимум 6 символов"
            })
        }

        const [existingUsers] = await db.execute(
            'SELECT id FROM users WHERE login = ?',
            [login]
        )

        if(existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Пользователь с таким логином уже существует"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await db.execute(
            'INSERT INTO users (login, password_hash) VALUES (?, ?)',
            [login, hashedPassword]
        )

        const userId = result.insertId

        const token = jwt.sign(
            {
                userId: userId,
                login: login,
                role: "user"
            },
            process.env.JWT_SECRET,
            {expiresIn: "24h"}
        )

        res.status(201).json({
            success: true,
            message: "Пользователь успешно зарегистрирован",
            data: {
                user: {
                    id: userId,
                    login: login,
                    role: "user"
                },
                token: token
            }
        })
       } catch (error) {
        console.log("Register Error:", error)
        res.status(500).json({
            success: false,
            message: "Ошибка сервера при регистрации"
        })
       }
    },

    async login (req, res) {
        try {
            const {login, password} = req.body
            if(!login || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Логин или пароль обязательны"
                })
            }
            const [users] = await db.execute(
                'SELECT * FROM users WHERE login = ?',
                [login]
            )
            if(users.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Неверный логин или пароль"
                })
            }
            const user = users[0]
            const isValidPassword = await bcrypt.compare(password, user.password_hash)

            if(!isValidPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Неверный логин или пароль"
                })
            }
            const token = jwt.sign(
                {
                    userId: user.id,
                    login: user.login,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {expiresIn: '24h'}
            )
            res.json({
                success: true,
                message: "Успешная авторизация",
                data: {
                    user: {
                        id: user.id,
                        login: user.login,
                        role: user.role
                    },
                    token: token
                }
            })
        } catch (error) {
            console.log("Login error:", error)
            res.status(500).json({
                success: false,
                message: "Ошибка авторизации"
            })
        }
    }
}