import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoutButton } from './LogoutButton'

export function Layout() {
  const { user } = useAuth()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Mi Cartelera Personal</p>
          <p className="user-email">{user?.email}</p>
        </div>
        <LogoutButton />
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
