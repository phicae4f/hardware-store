import { FaQuestionCircle } from "react-icons/fa";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineMapsHomeWork } from "react-icons/md";
import { scrollToSection } from "../utils/scrollToSection";
import { useAppSelector } from "../hooks/redux";

export const Footer = () => {
  const { user } = useAppSelector((state) => state.auth);
  const handleDownloadFile = () => {
    const fileName =
      user?.role === "admin" ? "admin-guide.docx" : "user-guide.docx";
    const fileUrl = `/guides/${fileName}`;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const currentYear = new Date().getFullYear();

  const phones = [
    "+7 (906) 744-83-36",
    "+7 (926) 222-46-36",
    "+7 (909) 979-99-97",
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__wrapper">
          <div className="footer__left">
            <div className="footer__info">
              <div className="footer__info-item">
                <FaMapMarkerAlt className="footer__info-icon" />
                <div className="footer__info-content">
                  <span>140204, Московская область, г.о. Воскресенск,</span>
                  <span>тер. Старая промплощадка, д. 3В</span>
                </div>
              </div>

              <div className="footer__info-item">
                <FaPhoneAlt className="footer__info-icon" />
                <div className="footer__info-content">
                  {phones.map((phone, index) => (
                    <a
                      key={index}
                      href={`tel:${phone.replace(/[\s\-\(\)]/g, "")}`}
                      className="footer__phone"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className="footer__info-item">
                <FaEnvelope className="footer__info-icon" />
                <div className="footer__info-content">
                  <a
                    href="mailto:bars-stroy@inbox.ru"
                    className="footer__email"
                  >
                    bars-stroy@inbox.ru
                  </a>
                </div>
              </div>
              <div className="footer__info-item">
                <div className="footer__info-content">
                  <button
                    className="footer__guide-btn"
                    type="button"
                    onClick={handleDownloadFile}
                  >
                    <span className="footer__guide-logo">
                      <FaQuestionCircle size={30} />{" "}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="footer__copyright">
              © {currentYear} ООО «БАРС-В». Все права защищены.
            </div>
          </div>

          <div className="footer__right">
            <a
              href="#"
              className="footer__logo"
              aria-label="Навигация на главную"
            >
              <MdOutlineMapsHomeWork size={70} />
              <h2>
                <span>БАРС-В</span>
                <span>строительная компания</span>
              </h2>
            </a>

            <ul className="footer__nav">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("about-us")}
                >
                  О нас
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("services")}
                >
                  Компетенции
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("equipment")}
                >
                  Оборудование
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                >
                  Наши работы
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection("contact-us")}
                >
                  Контакты
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
