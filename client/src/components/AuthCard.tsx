import { PiCat } from "react-icons/pi";
import { CustomInput } from "../ui/CustomInput";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginUser, registerUser } from "../store/slices/authSlice";


interface AuthCard {
  title: string;
  btnText: string;
  isLogin?: boolean;
}

interface AuthFormData {
  login: string,
  password: string
}

export const AuthCard = (props: AuthCard) => {

  
  const {register, handleSubmit, formState: {errors}} = useForm<AuthFormData>()
  const dispatch = useAppDispatch()
  const {isLoading, error} = useAppSelector((state) => state.auth)

  const onSubmit = (data: AuthFormData) => {
    if(props.isLogin) {
      dispatch(loginUser(data))
    } else {
      dispatch(registerUser(data))
    }
  }



  return (
    <div className="auth">
      <div className="auth__wrapper">
        <h1 className="auth__title">{props.title}</h1>
        <div className="auth__card">
          <div className="auth__card-left">
            <PiCat size={100} />
          </div>
          <div className="auth__card-right">
            <h2 className="auth__card-title">Добро Пожаловать!</h2>
            <form className="auth__card-form" onSubmit={handleSubmit(onSubmit)}>
              <CustomInput
                type="text"
                placeholder="Логин"
                {...register("login", {required: "Логин обязателен"})}
                // error={errors.login?.message}
              />
              {errors.login && (
                <span className="custom-input__error">{errors.login.message}</span>
              )}
              <CustomInput
                type="password"
                placeholder="Пароль"
                {...register("password", {required: "Пароль обязателен"})}
                // error={errors.password?.message}
              />
              {errors.password && (
                <span className="custom-input__error">{errors.password.message}</span>
              )}
              <button className="auth__card-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Загрузка..." : props.btnText}
              </button>
            {error && (
              <span className="auth__error">{error}</span>
            )}
            </form>
            <span className="auth__card-right-link">
              {props.title == "Авторизация" ? (
                <Link to="/register">Еще нет аккаунта?</Link>
              ) : (
                <Link to="/login">Уже есть аккаунт?</Link>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
