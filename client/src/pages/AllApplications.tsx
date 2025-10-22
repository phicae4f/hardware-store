import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import type { AppDispatch } from "../store/store";
import { formatDate } from "../utils/fornatDate";
import { fetchAllApplications, updateApplication, type Application } from "../store/slices/applicationsSlice";
import { useDispatch } from "react-redux";
import { Tooltip } from "../components/Tooltip";
import { EditApplicationModal } from "../components/EditApplicationModal";
import { LuPencilLine } from "react-icons/lu";

export const AllApplications = () => {
  const { applications, isLoading, error } = useAppSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch<AppDispatch>();

  const [editingApplication, setEditingApplication] = useState<Application | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);


  const handleEditClick = (application: Application) => {
    setEditingApplication(application)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingApplication(null)
  }

  const handleSaveApplication = async (id: number, status: string, adminNotes: string) => {
    setUpdateLoading(true)
    try {
      await dispatch(updateApplication({id, status, admin_notes: adminNotes})).unwrap()
      dispatch(fetchAllApplications());
      handleCloseModal()
    } catch (error) {
      console.error('Ошибка обновления заявки:', error);
    } finally {
      setUpdateLoading(false)
    }
  }

  if (isLoading) {
    return <div className="loader">Загрузка...</div>;
  }
  return (
    <section className="applications">
      <div className="container">
        <div className="applications__wrapper">
          <h2 className="applications__title">Все заявки</h2>
          {error && (
            <span className="applications__error">
              Возникла ошибка: {error}
            </span>
          )}

          {applications.length === 0 ? (
            <div className="applications__empty">
              <p className="applications__empty-text">Заявок пока нет...</p>
            </div>
          ) : (
            <table className="applications__table applications__table--admin">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя клиента</th>
                  <th>Телефон</th>
                  <th>Email</th>
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
                    <td>{application.client_name}</td>
                    <td>{application.phone}</td>
                    <td>{application.email}</td>
                    <td>{application.service_type}</td>
                    <td>{application.status}</td>
                    <td>
                      <Tooltip content={application.note_message || ""}>
                        {application.note_message || ""}
                      </Tooltip>
                    </td>
                    <td>{formatDate(application.created_at)}</td>
                    {/* <td>
                      <Tooltip content={application.admin_notes || "Нет комментария"}>
                        {application.admin_notes ? "📝" : "-"}
                      </Tooltip>
                    </td> */}
                    <td>
                      <button className="applications__btn-edit" type="button" onClick={() => handleEditClick(application)}><LuPencilLine size={30}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <EditApplicationModal
      application={editingApplication}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      onSave={handleSaveApplication}
      isLoading={updateLoading}

       />
    </section>
  );
};
