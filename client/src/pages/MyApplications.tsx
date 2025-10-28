import { useDispatch } from "react-redux";
import { useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { fetchUserApplications } from "../store/slices/applicationsSlice";
import { useNavigate } from "react-router-dom";
import { scrollToSection } from "../utils/scrollToSection";
import { type AppDispatch } from "../store/store";
import { formatDate } from "../utils/fornatDate";
import { Tooltip } from "../components/Tooltip";
import { LeaveReviewModal } from "../components/LeaveReviewModal";
import { createReview } from "../store/slices/reviewsSlice";

export const MyApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, isLoading, error } = useAppSelector(
    (state) => state.applications
  );
  const { user } = useAppSelector((state) => state.auth);
  const {isLoading: reviewsLoading, error: reviewsError} = useAppSelector((state) => state.reviews)

  const navigate = useNavigate();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<{
    id: number;
  } | null>(null);

  const handleNavigate = () => {
    navigate("/");
    setTimeout(() => {
      scrollToSection("contact-us");
    }, 200);
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchUserApplications());
    }
  }, [user, dispatch]);

  const handleReviewClick = (applicationId: number) => {
    setSelectedApplication({id: applicationId})
    setReviewModalOpen(true)
  }

  const handleReviewSubmit = async (clientName: string, rating: number, comment: string) => {
    if(!selectedApplication) {
      return
    }

    try {
      await dispatch(createReview({
        application_id: selectedApplication.id,
        client_name: clientName,
        rating,
        comment
      })).unwrap()
      setReviewModalOpen(false)
      setSelectedApplication(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = () => {
    setReviewModalOpen(false)
    setSelectedApplication(null)
  }

  if (isLoading) {
    return <span className="loader">Загрузка...</span>;
  }

  return (
    <section className="applications">
      <div className="container">
        <div className="applications__wrapper">
          <h2 className="applications__title">Мои заявки</h2>
          {error && (
            <span className="applications__error">
              Возникла ошибка: {error}
            </span>
          )}

          {applications.length === 0 ? (
            <div className="applications__empty">
              <p className="applications__empty-text">
                У Вас пока нет заявок...
              </p>
              <button
                className="applications__empty-link"
                type="button"
                onClick={handleNavigate}
              >
                Оставить первую заявку
              </button>
            </div>
          ) : (
            <table className="applications__table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Тип услуги</th>
                  <th>Статус</th>
                  <th>Сообщение</th>
                  <th>Дата создания</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.id}</td>
                    <td>{application.service_type}</td>
                    <td>{application.status}</td>
                    <td>
                      <Tooltip content={application.note_message || ""}>
                        {application.note_message || ""}
                      </Tooltip>
                    </td>
                    <td>{formatDate(application.created_at)}</td>
                    <td>
                      {application.status === "Выполнена" ? (
                        <button
                          className="applications__review-btn"
                          type="button"
                          onClick={() => handleReviewClick(application.id)}
                        >
                          Оставить отзыв
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <LeaveReviewModal 
        applicationId={selectedApplication?.id || 0}
        isOpen={reviewModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleReviewSubmit}
        isLoading={reviewsLoading}
        error={reviewsError || ""}
         />
    </section>
  );
};
