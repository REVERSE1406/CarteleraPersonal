import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function SignUpPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setErrorMessage(null)
    setInfoMessage(null)
    setIsSubmitting(true)

    try {
      const { error, needsEmailConfirmation } = await signUp(email.trim(), password)
      if (error) {
        setErrorMessage(error.message)
        return
      }

      if (needsEmailConfirmation) {
        setInfoMessage('Revisa tu correo para confirmar la cuenta y luego inicia sesión.')
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
        <h1>Crear cuenta</h1>
        <p className="auth-subtitle">Regístrate para empezar tu cartelera.</p>

        <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
          <label htmlFor="signup-email">Correo electrónico</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="signup-password">Contraseña</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
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

          {infoMessage !== null && (
            <p className="form-info" role="status">
              {infoMessage}
            </p>
          )}

          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </section>
    </div>
  )
}
