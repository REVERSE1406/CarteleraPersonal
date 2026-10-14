import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export function LogoutButton() {
  const { status, signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (status !== 'authenticated') {
    return null
  }

  async function handleSignOut(): Promise<void> {
    setIsSigningOut(true)
    try {
      await signOut()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => void handleSignOut()}
      disabled={isSigningOut}
    >
      {isSigningOut ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  )
}
