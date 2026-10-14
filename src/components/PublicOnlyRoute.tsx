import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PublicOnlyRoute() {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="auth-screen">
        <p className="status-message">Cargando sesión…</p>
      </div>
    )
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
