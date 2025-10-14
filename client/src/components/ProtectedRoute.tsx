import { Navigate } from "react-router-dom"
import { useAppSelector } from "../hooks/redux"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export const ProtectedRoute = ({children}: ProtectedRouteProps) => {
    const {user} = useAppSelector((state) => state.auth)

    if(!user) {
        return (
            <Navigate to="/login" replace />
        )
    }

    return (
        <>{children}</>
    )
}