import { IoMdClose } from "react-icons/io"
import type { Application } from "../store/slices/applicationsSlice"
import { useEffect, useState } from "react"


interface EditApplicationModalProps {
    application: Application | null,
    isOpen: boolean,
    onClose: () => void,
    onSave: (id: number, status: string, adminNotes: string) => void,
    isLoading?: boolean
}


export const EditApplicationModal = ({application, isOpen, onClose, onSave, isLoading = false}: EditApplicationModalProps) => {
    const [status, setStatus] = useState("Новая")
    const [adminNotes, setAdminNotes] = useState("")

    useEffect(() => {
        if(application) {
            setStatus(application.status)
            setAdminNotes(application.admin_notes || "")
        }
    }, [application])

    const handleSave = () => {
        if(application) {
            onSave(application.id, status, adminNotes)
        }
    }
    const handleOverlayClick = (e: React.MouseEvent) => {
        if(e.target === e.currentTarget) {
            onClose()
        }
    }

    if(!isOpen || !application) {
        return null;
    }

    return (
        <div className="modal" onClick={handleOverlayClick}>
            <div className="modal__wrapper">
                <div className="modal__header">
                    <h2 className="modal__title">Редактирование заявки #{application.id}</h2>
                    <button className="modal__close-btn" type="button" onClick={onClose}><IoMdClose size={34}/></button>
                </div>
                <div className="modal__content">
                    <div className="modal__group">
                        <span className="modal__group-name">Клиент:</span>
                        <span className="modal__group-value">{application.client_name}</span>
                    </div>
                    <div className="modal__group">
                        <span className="modal__group-name">Телефон:</span>
                        <span className="modal__group-value">{application.phone}</span>
                    </div>
                    <div className="modal__group">
                        <span className="modal__group-name">Тип услуги:</span>
                        <span className="modal__group-value">{application.service_type}</span>
                    </div>
                    <div className="modal__group">
                        <span className="modal__group-name">Статус:</span>
                        <select className="modal__select" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Новая">Новая</option>
                            <option value="В работе">В работе</option>
                            <option value="Выполнена">Выполнена</option>
                        </select>
                    </div>
                    <div className="modal__group">
                        <span className="modal__group-name">Комментарий администратора:</span>
                        <textarea className="modal__textarea" id="adminNotes" placeholder="Введите комментарий..." value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)}/>
                    </div>
                </div>
                <div className="modal__footer">
                    <button className="modal__btn" type="button" onClick={onClose} disabled={isLoading}>Отмена</button>
                    <button className="modal__btn modal__btn--color" type="button" onClick={handleSave} disabled={isLoading}>{isLoading ? "Сохранение..." : "Сохранить"}</button>
                </div>
            </div>
        </div>
    )
}