import { LiaMedalSolid } from "react-icons/lia";
import aboutUsImg from "/about-us.jpg";
import { PiUsers } from "react-icons/pi";
import { RiTimerLine } from "react-icons/ri";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export const AboutUsSection = () => {
  return (
    <section className="about-us" id="about-us">
      <div className="container">
        <div className="about-us__wrapper">
          <img
            className="about-us__img"
            src={aboutUsImg}
            alt="Фотография создания плана работ"
            loading="lazy"
          />
          <div className="about-us__img-banner">
            <span className="about-us__img-banner-text about-us__img-banner-text--bold">
              26+
            </span>
            <span className="about-us__img-banner-text">Лет опыта</span>
          </div>
          <div className="about-us__info">
            <h2 className="about-us__title">
              О&nbsp;{" "}
              <span className="about-us__title about-us__title--highlight">
                БАРС-В
              </span>
            </h2>
            <p className="about-us__text">
              ООО «БАРС-В» основано 2 ноября 1999 года. На протяжении более 26
              лет компания успешно работает на строительном рынке Московской
              области.
            </p>
            <ul className="about-us__list">
              <li className="about-us__item">
                <span className="about-us__item-icon">
                  <LiaMedalSolid size={40} />
                </span>
                <div className="about-us__item-info">
                  <h3 className="about-us__item-title">Качество Постройки</h3>
                  <p className="about-us__item-text">
                    Особое внимание к&nbsp;деталям.
                  </p>
                </div>
              </li>
              <li className="about-us__item">
                <span className="about-us__item-icon">
                  <PiUsers size={40} />
                </span>
                <div className="about-us__item-info">
                  <h3 className="about-us__item-title">Команда Экспертов</h3>
                  <p className="about-us__item-text">
                    Профессионалы с&nbsp;большим опытом.
                  </p>
                </div>
              </li>
              <li className="about-us__item">
                <span className="about-us__item-icon">
                  <RiTimerLine size={40} />
                </span>
                <div className="about-us__item-info">
                  <h3 className="about-us__item-title">
                    Выполнение В&nbsp;Срок
                  </h3>
                  <p className="about-us__item-text">
                    Проекты не&nbsp;превышают бюджет и&nbsp;выполняются
                    в&nbsp;срок.
                  </p>
                </div>
              </li>
              <li className="about-us__item">
                <span className="about-us__item-icon">
                  <IoCheckmarkCircleOutline size={40} />
                </span>
                <div className="about-us__item-info">
                  <h3 className="about-us__item-title">Клиенты Одобряют</h3>
                  <p className="about-us__item-text">
                    Свыше&nbsp;95% клиентов оставляют положительный отзыв.
                  </p>
                </div>
              </li>
            </ul>
            <a className="about-us__btn" href="#contact-us">
              Получить бесплатную консультацию
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
