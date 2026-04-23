import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchAllWorkers, selectAllWorkers } from "../store/slices/workerSlice";

export const AdminWorkersPage = () => {
  const dispatch = useAppDispatch();
  const workers = useAppSelector(selectAllWorkers);
  const { isLoading } = useAppSelector((state) => state.worker);
  const { token } = useAppSelector((state) => state.auth);
  const [deactivatingId, setDeactivatingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllWorkers());
  }, [dispatch]);

  const handleDeactivate = async (workerId: number) => {
    if (!confirm("Вы уверены, что хотите уволить этого рабочего?")) return;

    setDeactivatingId(workerId);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/workers/${workerId}/deactivate`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        dispatch(fetchAllWorkers());
      } else {
        const error = await response.json();
        alert(error.message || "Ошибка при увольнении");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ошибка при увольнении");
    } finally {
      setDeactivatingId(null);
    }
  };

  if (isLoading) {
    return (
      <section className="admin-workers">
        <div className="container">
          <div className="admin-workers__wrapper">
            <div className="loader">Загрузка...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-workers">
      <div className="container">
        <div className="admin-workers__wrapper">
          <div className="admin-workers__header">
            <h1 className="admin-workers__title">Список рабочих</h1>
            <button
              className="admin-workers__refresh"
              onClick={() => dispatch(fetchAllWorkers())}
            >
              🔄 Обновить
            </button>
          </div>

          {workers.length === 0 ? (
            <div className="admin-workers__empty">
              <p className="admin-workers__empty-text">Нет созданных рабочих</p>
            </div>
          ) : (
            <div className="admin-workers__table-wrapper">
              <table className="admin-workers__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Специальность</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Активных проектов</th>
                    <th>Статус</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((worker) => (
                    <tr key={worker.id}>
                      <td>{worker.id}</td>
                      <td>{worker.name}</td>
                      <td>{worker.specialty}</td>
                      <td>{worker.email}</td>
                      <td>{worker.phone}</td>
                      <td>
                        <span className="admin-workers__projects-count">
                          {(worker as any).active_projects || 0}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-workers__status ${
                            worker.isActive !== false
                              ? "admin-workers__status--active"
                              : "admin-workers__status--inactive"
                          }`}
                        >
                          {worker.isActive !== false ? "Активен" : "Уволен"}
                        </span>
                      </td>
                      <td>
                        {worker.isActive !== false && (
                          <button
                            className="admin-workers__deactivate-btn"
                            onClick={() => handleDeactivate(worker.id)}
                            disabled={deactivatingId === worker.id}
                          >
                            {deactivatingId === worker.id
                              ? "..."
                              : "❌ Уволить"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
