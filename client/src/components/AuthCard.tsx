import { PiCat } from "react-icons/pi";
import { CustomInput } from "../ui/CustomInput";
import { Link } from "react-router-dom";

interface AuthCard {
  title: string;
  btnText: string;
}

export const AuthCard = (props: AuthCard) => {
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
            <form className="auth__card-form">
              <CustomInput
                type="text"
                name="login"
                id="login"
                placeholder="Логин"
              />
              <CustomInput
                type="password"
                name="password"
                id="password"
                placeholder="Пароль"
              />
              <button className="auth__card-btn" type="submit">
                {props.btnText}
              </button>
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
