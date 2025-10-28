import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchAllReviews } from "../store/slices/reviewsSlice";
import { formatDate } from "../utils/fornatDate";

export const AllReviews = () => {
  const { reviews, isLoading, error } = useAppSelector(
    (state) => state.reviews
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllReviews());
  }, [dispatch]);

   useEffect(() => {
    console.log('📊 Reviews state:', { reviews, isLoading, error });
  }, [reviews, isLoading, error]);


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
                  <td>Дата создания</td>
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
                    <tr>
                        <div className="reviews-page__buttons">
                            <button className="reviews-page__btn reviews-page__btn--reject" type="button">Отклонить</button>
                            <button className="reviews-page__btn" type="button">Одобрить</button>
                        </div>
                    </tr>
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
