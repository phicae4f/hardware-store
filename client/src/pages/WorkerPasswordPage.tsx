import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateUser } from "../store/slices/authSlice";
import { PiLockKey } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { CustomInput } from "../ui/CustomInput";

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const WorkerPasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
  } = useForm<PasswordFormData>();

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (!user) {
      console.log("No user, redirect to /login");
      navigate("/login");
      return;
    }

    if (user.role !== "worker") {
      console.log(`Role is ${user.role}, not worker, redirecting`);
      navigate(
        user.role === "admin" ? "/admin/applications" : "/my-applications",
      );
      return;
    }

    const needsPasswordChange =
      user.requiresPasswordChange || (user as any).requires_password_change;

    if (!needsPasswordChange) {
      navigate("/worker/applications");
      return;
    }
  }, [user, navigate]);

  const onSubmit = async (data: PasswordFormData) => {
    if (isSubmitting) return;

    setServerError(null);
    clearErrors();

    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Пароли не совпадают",
      });
      return;
    }

    if (data.newPassword.length < 6) {
      setError("newPassword", {
        type: "manual",
        message: "Пароль должен быть минимум 6 символов",
      });
      return;
    }

    if (data.oldPassword === data.newPassword) {
      setError("newPassword", {
        type: "manual",
        message: "Новый пароль должен отличаться от старого",
      });
      return;
    }

    setIsLoading(true);
    setIsSubmitting(true);

    try {
      console.log("Sending password change request...");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/change-worker-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
          }),
        },
      );

      const result = await response.json();
      console.log("Password change response:", result);

      if (result.success) {
        dispatch(updateUser(result.user));
        setTimeout(() => {
          navigate("/worker/applications");
        }, 1500);
      } else {
        setServerError(result.message);
      }
    } catch (err: any) {
      console.error("Password change error:", err);
      setServerError(err.message || "Ошибка при смене пароля");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="worker-password">
      <div className="worker-password__container">
        <div className="worker-password__card">
          <div className="worker-password__header">
            <div className="worker-password__icon">
              <PiLockKey size={48} />
            </div>
            <h1 className="worker-password__title">Смена пароля</h1>
            <p className="worker-password__subtitle">
              Это ваш первый вход. Пожалуйста, смените временный пароль.
            </p>
          </div>

          <form
            className="worker-password__form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="worker-password__field">
              <CustomInput
                type="password"
                placeholder="Текущий пароль"
                {...register("oldPassword", {
                  required: "Введите текущий пароль",
                })}
              />
              {errors.oldPassword && (
                <span className="worker-password__error">
                  {errors.oldPassword.message}
                </span>
              )}
            </div>

            <div className="worker-password__field">
              <CustomInput
                type="password"
                placeholder="Новый пароль (мин. 6 символов)"
                {...register("newPassword", {
                  required: "Введите новый пароль",
                  minLength: {
                    value: 6,
                    message: "Пароль должен быть минимум 6 символов",
                  },
                })}
              />
              {errors.newPassword && (
                <span className="worker-password__error">
                  {errors.newPassword.message}
                </span>
              )}
            </div>

            <div className="worker-password__field">
              <CustomInput
                type="password"
                placeholder="Подтвердите пароль"
                {...register("confirmPassword", {
                  required: "Подтвердите пароль",
                  validate: (value) =>
                    value === newPassword || "Пароли не совпадают",
                })}
              />
              {errors.confirmPassword && (
                <span className="worker-password__error">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            {serverError && (
              <span className="worker-password__error worker-password__error--server">
                {serverError}
              </span>
            )}

            <button
              className="worker-password__button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сменить пароль"}
            </button>
          </form>

          <div className="worker-password__footer">
            <button
              type="button"
              className="worker-password__logout"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
