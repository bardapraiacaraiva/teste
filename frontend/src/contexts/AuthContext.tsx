import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  tenant_id: string
  tenant_name: string
  role: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, isAuthenticated: true, loading: false }
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  signup: (data: { name: string; email: string; password: string; company: string; nif: string }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const stored = localStorage.getItem('lucas_user')
    if (stored) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(stored) })
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = async (email: string, _password: string): Promise<boolean> => {
    const user: User = {
      id: 'user_001',
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
      tenant_id: 'tenant_001',
      tenant_name: 'Empresa Demo Lusaconta',
      role: 'owner',
    }
    localStorage.setItem('lucas_user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', payload: user })
    return true
  }

  const signup = async (data: { name: string; email: string; password: string; company: string; nif: string }): Promise<boolean> => {
    const user: User = {
      id: 'user_' + Date.now(),
      email: data.email,
      name: data.name,
      tenant_id: 'tenant_' + Date.now(),
      tenant_name: data.company,
      role: 'owner',
    }
    localStorage.setItem('lucas_user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', payload: user })
    return true
  }

  const logout = () => {
    localStorage.removeItem('lucas_user')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
