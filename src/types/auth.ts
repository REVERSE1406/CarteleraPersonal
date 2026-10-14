import type { Session, User } from '@supabase/supabase-js'

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthState {
  status: AuthStatus
  session: Session | null
  user: User | null
}

export interface SignUpResult {
  error: Error | null
  needsEmailConfirmation: boolean
}

export interface SignInResult {
  error: Error | null
}

export interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string) => Promise<SignUpResult>
  signIn: (email: string, password: string) => Promise<SignInResult>
  signOut: () => Promise<void>
}
