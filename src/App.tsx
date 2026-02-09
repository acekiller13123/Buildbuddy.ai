import React, { useState, useEffect } from 'react'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { blink } from './lib/blink'
import { Toaster } from 'sonner'
import { Spinner } from './components/ui/spinner'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Spinner size="lg" className="text-primary" />
      </div>
    )
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      {!user ? <LandingPage /> : <DashboardPage />}
    </>
  )
}

export default App
