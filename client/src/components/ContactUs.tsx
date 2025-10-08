import { PiCat } from "react-icons/pi";
import { CustomInput } from "../ui/CustomInput"
import { CustomSelect } from "../ui/CustomSelect"
import { CustomTextArea } from "../ui/CustomTextArea"
import { MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";

export const ContactUs = () => {
    return (
        <section className="contact-us">
            <div className="container">
                <div className="contact-us__wrapper">
                    <span className="contact-us__icon"><PiCat size={36}/></span>
                    <h1 className="contact-us__title">Оставьте заявку &mdash;</h1>
                    <p className="contact-us__text">cвяжемся с&nbsp;Вами в&nbsp;ближайшее время!</p>
                    <form  className="contact-us__form">
                        <CustomInput type="text" placeholder="Имя" name="username"/>
                        <CustomInput type="email" placeholder="Email" name="email"/>
                        <CustomInput type="tel" placeholder="Телефон" name="tel"/>
                        <CustomSelect/>
                        <CustomTextArea placeholder="Опишите вопрос (необязательно)"/>
                        <button className="contact-us__btn" type="button">Отправить</button>
                    </form>
                    <div className="contact-us__info">
                        <h2 className="contact-us__info-title">Информация о&nbsp;нас</h2>
                        <ul className="contact-us__list">
                            <li className="contact-us__item">
                                <span className="contact-us__item-icon"><MdOutlineMailOutline size={30}/></span>
                                <a className="contact-us__item-link" href="mailto:email@gmail.com">email@gmail.com</a>
                            </li>
                            <li className="contact-us__item">
                                <span className="contact-us__item-icon"><MdOutlinePhone size={30}/></span>
                                <a className="contact-us__item-link" href="tel:+78005553535">+7(800)-555-3535</a>
                            </li>
                            <li className="contact-us__item">
                                <span className="contact-us__item-icon"><IoLocationOutline size={30}/></span>
                                <span className="contact-us__item-text">Московская область, г. о. Воскресенск, тер. Старая Промплощадка, зд. 3В</span>
                            </li>
                            <li className="contact-us__item">
                                <span className="contact-us__item-icon"><FaRegClock size={30}/></span>
                                <span className="contact-us__item-text">09.00&nbsp;&mdash; 18.00</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}