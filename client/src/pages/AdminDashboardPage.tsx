import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux";

interface DashboardStats {
  applications: {
    total: number;
    new: number;
    in_progress: number;
    completed: number;
  };
  workers: number;
  pendingReviews: number;
}

export const AdminDashboardPage = () => {
  const { token } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/applications/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <section className="admin-dashboard">
        <div className="container">
          <div className="admin-dashboard__wrapper">
            <div className="loader">Загрузка...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <div className="container">
        <div className="admin-dashboard__wrapper">
          <h1 className="admin-dashboard__title">Панель управления</h1>

          <div className="admin-dashboard__grid">
            <div className="admin-dashboard__card admin-dashboard__card--total">
              <div className="admin-dashboard__card-icon">📋</div>
              <div className="admin-dashboard__card-content">
                <span className="admin-dashboard__card-value">
                  {stats?.applications.total || 0}
                </span>
                <span className="admin-dashboard__card-label">
                  Всего заявок
                </span>
              </div>
            </div>

            <div className="admin-dashboard__card admin-dashboard__card--new">
              <div className="admin-dashboard__card-icon">🟡</div>
              <div className="admin-dashboard__card-content">
                <span className="admin-dashboard__card-value">
                  {stats?.applications.new || 0}
                </span>
                <span className="admin-dashboard__card-label">Новых</span>
              </div>
            </div>

            <div className="admin-dashboard__card admin-dashboard__card--progress">
              <div className="admin-dashboard__card-icon">🔵</div>
              <div className="admin-dashboard__card-content">
                <span className="admin-dashboard__card-value">
                  {stats?.applications.in_progress || 0}
                </span>
                <span className="admin-dashboard__card-label">В работе</span>
              </div>
            </div>

            <div className="admin-dashboard__card admin-dashboard__card--completed">
              <div className="admin-dashboard__card-icon">🟢</div>
              <div className="admin-dashboard__card-content">
                <span className="admin-dashboard__card-value">
                  {stats?.applications.completed || 0}
                </span>
                <span className="admin-dashboard__card-label">Выполнено</span>
              </div>
            </div>

            <div className="admin-dashboard__card admin-dashboard__card--workers">
              <div className="admin-dashboard__card-icon">👷</div>
              <div className="admin-dashboard__card-content">
                <span className="admin-dashboard__card-value">
                  {stats?.workers || 0}
                </span>
                <span className="admin-dashboard__card-label">Активных рабочих</span>
              </div>
            </div>

            <div className="admin-dashboard__card admin-dashboard__card--reviews">
              <div className="admin-dashboard__card-icon">⭐</div>
              <div className="admin-dashboard__card-content">
                <span className="admin-dashboard__card-value">
                  {stats?.pendingReviews || 0}
                </span>
                <span className="admin-dashboard__card-label">
                  Отзывов на модерации
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};