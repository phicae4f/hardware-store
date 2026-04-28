import { GrLogin } from "react-icons/gr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import { DropDown } from "./Dropdown";
import { scrollToSection } from "../utils/scrollToSection";
import { useState, useEffect, useRef } from "react";
import { MdOutlineMapsHomeWork } from "react-icons/md";

export const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isBurgerActive, setIsBurgerActive] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

  const handleClickBurger = () => {
    setIsBurgerActive(!isBurgerActive);
  };

  const closeMenu = () => {
    setIsBurgerActive(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isBurgerActive &&
        burgerRef.current &&
        !burgerRef.current.contains(e.target as Node) &&
        navRef.current &&
        !navRef.current.contains(e.target as Node)
      ) {
        setIsBurgerActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isBurgerActive]);

  useEffect(() => {
    if (isBurgerActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isBurgerActive]);

  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
    closeMenu();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <Link to="/" onClick={closeMenu}>
            <div className="header__logo" aria-label="Логотип компании">
              <span className="header__logo-icon">
                <MdOutlineMapsHomeWork size={80} />
              </span>
              <div className="header__logo-text">
                <span>БАРС-В</span>
                <span>Общество с Ограниченной Ответственностью</span>
              </div>
            </div>
          </Link>
          <button
            ref={burgerRef}
            className={`header__burger ${isBurgerActive ? "header__burger--active" : ""}`}
            onClick={handleClickBurger}
            type="button"
            aria-label="Открыть бургерное меню"
          >
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
            <span className="header__burger-line"></span>
          </button>
          <ul
            ref={navRef}
            className={`header__nav ${isBurgerActive ? "header__nav--active" : ""}`}
          >
            <li
              className="header__nav-item"
              onClick={() => handleNavigation("about-us")}
            >
              О нас
            </li>
            <li
              className="header__nav-item"
              onClick={() => handleNavigation("services")}
            >
              Компетенции
            </li>
            <li
              className="header__nav-item"
              onClick={() => handleNavigation("equipment")}
            >
              Оборудование
            </li>
            <li
              className="header__nav-item"
              onClick={() => handleNavigation("projects")}
            >
              Наши работы
            </li>
            <li
              className="header__nav-item"
              onClick={() => handleNavigation("contact-us")}
            >
              Контакты
            </li>
          </ul>
          {user ? (
            <DropDown />
          ) : (
            <Link to="/login" onClick={closeMenu}>
              <button
                className="header__btn btn"
                type="button"
                aria-label="Войти в аккаунт"
              >
                <span className="header__btn-icon">
                  <GrLogin size={30} />
                </span>
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
