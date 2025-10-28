import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaUserCircle } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { RiChatSmileAiLine } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchApprovedReviews } from "../store/slices/reviewsSlice";



export const ReviewsSection = () => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const dispatch = useAppDispatch()
  const {reviews, isLoading} = useAppSelector((state) => state.reviews)

  useEffect(() => {
    dispatch(fetchApprovedReviews())
  }, [dispatch])


  const nextReview = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prevIndex) => prevIndex === reviews.length - 1 ? 0 : prevIndex + 1)
  }

  const prevReview = () => {
    if (reviews.length === 0) return;
    setCurrentIndex((prevIndex) => prevIndex === 0 ? reviews.length - 1 : prevIndex - 1)
  }

  
  const renderStars = (rating: number) => {
    return Array.from({length: 5}, (_, index) => (
      <span className={`reviews__star ${index < rating ? "reviews__star--active": ""}`} key={index}>
        <IoIosStarOutline size={32} />
      </span>
    ))
  }
  
  if (isLoading) {
    return <div className="loader">Загрузка отзывов...</div>;
  }
  
  if (!reviews || reviews.length === 0) {
  return (
    <section className="reviews">
      <div className="container">
        <div className="reviews__wrapper">
          <span className="reviews__icon">
            <RiChatSmileAiLine size={60} />
          </span>
          <h2 className="reviews__title">Отзывы наших клиентов</h2>
          <p className="reviews__empty">Пока нет отзывов</p>
        </div>
      </div>
    </section>
  );
}

  const currentReview = reviews[currentIndex]

  return (
    <section className="reviews">
    <div className="container">
      <div className="reviews__wrapper">
        <span className="reviews__icon"><RiChatSmileAiLine size={60}/></span>
        <h2 className="reviews__title">Отзывы наших клиентов</h2>
        <div className="reviews__carousel">
          <button className="reviews__arrow reviews__arrow--prev" type="button" onClick={prevReview} aria-label="Предыдущий отзыв">
            <FaArrowLeft size={40}/>
          </button>

          <div className="reviews__carousel-container">
            <ul className="reviews__list">
              <li className="reviews__item" key={currentReview.id}>
                <div className="reviews__stars">
                  {renderStars(currentReview.rating)}
                </div>
                <p className="reviews__text">
                  {currentReview.comment}
                </p>
                <div className="reviews__user">
                  <span className="reviews__user-icon">
                    <FaUserCircle size={40}/>
                  </span>
                  <span className="reviews__username">{currentReview.client_name}</span>
                </div>
              </li>
            </ul>
            <div className="reviews__indicators">
              {reviews.map((_, index) => (
                <button className={`reviews__indicator ${index === currentIndex ? "reviews__indicator--active" : ""}`} key={index} onClick={() => setCurrentIndex(index)} type="button" aria-label={`Перейти к отзыву ${index + 1}`}/>
              ))}
            </div>
          </div>

          <button className="reviews__arrow reviews__arrow--next" type="button" onClick={nextReview} aria-label="Следующий отзыв">
            <FaArrowRight  size={40}/>

          </button>
        </div>
        
      </div>
    </div>
  </section>
  )
};
