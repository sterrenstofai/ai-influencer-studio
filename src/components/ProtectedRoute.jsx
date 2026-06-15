import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth'

/**
 * Wraps any route that requires the user to be logged in.
 * Shows a spinner while the auth state is loading (session === undefined).
 */
export default function ProtectedRoute({ children }) {
  const { session } = useAuth()

  // Still loading
  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#07070E' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.12)', borderTopColor: '#A78BFA', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
