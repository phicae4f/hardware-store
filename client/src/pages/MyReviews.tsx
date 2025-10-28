import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { formatDate } from "../utils/fornatDate"
import { fetchUserReviews } from "../store/slices/reviewsSlice"
import { useNavigate } from "react-router-dom"
import { scrollToSection } from "../utils/scrollToSection"

export const MyReviews = () => {
    const {reviews, isLoading, error} = useAppSelector((state) => state.reviews)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

      const handleNavigate = () => {
        navigate("/");
        setTimeout(() => {
          scrollToSection("contact-us");
        }, 200);
      };

    useEffect(() => {
        dispatch(fetchUserReviews())
    }, [dispatch])

    if(isLoading) {
        return (
            <div>Загрузка...</div>
        )
    }
    
    return (
        <section className="reviews-page">
              <div className="container">
                <div className="reviews-page__wrapper">
                  <h2 className="reviews-page__title">Мои отзывы</h2>
                  {reviews && reviews.length === 0 ? (
                    <div className="reviews-page__empty">
                      <p className="reviews-page__empty-text">Отзывов пока нет...</p>
                      <button
                className="applications__empty-link"
                type="button"
                onClick={handleNavigate}
              >
                Оставить первую заявку
              </button>
                    </div>
                  ) : (
                    <table className="reviews-page__table">
                      <thead>
                        <tr>
                          <td>ID отзыва</td>
                          <td>ID заявки</td>
                          <td>Имя клиента</td>
                          <td>Рейтинг</td>
                          <td>Комментарий</td>
                          <td>Дата создания</td>
                          <td>Статус отзыва</td>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews && reviews.map((review) => (
                          <tr>
                            <td>{review.id}</td>
                            <td>{review.application_id}</td>
                            <td>{review.client_name}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>{formatDate(review.created_at)}</td>
                            <td>-</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
    )
}