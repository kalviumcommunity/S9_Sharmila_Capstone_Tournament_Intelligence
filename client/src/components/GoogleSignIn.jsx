import { useEffect, useRef, useState } from 'react'

function GoogleSignIn({ onCredential, onError }) {
  const buttonRef = useRef(null)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const [isLoading, setIsLoading] = useState(Boolean(clientId))

  useEffect(() => {
    if (!clientId) return

    let active = true
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      if (!active) return
      if (!window.google?.accounts?.id || !buttonRef.current) {
        onError('Google sign-in loaded without its identity service. Please try again.')
        setIsLoading(false)
        return
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => {
          if (credential) onCredential(credential)
          else onError('Google did not return a sign-in credential.')
        },
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        width: 280,
      })
      setIsLoading(false)
    }
    script.onerror = () => {
      if (active) {
        onError('Google sign-in could not be loaded. Check your connection and try again.')
        setIsLoading(false)
      }
    }
    document.head.appendChild(script)

    return () => {
      active = false
      script.remove()
    }
  }, [clientId, onCredential, onError])

  return (
    <div className="google-sign-in">
      {isLoading && <p role="status">Loading Google sign-in…</p>}
      <div ref={buttonRef} />
    </div>
  )
}

export default GoogleSignIn
