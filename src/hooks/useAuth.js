import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { supabase } from '../lib/supabase'

export function useAuth() {
  const { isConnected, address } = useAccount()
  const [emailSession, setEmailSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmailSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setEmailSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const connected = isConnected || !!emailSession

  const identity = isConnected
    ? address
    : emailSession?.user?.email
      ? emailSession.user.email.split('@')[0] + '.fil'
      : 'you.fil'

  const signOut = async () => {
    if (emailSession) await supabase.auth.signOut()
  }

  return { connected, identity, address, emailSession, isConnected, signOut }
}
