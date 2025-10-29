import { GoTools } from "react-icons/go";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__wrapper">
          <div className="footer__main">
            <p className="footer__logo-text">Экспертное предоставление услуг по постройке кухон, наружных
            пространств и ресторанов. На рынке с 1998 года.</p>
          </div>
          <div className="footer__services">
            <p className="footer__title">Услуги</p>
            <ul className="footer__list">
              <li className="footer__item">Ремонт</li>
              <li className="footer__item">Строительство</li>
              <li className="footer__item">Дизайн</li>
            </ul>
          </div>
          <div className="footer__contact">
            <p className="footer__title">Контакты</p>
            <ul className="footer__list">
              <li className="footer__item">Московская область, г. о. Воскресенск, тер. Старая Промплощадка, зд. 3В</li>
              <li className="footer__item">Телефон: +7(880)-555-35-35</li>
              <li className="footer__item">Email: email@gmail.com</li>
            </ul>
          </div>
          <div className="footer__logo-wrapper">
              <div className="footer__logo-icon">
                <GoTools size={70} />
              </div>
              <span className="footer__logo-title">БАРС-В</span>
            </div>
        </div>
      </div>
    </footer>
  );
};
