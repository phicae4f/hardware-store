import { TbToolsOff } from "react-icons/tb";
import { GrLogin } from "react-icons/gr";

export const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__wrapper">
                    <div className="header__logo" aria-label="Логотип компании">
                        <TbToolsOff size={60}/>
                    </div>
                    <ul className="header__nav">
                        <li className="header__nav-item">О нас</li>
                        <li className="header__nav-item">Ремонт</li>
                        <li className="header__nav-item">Постройка</li>
                        <li className="header__nav-item">Дизайн</li>
                        <li className="header__nav-item">Связаться с нами</li>
                    </ul>
                    <div className="header__user">
                        <button className="header__btn btn" type="button">Войти</button>
                        <span className="header__icon"><GrLogin size={26}/></span>
                    </div>
                </div>
            </div>
        </header>
    )
}