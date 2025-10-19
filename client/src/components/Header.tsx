import { GrLogin } from "react-icons/gr";
import { GoTools } from "react-icons/go";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { DropDown } from "./Dropdown";
import { scrollToSection } from "../utils/scrollToSection";


export const Header = () => {
  const { user } = useAppSelector((state) => state.auth);

  const location = useLocation()
  const navigate = useNavigate()

  const handleNavigation = (sectionId: string) => {
    if(location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 100)
    } else {
      scrollToSection(sectionId)
    }
  }

  

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__logo" aria-label="Логотип компании">
            <span className="header__logo-icon">
              <GoTools size={60} />
            </span>
            <div className="header__logo-text">
              <span>БАРС-В</span>
              <span>Общество с Ограниченной Ответственностью</span>
            </div>
          </div>
          <ul className="header__nav">
            <li className="header__nav-item" onClick={() => handleNavigation("about-us")}>О нас</li>
            <li className="header__nav-item">Ремонт</li>
            <li className="header__nav-item">Строительство</li>
            <li className="header__nav-item">Дизайн</li>
            <li className="header__nav-item" onClick={() => handleNavigation("contact-us")}>Связаться с нами</li>
          </ul>
          {user ? (
            <DropDown />
              // <span className="header__user-nickname">{user.login}</span>
            ): (<Link to="/login">
              <button
                className="header__btn btn"
                type="button"
                aria-label="Войти в аккаунт"
              >
                <span className="header__btn-icon">
                  <GrLogin size={30} />
                </span>
              </button>
          </Link>)}
        </div>
      </div>
    </header>
  );
};
