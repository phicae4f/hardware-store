// src/pages/WorkerApplicationsPage.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWorkerApplications } from "../store/slices/applicationsSlice";
import { formatDate } from "../utils/fornatDate";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

export const WorkerApplicationsPage = () => {
  const dispatch = useAppDispatch();
  const { applications, isLoading, error } = useAppSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(fetchWorkerApplications());
  }, [dispatch]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Новая":
        return "worker-applications__status--new";
      case "В работе":
        return "worker-applications__status--progress";
      case "Выполнена":
        return "worker-applications__status--completed";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Новая":
        return "🟡 Новая";
      case "В работе":
        return "🔵 В работе";
      case "Выполнена":
        return "🟢 Выполнена";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <section className="worker-applications">
        <div className="container">
          <div className="worker-applications__wrapper">
            <div className="loader">Загрузка проектов...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="worker-applications">
      <div className="container">
        <div className="worker-applications__wrapper">
          <h1 className="worker-applications__title">Мои проекты</h1>

          {error && (
            <div className="worker-applications__error">{error}</div>
          )}

          {applications.length === 0 ? (
            <div className="worker-applications__empty">
              <p className="worker-applications__empty-text">
                У вас пока нет назначенных проектов
              </p>
            </div>
          ) : (
            <div className="worker-applications__grid">
              {applications.map((app) => (
                <Link
                  to={`/worker/applications/${app.id}`}
                  key={app.id}
                  className="worker-applications__card"
                >
                  <div className="worker-applications__card-header">
                    <span className="worker-applications__card-id">
                      Заявка №{app.id}
                    </span>
                    <span className={`worker-applications__status ${getStatusClass(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                  </div>
                  <h3 className="worker-applications__card-title">
                    {app.service_type}
                  </h3>
                  <div className="worker-applications__card-info">
                    <div className="worker-applications__card-row">
                      <span className="worker-applications__card-label">Клиент:</span>
                      <span>{app.client_name}</span>
                    </div>
                    <div className="worker-applications__card-row">
                      <span className="worker-applications__card-label">Телефон:</span>
                      <span>{app.phone}</span>
                    </div>
                    {app.email && (
                      <div className="worker-applications__card-row">
                        <span className="worker-applications__card-label">Email:</span>
                        <span>{app.email}</span>
                      </div>
                    )}
                    <div className="worker-applications__card-row">
                      <span className="worker-applications__card-label">Дата:</span>
                      <span>{formatDate(app.created_at)}</span>
                    </div>
                  </div>
                  <div className="worker-applications__card-footer">
                    <span className="worker-applications__card-link">
                      Подробнее →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};