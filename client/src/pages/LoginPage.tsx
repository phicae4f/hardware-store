import { AuthCard } from "../components/AuthCard"

export const LoginPage = () => {
    return (
        <section>
            <div className="container">
                <AuthCard title="Авторизация" btnText="Войти"/>
            </div>
        </section>
    )
}