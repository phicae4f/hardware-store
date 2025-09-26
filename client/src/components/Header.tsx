
import { GrLogin } from "react-icons/gr";
import { GoTools } from "react-icons/go";
import { Link } from "react-router-dom";

export const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__wrapper">
                    <div className="header__logo" aria-label="Логотип компании">
                        <span className="header__logo-icon">
                            <GoTools size={60}/>
                        </span>
                        <div className="header__logo-text">
                        <span>БАРС-В</span>
                        <span>Общество с Ограниченной Ответственностью</span>
                        </div>
                    </div>
                    <ul className="header__nav">
                        <li className="header__nav-item">О нас</li>
                        <li className="header__nav-item">Ремонт</li>
                        <li className="header__nav-item">Постройка</li>
                        <li className="header__nav-item">Дизайн</li>
                        <li className="header__nav-item">Связаться с нами</li>
                    </ul>
                    <Link to="/login">
                    <button className="header__btn btn" type="button" aria-label="Войти в аккаунт">
                        <span className="header__btn-icon"><GrLogin size={30}/></span>
                    </button>
                    </Link>
                </div>
            </div>
        </header>
    )
}