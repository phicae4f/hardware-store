import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

export const DropDown = () => {
    const {user} = useAppSelector(state => state.auth)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleLogout = () => {
        dispatch(logout())
        setIsOpen(false)
        navigate("/")
    }

    const handleItemClick = () => {
        setIsOpen(false)
    }

    if(!user) {
        return null;
    }

    return (
        <div className="dropdown" ref={dropdownRef}>
            <button className="dropdown__button" type="button" onClick={() => setIsOpen(!isOpen)}>
                <span className="dropdown__username">{user.login}</span>
                <span className={`dropdown__arrow ${isOpen ? "open": ""}`}>▼</span>
            </button>
                <div className={`dropdown__menu ${isOpen ? "open": ""}`}>
                    {user.role === "user" && (
                        <>
                            <Link to="/my-applications" className="dropdown__item" onClick={handleItemClick}>
                                Мои заявки
                            </Link>
                            <Link to="/my-reviews" className="dropdown__item" onClick={handleItemClick}>
                                Мои отзывы
                            </Link>
                        </>
                    )}
                    {user.role === "admin" && (
                        <>
                            <Link to="/admin/applications" className="dropdown__item" onClick={handleItemClick}>
                                Все заявки
                            </Link>
                            <Link to="/admin/reviews" className="dropdown__item" onClick={handleItemClick}>
                                Модерация отзывов
                            </Link>
                        </>
                    )}
                    <button className="dropdown__logout" type="button" onClick={handleLogout}>
                        Выйти
                    </button>
                </div>
        </div>
    )
}