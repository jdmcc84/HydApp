import { useEffect, useState } from 'react'

type HealthResponse = {
  ok: boolean
  message: string
}

export default function App() {
  const [apiMessage, setApiMessage] = useState<string>('Loading…')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 1) Read the base URL from Vite env
    const base = import.meta.env.VITE_API_URL as string | undefined
    if (!base) {
      setError('VITE_API_URL is not set')
      return
    }

    // 2) Build the full URL and fetch
    const url = `${base}/api/health`

    // This is where those consts go:
    const fetchHealth = async () => {
      try {
        const res = await fetch(url)          // <— const res
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data: HealthResponse = await res.json()  // <— const data
        setApiMessage(data.message ?? 'No message field')
      } catch (err: any) {
        setError(err.message || 'Request failed')
      }
    }

    fetchHealth()
  }, [])

  return (
    <main style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>HydApp (Frontend)</h1>
      {error ? (
        <p style={{ color: 'crimson' }}>Error: {error}</p>
      ) : (
        <p>
          Backend says: <strong>{apiMessage}</strong>
        </p>
      )}
      <p style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
        VITE_API_URL = {String(import.meta.env.VITE_API_URL || '(not set)')}
      </p>
    </main>
  )
}