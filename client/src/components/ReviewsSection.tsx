import { FaUserCircle } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { RiChatSmileAiLine } from "react-icons/ri";

export const ReviewsSection = () => {
  return (
    <section className="reviews">
    <div className="container">
      <div className="reviews__wrapper">
        <span className="reviews__icon"><RiChatSmileAiLine size={60}/></span>
        <h2 className="reviews__title">Отзывы наших клиентов</h2>
        <ul className="reviews__list">
          <li className="reviews__item">
            <div className="reviews__stars">
              <span className="reviews__star">
                <IoIosStarOutline size={32}/>
              </span>
              <span className="reviews__star">
                <IoIosStarOutline size={32}/>
              </span>
              <span className="reviews__star">
                <IoIosStarOutline size={32}/>
              </span>
              <span className="reviews__star">
                <IoIosStarOutline size={32}/>
              </span>
              <span className="reviews__star">
                <IoIosStarOutline size={32}/>
              </span>
            </div>
            <p className="reviews__text">
              Все супер.Все супер.Все супер.Все супер.Все супер.Все супер.Все
              супер.Все супер.Все супер.Все супер.Все супер.Все супер.Все
              супер.Все супер.Все супер.
            </p>
            <div className="reviews__user">
              <span className="reviews__user-icon">
                <FaUserCircle size={40}/>
              </span>
              <span className="reviews__username">Андрей</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
  )
};
