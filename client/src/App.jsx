import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import GoogleSignIn from './components/GoogleSignIn'
import StatCard from './components/StatCard'
import TournamentCard from './components/TournamentCard'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    fetch(`${API_URL}/api/auth/me`, { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 401) return null
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Unable to check your session.')
        return data.user
      })
      .then((sessionUser) => {
        if (active) setUser(sessionUser)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const handleGoogleCredential = useCallback(async (credential) => {
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Google sign-in failed.')
      setUser(data.user)
    } catch (requestError) {
      setError(requestError.message)
    }
  }, [])

  const handleSignOut = async () => {
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!response.ok) throw new Error('Unable to sign out. Please try again.')
      setUser(null)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (isLoading) {
    return <main className="auth-page"><p role="status">Checking your session…</p></main>
  }

  if (!user) {
    return (
      <main className="auth-page">
        <section className="auth-card" aria-labelledby="auth-heading">
          <div className="brand-mark" aria-hidden="true">TI</div>
          <p className="eyebrow">TOURNAMENT INTELLIGENCE</p>
          <h1 id="auth-heading">Welcome back</h1>
          <p className="auth-description">Sign in with your Google account to access your tournament dashboard.</p>
          <GoogleSignIn onCredential={handleGoogleCredential} onError={setError} />
          {error && <p className="auth-error" role="alert">{error}</p>}
          {!import.meta.env.VITE_GOOGLE_CLIENT_ID && (
            <p className="auth-hint">Set VITE_GOOGLE_CLIENT_ID in client/.env to enable Google sign-in.</p>
          )}
        </section>
      </main>
    )
  }

  return (
    <div>
      <Navbar user={user} onSignOut={handleSignOut} />

      <main className="dashboard">
        <h1>Dashboard</h1>
        <p>Welcome to Tournament Intelligence Platform, {user.name}.</p>
        {error && <p className="auth-error" role="alert">{error}</p>}

        <section className="stats">
          <StatCard title="Tournaments" value="5" />
          <StatCard title="Teams" value="24" />
          <StatCard title="Players" value="180" />
          <StatCard title="Matches" value="72" />
        </section>

        <h2>Recent Tournaments</h2>

        <section className="tournaments">
          <TournamentCard name="Chennai Cup 2026" teams="12" matches="36" />
          <TournamentCard name="College League 2026" teams="8" matches="24" />
        </section>
      </main>
    </div>
  )
}

export default App
