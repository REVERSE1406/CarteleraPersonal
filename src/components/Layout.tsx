import { NavLink, Outlet } from 'react-router-dom'
import { MiListaProvider } from '../context/MiListaContext'
import { useAuth } from '../context/AuthContext'
import { LogoutButton } from './LogoutButton'

export function Layout() {
  const { user } = useAuth()

  return (
    <MiListaProvider>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <p className="eyebrow">Mi Cartelera Personal</p>
            <p className="user-email">{user?.email}</p>
          </div>
          <nav className="app-nav">
            <NavLink to="/" end>
              Catálogo
            </NavLink>
            <NavLink to="/mi-lista">Mi lista</NavLink>
          </nav>
          <LogoutButton />
        </header>
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </MiListaProvider>
  )
}
