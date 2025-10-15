import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/redux"

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "user" | "admin";
}

export const ProtectedRoute = ({children, requiredRole}: ProtectedRouteProps) => {
    const {user} = useAppSelector((state) => state.auth)

    if(!user) {
        return (
            <Navigate to="/login" replace />
        )
    }

    if(requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />
    }

    return (
        <>{children}</>
    )
}