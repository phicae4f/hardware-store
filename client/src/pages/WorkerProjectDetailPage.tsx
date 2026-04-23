import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

interface StageComment {
  id: number;
  comment: string;
  worker_id: number;
  created_at: string;
}

interface Stage {
  id: number;
  application_id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  percentage: number;
  order_index: number;
  comments: StageComment[];
}

export const WorkerProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const [project, setProject] = useState<any>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [commentText, setCommentText] = useState<{ [key: number]: string }>({});

  // Загрузка данных проекта и этапов
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Получаем информацию о заявке
        const appResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/applications/worker/my-applications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const appData = await appResponse.json();
        const currentProject = appData.data.find((a: any) => a.id === Number(id));
        setProject(currentProject);

        // Получаем этапы
        const stagesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/applications/${id}/stages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const stagesData = await stagesResponse.json();
        setStages(stagesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const updateStage = async (stageId: number, status: string, percentage: number) => {
  setUpdating(true);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/applications/stages/${stageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          percentage,
          comment: commentText[stageId] || "",
        }),
      }
    );

    if (response.ok) {
      // Обновляем локальное состояние
      setStages((prev) =>
        prev.map((stage) => {
          if (stage.id === stageId) {
            return {
              ...stage,
              status: status as "pending" | "in_progress" | "completed",
              percentage,
            };
          }
          return stage;
        })
      );
      setCommentText((prev) => ({ ...prev, [stageId]: "" }));
    }
  } catch (error) {
    console.error("Error updating stage:", error);
  } finally {
    setUpdating(false);
  }
};

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳ Ожидает";
      case "in_progress":
        return "🔨 В работе";
      case "completed":
        return "✅ Завершён";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "project-detail__status--pending";
      case "in_progress":
        return "project-detail__status--progress";
      case "completed":
        return "project-detail__status--completed";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="loader">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="project-detail__error">Проект не найден</div>
          <button onClick={() => navigate("/worker/applications")} className="project-detail__back-btn">
            ← Вернуться к проектам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail">
      <div className="container">
        <button onClick={() => navigate("/worker/applications")} className="project-detail__back-btn">
          ← Назад к проектам
        </button>

        <div className="project-detail__header">
          <h1 className="project-detail__title">{project.service_type}</h1>
          <div className="project-detail__info">
            <div className="project-detail__info-row">
              <span className="project-detail__info-label">Клиент:</span>
              <span>{project.client_name}</span>
            </div>
            <div className="project-detail__info-row">
              <span className="project-detail__info-label">Телефон:</span>
              <span>{project.phone}</span>
            </div>
            {project.email && (
              <div className="project-detail__info-row">
                <span className="project-detail__info-label">Email:</span>
                <span>{project.email}</span>
              </div>
            )}
            <div className="project-detail__info-row">
              <span className="project-detail__info-label">Статус заявки:</span>
              <span className={`project-detail__status-badge project-detail__status-badge--${project.status === "Новая" ? "new" : project.status === "В работе" ? "progress" : "completed"}`}>
                {project.status}
              </span>
            </div>
            {project.admin_notes && (
              <div className="project-detail__info-row">
                <span className="project-detail__info-label">Заметки админа:</span>
                <span>{project.admin_notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="project-detail__stages">
          <h2 className="project-detail__stages-title">Этапы работ</h2>
          <div className="project-detail__stages-list">
            {stages.map((stage) => (
              <div key={stage.id} className="project-detail__stage">
                <div className="project-detail__stage-header">
                  <div className="project-detail__stage-left">
                    <h3 className="project-detail__stage-title">{stage.title}</h3>
                    <p className="project-detail__stage-description">{stage.description}</p>
                  </div>
                  <div className={`project-detail__stage-status ${getStatusClass(stage.status)}`}>
                    {getStatusText(stage.status)}
                  </div>
                </div>

                <div className="project-detail__stage-progress">
                  <div className="project-detail__progress-bar">
                    <div
                      className="project-detail__progress-fill"
                      style={{ width: `${stage.percentage}%` }}
                    ></div>
                  </div>
                  <span className="project-detail__progress-text">{stage.percentage}%</span>
                </div>

                <div className="project-detail__stage-controls">
                  <select
                    className="project-detail__select"
                    value={stage.status}
                    onChange={(e) =>
                      updateStage(stage.id, e.target.value, stage.percentage)
                    }
                    disabled={updating}
                  >
                    <option value="pending">⏳ Ожидает</option>
                    <option value="in_progress">🔨 В работе</option>
                    <option value="completed">✅ Завершён</option>
                  </select>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={stage.percentage}
                    onChange={(e) =>
                      updateStage(stage.id, stage.status, parseInt(e.target.value))
                    }
                    disabled={updating}
                    className="project-detail__range"
                  />

                  <div className="project-detail__comment-section">
                    <textarea
                      className="project-detail__comment-input"
                      placeholder="Добавить комментарий к этапу..."
                      value={commentText[stage.id] || ""}
                      onChange={(e) =>
                        setCommentText((prev) => ({ ...prev, [stage.id]: e.target.value }))
                      }
                    />
                    <button
                      className="project-detail__comment-btn"
                      onClick={() =>
                        updateStage(stage.id, stage.status, stage.percentage)
                      }
                      disabled={updating || !commentText[stage.id]}
                    >
                      Добавить
                    </button>
                  </div>

                  {stage.comments && stage.comments.length > 0 && (
                    <div className="project-detail__comments-list">
                      {stage.comments.map((comment) => (
                        <div key={comment.id} className="project-detail__comment">
                          <div className="project-detail__comment-text">{comment.comment}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};