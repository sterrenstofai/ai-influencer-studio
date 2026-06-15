import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './context/theme'
import { AuthProvider } from './context/auth'
import { StoreProvider } from './store'
import { silentRefreshHFToken } from './utils/higgsfieldAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Nav from './components/Nav'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Influencers from './pages/Influencers'
import Inspiration from './pages/Inspiration'
import BrandDeals from './pages/BrandDeals'
import Create from './pages/Create'
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'
import AuthCallback from './pages/AuthCallback'

function AppRoutes() {
  useEffect(() => {
    silentRefreshHFToken()
    function onVisible() {
      if (document.visibilityState === 'visible') silentRefreshHFToken()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  return (
    <>
      <Nav />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing"  element={<Pricing />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected — requires login */}
        <Route path="/influencers" element={<ProtectedRoute><Influencers /></ProtectedRoute>} />
        <Route path="/inspiration" element={<ProtectedRoute><Inspiration /></ProtectedRoute>} />
        <Route path="/brand-deals" element={<ProtectedRoute><BrandDeals /></ProtectedRoute>} />
        <Route path="/create"      element={<ProtectedRoute><Create /></ProtectedRoute>} />
        <Route path="/settings"    element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
    <StoreProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </StoreProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}
