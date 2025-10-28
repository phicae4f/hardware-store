import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  approveReview,
  fetchAllReviews,
  rejectReview,
} from "../store/slices/reviewsSlice";
import { formatDate } from "../utils/fornatDate";

export const AllReviews = () => {
  const { reviews, isLoading, error } = useAppSelector(
    (state) => state.reviews
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const handleApprove = (reviewId: number) => {
    dispatch(approveReview(reviewId));
  };

  const handleReject = (reviewId: number) => {
    dispatch(rejectReview(reviewId));
  };

  if (isLoading) {
    return <div className="loader">Загрузка...</div>;
  }

  return (
    <section className="reviews-page">
      <div className="container">
        <div className="reviews-page__wrapper">
          <h2 className="reviews-page__title">Все отзывы</h2>
          {reviews && reviews.length === 0 ? (
            <div className="reviews-page__empty">
              <p className="reviews-page__empty-text">Отзывов пока нет...</p>
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
                  <td>Статус</td>
                  <td>Дата создания</td>
                </tr>
              </thead>
              <tbody>
                {reviews &&
                  reviews.map((review) => (
                    <tr key={review.id}>
                      <td>{review.id}</td>
                      <td>{review.application_id}</td>
                      <td>{review.client_name}</td>
                      <td>{review.rating}</td>
                      <td>{review.comment}</td>
                      <td>
                        <span
                          className={`reviews-page__status reviews-page__status--${review.status}`}
                        >
                          {review.status === "pending" && "На модерации"}
                          {review.status === "approved" && "Одобрен"}
                          {review.status === "rejected" && "Отклонен"}
                        </span>
                      </td>
                      <td>{formatDate(review.created_at)}</td>
                      <td>
                        <div className="reviews-page__buttons">
                          <button
                            className="reviews-page__btn reviews-page__btn--reject"
                            type="button"
                            onClick={() => handleReject(review.id)}
                            disabled={review.status === "rejected"}
                          >
                            Отклонить
                          </button>
                          <button
                            className="reviews-page__btn"
                            type="button"
                            onClick={() => handleApprove(review.id)}
                            disabled={review.status === "approved"}
                          >
                            Одобрить
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
};
