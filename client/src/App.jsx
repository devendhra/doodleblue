import { useEffect, useState } from 'react'

// Base URL of the Prolane backend (server/.env PORT decides the port).
// Override via VITE_API_URL in client/.env if needed.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function App() {
  const [health, setHealth] = useState(null)

  // Ping the backend's health endpoint on load so we can see at a
  // glance whether the server is up and CORS is configured right.
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then(setHealth)
      .catch(() => setHealth({ status: 'unreachable' }))
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100">
      <h1 className="text-5xl font-bold tracking-tight">Prolane</h1>
      <p className="mt-3 text-zinc-400">Sports gear, engineered.</p>
      <p className="mt-8 rounded-full border border-zinc-800 px-4 py-1.5 text-sm">
        API{' '}
        <span className={health?.status === 'ok' ? 'text-emerald-400' : 'text-red-400'}>
          {health ? health.status : 'checking…'}
        </span>
      </p>
    </main>
  )
}

export default App
