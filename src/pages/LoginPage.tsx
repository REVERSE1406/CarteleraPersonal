import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const { error } = await signIn(email.trim(), password)
      if (error) {
        setErrorMessage(error.message)
        return
      }
      navigate('/', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-card">
        <p className="eyebrow">Mi Cartelera Personal</p>
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitle">Entra para ver y gestionar tu catálogo.</p>

        <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
          <label htmlFor="login-email">Correo electrónico</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          {errorMessage !== null && (
            <p className="form-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </section>
    </div>
  )
}
