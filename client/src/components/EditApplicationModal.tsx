import { useEffect, useState } from "react";
import { fetchAllWorkers, selectAllWorkers } from "../store/slices/workerSlice";
import type { Application } from "../store/slices/applicationsSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

interface EditApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, status: string, adminNotes: string, workerId?: number) => void;
  isLoading: boolean;
}

export const EditApplicationModal = ({
  application,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: EditApplicationModalProps) => {
  const dispatch = useAppDispatch();
  const workers = useAppSelector(selectAllWorkers);
  const [status, setStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | "">("");

  useEffect(() => {
    dispatch(fetchAllWorkers());
  }, [dispatch]);

  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setAdminNotes(application.admin_notes || "");
    }
  }, [application]);

  if (!isOpen || !application) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(application.id, status, adminNotes, selectedWorkerId === "" ? undefined : selectedWorkerId);
  };

  return (
    <div className="modal">
      <div className="modal__wrapper">
        <div className="modal__header">
          <h2 className="modal__title">Редактирование заявки №{application.id}</h2>
          <button className="modal__close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal__content">
            <div className="modal__group">
              <label className="modal__label">Статус</label>
              <select
                className="modal__select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Новая">Новая</option>
                <option value="В работе">В работе</option>
                <option value="Выполнена">Выполнена</option>
              </select>
            </div>

            <div className="modal__group">
              <label className="modal__label">Назначить рабочего</label>
              <select
                className="modal__select"
                value={selectedWorkerId}
                onChange={(e) => setSelectedWorkerId(e.target.value ? Number(e.target.value) : "")}
              >
                <option value="">-- Выберите рабочего --</option>
                {workers.map((worker) => (
                  <option key={worker.id} value={worker.id}>
                    {worker.name} ({worker.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal__group modal__group--full">
              <label className="modal__label">Заметки админа</label>
              <textarea
                className="modal__textarea"
                rows={4}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Дополнительная информация..."
              />
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="modal__btn"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="modal__btn modal__btn--color"
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};