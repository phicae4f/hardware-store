import { useEffect } from "react"
import { useAppSelector } from "../hooks/redux"
import type { AppDispatch } from "../store/store"
import { formatDate } from "../utils/fornatDate"
import { fetchAllApplications } from "../store/slices/applicationsSlice"
import { useDispatch } from "react-redux"

export const AllApplications = () => {
    const {applications, isLoading, error} = useAppSelector(state => state.applications)
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(fetchAllApplications())
    }, [dispatch])

    if(isLoading) {
        return (
            <div className="loader">
                Загрузка...
            </div>
        )
    }
    return (
        <section className="applications">
                <div className="container">
                    <div className="applications__wrapper">
                        <h2 className="applications__title">Все заявки</h2>
                        {error && (
                            <span className="applications__error">Возникла ошибка: {error}</span>
                        )}
        
                        {applications.length === 0 ? (
                            <div className="applications__empty">
                                <p className="applications__empty-text">Заявок пока нет...</p>
                            </div>
                        ): (
                            <table className="applications__table applications__table--admin">
                            <thead>
                                <tr>
                                     <th>ID</th>
                                    <th>Имя клиента</th>
                                    <th>Телефон</th>
                                    <th>Email</th>
                                    <th>Тип услуги</th>
                                    <th>Статус</th>
                                    <th>Сообщение</th>
                                    <th>Дата создания</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((application) => (
                                <tr key={application.id}>
                                    <td>{application.id}</td>
                                    <td>{application.client_name}</td>
                                    <td>{application.phone}</td>
                                    <td>{application.email}</td>
                                    <td>{application.service_type}</td>
                                    <td>{application.status}</td>
                                    <td title={application.note_message || ""}>
                                        {application.note_message}
                                    </td>
                                    <td>{formatDate(application.created_at)}</td>
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