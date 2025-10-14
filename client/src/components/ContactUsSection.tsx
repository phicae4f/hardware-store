import { PiCat } from "react-icons/pi";
import { CustomInput } from "../ui/CustomInput"
import { CustomSelect } from "../ui/CustomSelect"
import { CustomTextArea } from "../ui/CustomTextArea"
import { MdOutlineMailOutline, MdOutlinePhone } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { useState} from "react";
import { useAppSelector } from "../hooks/redux";
import { useForm } from "react-hook-form";


interface FormData {
    client_name: string,
    phone: string,
    email: string,
    note_message: string,
    service_type: string
}

export const ContactUsSection = () => {
    const {user} = useAppSelector(state => state.auth)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    const {register, formState: {errors}, handleSubmit, reset} = useForm<FormData>({
        defaultValues: {
            client_name: user?.login || "",
            phone: "",
            email: "",
            note_message: "",
            service_type: ""
        }
    })
    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setMessage("")

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()

            if(result.success) {
                setMessage(result.message)
                reset({
                    client_name: user?.login || "",
                    phone: "",
                    email: "",
                    note_message: "",
                    service_type: ""
                })
            } else {
                setMessage(result.message || "Ошибка отправки заявки")
            }
        } catch (error) {
            setMessage("Ошибка отправки заявки. Попробуйте еще раз")
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <section className="contact-us" id="contact-us">
            <div className="container">
                <div className="contact-us__wrapper">
                    <span className="contact-us__icon"><PiCat size={36}/></span>
                    <h2 className="contact-us__title">Оставьте заявку &mdash;</h2>
                    <p className="contact-us__text">cвяжемся с&nbsp;Вами в&nbsp;ближайшее время!</p>
                    <form  className="contact-us__form" onSubmit={handleSubmit(onSubmit)}>
                        <div className="contact-us__field">
                            <CustomInput type="text" placeholder="Имя" {...register("client_name", {required: "Имя обязательно"})}/>
                            {errors.client_name && (<span className="contact-us__error">{errors.client_name.message}</span>)}
                        </div>
                        <div className="contact-us__field">
                            <CustomInput type="email" placeholder="Email" {...register("email")}/>
                        </div>
                        <div className="contact-us__field">
                            <CustomInput type="tel" placeholder="Телефон" {...register("phone", {required: "Номер обязателен"})}/>
                            {errors.phone && (<span className="contact-us__error">{errors.phone.message}</span>)}
                        </div>
                        <div className="contact-us__field">
                            <CustomSelect {...register("service_type",  {required: "Выберите тип услуги"})}/>
                            {errors.service_type && (<span className="contact-us__error">{errors.service_type.message}</span>)}
                        </div>
                        <div className="contact-us__field">
                            <CustomTextArea placeholder="Опишите вопрос (необязательно)" {...register("note_message")}/>
                        </div>
                        <button className="contact-us__btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Отправка...' : 'Отправить'}</button>
                        {message && (
                        <span className={`contact-us__message ${message.includes("успешно") && "contact-us__message--success"}`}>{message}</span>
                    )}
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