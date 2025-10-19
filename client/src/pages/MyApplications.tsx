import { useDispatch } from "react-redux"
import { useAppSelector } from "../hooks/redux"
import { useEffect } from "react"
import { fetchUserApplications } from "../store/slices/applicationsSlice"
import { useNavigate } from "react-router-dom"
import { scrollToSection } from "../utils/scrollToSection"
import { type AppDispatch } from "../store/store"

export const MyApplications = () => {
    const dispatch = useDispatch<AppDispatch>()
    const {applications, isLoading, error} = useAppSelector(state => state.applications)
    const {user} = useAppSelector(state => state.auth)

    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate("/")
        setTimeout(() => {
            scrollToSection("contact-us")
        }, 100)
    }

    useEffect(() => {
        if(user) {
            dispatch(fetchUserApplications())
        }
    }, [user, dispatch])

    if(isLoading) {
        return (
            <span className="loader">
                Загрузка...
            </span>
        )
    }

    return (
    <section className="applications">
        <div className="container">
            <div className="applications__wrapper">
                <h2 className="applications__title">Мои заявки</h2>
                {error && (
                    <span className="applications__error">Возникла ошибка: {error}</span>
                )}

                {applications.length === 0 ? (
                    <div className="applications__empty">
                        <p className="applications__empty-text">У Вас пока нет заявок</p>
                        <button className="applications__empty-link" type="button" onClick={handleNavigate}>Оставить первую заявку</button>
                    </div>
                ): (
                    <table className="applications__table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Тип услуги</th>
                            <th>Статус</th>
                            <th>ДАта создания</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.id}</td>
                            <td>{application.service_type}</td>
                            <td>{application.status}</td>
                            <td>{application.created_at}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    </section>
    )
}