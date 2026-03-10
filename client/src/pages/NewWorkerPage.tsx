import debounce from "lodash/debounce";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useNavigate } from "react-router-dom";
import {
  clearWorkerError,
  createWorker,
  selectWorkerError,
  selectWorkerLoading,
  selectWorkers,
  selectWorkerTempPassword,
} from "../store/slices/workerSlice";
import { CustomInput } from "../ui/CustomInput";
import { PiCat } from "react-icons/pi";

interface WorkerFormData {
  name: string;
  login: string;
  email: string;
  specialty: string;
  phone: string;
}

export const NewWorkerPage = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    trigger,
  } = useForm<WorkerFormData>({
    defaultValues: {
      specialty: "",
    },
    mode: "onChange",
  });

  const [createdWorker, setCreatedWorker] = useState<{
    name: string;
    login: string;
    specialty: string;
    email: string;
    phone: string;
  } | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const existingWorkers = useAppSelector(selectWorkers);

  const existingEmails = useMemo(
    () => existingWorkers.map((worker) => worker.email?.toLowerCase() || ""),
    [existingWorkers],
  );

  const existingLogins = useMemo(
    () => existingWorkers.map((worker) => worker.login?.toLowerCase() || ""),
    [existingWorkers],
  );

  const loginValue = watch("login");
  const emailValue = watch("email");

  const { user } = useAppSelector((state) => state.auth);
  const isLoading = useAppSelector(selectWorkerLoading);
  const tempPassword = useAppSelector(selectWorkerTempPassword);
  const error = useAppSelector(selectWorkerError);

  // Проверка email на уникальность
  const checkEmailUniqueness = useCallback(
    debounce((email: string) => {
      if (!email || !email.includes("@")) return;

      const normalizedEmail = email.toLowerCase().trim();
      const exists = existingEmails.includes(normalizedEmail);

      if (exists) {
        setError("email", {
          type: "manual",
          message: "Рабочий с таким email уже существует",
        });
      } else {
        clearErrors("email");
      }
    }, 500),
    [existingEmails, setError, clearErrors],
  );

  // Проверка логина на уникальность
  const checkLoginUniqueness = useCallback(
    debounce((login: string) => {
      if (!login || login.length < 3) return;

      const normalizedLogin = login.toLowerCase().trim();
      const exists = existingLogins.includes(normalizedLogin);

      if (exists) {
        setError("login", {
          type: "manual",
          message: "Рабочий с таким логином уже существует",
        });
      } else {
        clearErrors("login");
      }
    }, 500),
    [existingLogins, setError, clearErrors],
  );

  useEffect(() => {
    if (emailValue) {
      checkEmailUniqueness(emailValue);
    }
    return () => {
      checkEmailUniqueness.cancel();
    };
  }, [emailValue, checkEmailUniqueness]);

  useEffect(() => {
    if (loginValue) {
      checkLoginUniqueness(loginValue);
    }
    return () => {
      checkLoginUniqueness.cancel();
    };
  }, [loginValue, checkLoginUniqueness]);

  const validatePhone = (phone: string) => {
    if (!phone) return "Введите номер телефона";

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return "Номер телефона может содержать только цифры, пробелы, +, -, ()";
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      return "Номер телефона должен содержать минимум 10 цифр";
    }

    return true;
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate, user]);

  const onSubmit = async (data: WorkerFormData) => {
    dispatch(clearWorkerError());

    // Валидация телефона
    const phoneValidation = validatePhone(data.phone);
    if (phoneValidation !== true) {
      setError("phone", {
        type: "manual",
        message: phoneValidation as string,
      });
      return;
    }

    // Проверка email
    const normalizedEmail = data.email.toLowerCase().trim();
    if (existingEmails.includes(normalizedEmail)) {
      setError("email", {
        type: "manual",
        message: "Рабочий с таким email уже существует",
      });
      return;
    }

    // Проверка логина
    const normalizedLogin = data.login.toLowerCase().trim();
    if (existingLogins.includes(normalizedLogin)) {
      setError("login", {
        type: "manual",
        message: "Рабочий с таким логином уже существует",
      });
      return;
    }

    // Проверка специальности
    if (!data.specialty) {
      setError("specialty", {
        type: "manual",
        message: "Выберите специальность",
      });
      return;
    }

    const result = await dispatch(createWorker(data));

    if (createWorker.fulfilled.match(result)) {
      setCreatedWorker({
        name: data.name,
        login: data.login,
        email: data.email,
        specialty: data.specialty,
        phone: data.phone,
      });
      reset();
    }
  };

  // Определяем, заблокирована ли кнопка
  const isButtonDisabled = () => {
    // Проверяем наличие ошибок в форме
    const hasErrors = Object.keys(errors).length > 0;

    // Проверяем, есть ли ошибки для email или login
    const hasEmailError = !!errors.email;
    const hasLoginError = !!errors.login;

    return isLoading || hasErrors || hasEmailError || hasLoginError;
  };

  return (
    <section className="new-worker">
      <div className="container">
        <div className="new-worker__wrapper">
          <div className="new-worker__left">
            <h2 className="new-worker__title">Добавление работника</h2>
            <form
              className="new-worker__form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="new-worker__field">
                <select
                  className="custom-select"
                  {...register("specialty", {
                    required: "Выберите специальность",
                  })}
                >
                  <option value="">Выберите специальность</option>
                  <option value="Рабочий">Рабочий</option>
                </select>
                {errors.specialty && (
                  <span className="custom-input__error"
                  >
                    {errors.specialty.message}
                  </span>
                )}
              </div>

              <div className="new-worker__field">
                <CustomInput
                  placeholder="ФИО"
                  type="text"
                  {...register("name", {
                    required: "Обязательное поле",
                  })}
                />
                {errors.name && (
                  <span className="custom-input__error"
                  >
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="new-worker__field">
                <CustomInput
                  placeholder="Email"
                  type="email"
                  {...register("email", {
                    required: "Обязательное поле",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Некорректный email адрес",
                    },
                  })}
                />
                {errors.email && (
                  <span className="custom-input__error"
                  >
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="new-worker__field">
                <CustomInput
                  placeholder="Номер телефона"
                  type="tel"
                  {...register("phone", {
                    required: "Обязательное поле",
                    validate: validatePhone,
                  })}
                />
                {errors.phone && (
                  <span className="custom-input__error"
                  >
                    {errors.phone.message}
                  </span>
                )}
              </div>

              <div className="new-worker__field">
                <CustomInput
                  placeholder="Логин"
                  type="text"
                  {...register("login", {
                    required: "Обязательное поле",
                    minLength: {
                      value: 3,
                      message: "Логин должен содержать минимум 3 символа",
                    },
                  })}
                />
                {errors.login && (
                  <span className="custom-input__error"
                  >
                    {errors.login.message}
                  </span>
                )}
              </div>

              <button className="new-worker__create-btn" type="submit" disabled={isButtonDisabled()}>
                {isLoading ? "Создание..." : "Создать работника"}
              </button>
            </form>
            {error && (
              <div className="new-worker__error">
                {error}
                <button
                  className="new-worker__error-btn"
                  onClick={() => dispatch(clearWorkerError())}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="new-worker__right">
            {createdWorker?.login && tempPassword ? (
              <div className="new-worker__data"
              >
                <h3 className="new-worker__right-title">
                  Рабочий создан!
                </h3>
                <div className="new-worker__right-block">
                  <span>Логин: {createdWorker.login} </span>
                  <button className="new-worker__copy-btn"
                    onClick={() =>
                      navigator.clipboard.writeText(createdWorker.login)
                    }
                  >
                    Копировать
                  </button>
                </div>
                <div className="new-worker__right-block">
                  <span>Пароль: {tempPassword} </span>
                  <button className="new-worker__copy-btn"
                    onClick={() => navigator.clipboard.writeText(tempPassword)}
                  >
                    Копировать
                  </button>
                </div>
                <button className="new-worker__add-more-btn"
                  onClick={() => {
                    setCreatedWorker(null);
                    reset();
                    clearErrors();
                  }}
                >
                  Создать еще
                </button>
              </div>
            ) : (
              <div className="new-worker__icon">
                <PiCat size={160} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
